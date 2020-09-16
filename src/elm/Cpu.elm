module Cpu exposing (..)

import Array exposing (Array)
import Bitwise
import Config exposing (interrupt_every)
import CpuValidator exposing (validate)
import EmulatorState exposing (AddressValue, ByteValue, ConditionCodes, CpuState, EmulatorState(..), Flag, MachineState, MachineStateDiff(..), MachineStateDiffEvent(..), Memory, Ports, RegisterValue, SetCpuStateEvent(..), SetFlagEvent(..), SetPortEvent(..), SetShiftRegisterEvent(..), ShiftRegister)
import IO exposing (pressLeft, pressRight, pressSpace, relaseLeft, relaseRight, relaseSpace)
import MachineInstructions exposing (push_)
import Memory exposing (createMemoryProvider)
import OpCode exposing (OpCode, getCycles, getImplementation)
import OpCodeTable exposing (getOpCodeFromTable)
import UI.Msg exposing (GameKey(..))


oneStep : MachineState -> EmulatorState
oneStep cpuState =
    let
        opcode =
            getCurrentOpCode cpuState

        opCodeFromTable =
            getOpCodeFromTable opcode

        machineStateDiff =
            Maybe.withDefault (Failed (Just cpuState) "Error while getting OpCode") (Maybe.map (evaluate cpuState) opCodeFromTable)
    in
    apply machineStateDiff cpuState


nStep : Int -> MachineState -> EmulatorState
nStep n machineState =
    let
        ns =
            oneStep machineState
    in
    if n > 1 then
        case ns of
            Valid cs ->
                nStep (n - 1) cs

            Invalid _ _ ->
                ns

    else
        ns


nStep_withInterrupt : Int -> MachineState -> EmulatorState
nStep_withInterrupt n machineState =
    let
        ns =
            oneStep machineState
    in
    if n > 1 then
        case ns of
            Valid cs ->
                if modBy interrupt_every machineState.step == 0 then
                    let
                        newNs =
                            checkForInterrupt cs
                    in
                    case newNs of
                        Valid ncs ->
                            nStep_withInterrupt (n - 1) ncs

                        Invalid _ _ ->
                            newNs

                else
                    nStep_withInterrupt (n - 1) cs

            Invalid _ _ ->
                ns

    else
        ns


checkForInterrupt : MachineState -> EmulatorState
checkForInterrupt machineState =
    let
        intEnabled =
            machineState.cpuState.intEnable
    in
    if intEnabled then
        generateInterrupt machineState 2

    else
        Valid machineState


interrupt : MachineState -> EmulatorState
interrupt machineState =
    generateInterrupt machineState 2


generateInterrupt : MachineState -> Int -> EmulatorState
generateInterrupt machineState number =
    let
        machineStateDiff =
            generateInterruptEvents machineState number
    in
    apply machineStateDiff machineState


generateInterruptEvents : MachineState -> Int -> MachineStateDiff
generateInterruptEvents machineState number =
    let
        newPc =
            8 * number

        pcHigh =
            Bitwise.shiftRightBy 8 (Bitwise.and machineState.cpuState.pc 0xFF00)

        pcLow =
            Bitwise.and machineState.cpuState.pc 0xFF
    in
    let
        pushEvents =
            extractEvents (push_ pcHigh pcLow machineState)
    in
    Events
        (List.concat
            [ pushEvents
            , [ SetCpu (SetPC newPc) ]
            ]
        )


extractEvents : MachineStateDiff -> List MachineStateDiffEvent
extractEvents machineStateDiff =
    case machineStateDiff of
        Failed _ _ ->
            []

        Events list ->
            list


getCurrentOpCode : MachineState -> ByteValue
getCurrentOpCode machineState =
    let
        pc =
            machineState.cpuState.pc

        maybeOpCode =
            Array.get pc machineState.memory
    in
    case maybeOpCode of
        Just opCode ->
            opCode

        Nothing ->
            0



-- TODO: We should probably return a Maybe here and deal with problems in oneStep above


evaluate : MachineState -> OpCode -> MachineStateDiff
evaluate machineState opCode =
    let
        address =
            machineState.cpuState.pc

        memory =
            machineState.memory

        firstValueProvider =
            createMemoryProvider address 1 memory

        secondValueProvider =
            createMemoryProvider address 2 memory

        implementation =
            getImplementation opCode firstValueProvider secondValueProvider

        cycles =
            getCycles opCode
    in
    implementation machineState
        |> addCycles cycles


addCycles : Int -> MachineStateDiff -> MachineStateDiff
addCycles cycles machineStateDiff =
    case machineStateDiff of
        Failed _ _ ->
            machineStateDiff

        Events list ->
            Events (list ++ [ SetCpu (AddCycles cycles) ])


apply : MachineStateDiff -> MachineState -> EmulatorState
apply machineStateDiff cpuState =
    let
        newStep =
            cpuState.step + 1
    in
    case machineStateDiff of
        Failed maybePreviousState errorMessage ->
            Invalid maybePreviousState errorMessage

        Events machineStateDiffEvents ->
            --if invalidEvent machineStateDiffEvents then
            --    Invalid (Just cpuState) "Invalid event"
            --
            --else
            --    validate (List.foldl applyEvent { cpuState | step = newStep } machineStateDiffEvents)
            -- Enable above to search for an invalid event
            --if List.member (SetCpu (SetPC 0x0164)) machineStateDiffEvents then
            --    Invalid (Just cpuState) "BUG HERE"
            --
            --else
            Valid (List.foldl applyEvent { cpuState | step = newStep } machineStateDiffEvents)


invalidEvent : List MachineStateDiffEvent -> Bool
invalidEvent events =
    List.length (List.filterMap findMemoryEvent events) > 1


findPCEvent : MachineStateDiffEvent -> Maybe Int
findPCEvent event =
    case event of
        SetCpu (SetPC value) ->
            if value > 0x1FFF then
                Just value

            else
                Nothing

        _ ->
            Nothing


findMemoryEvent : MachineStateDiffEvent -> Maybe Int
findMemoryEvent event =
    case event of
        SetMemory address value ->
            if address == 0x23E5 && value == 0x20 then
                Just value

            else if address == 0x23E4 && value == 0x68 then
                Just value

            else
                Nothing

        _ ->
            Nothing


applyEvent : MachineStateDiffEvent -> MachineState -> MachineState
applyEvent event machineState =
    case event of
        SetMemory address value ->
            setMemory address value machineState

        SetCpu setCpuStateEvent ->
            let
                newCpuState =
                    setCpuState setCpuStateEvent machineState.cpuState
            in
            { machineState | cpuState = newCpuState }

        SetShiftRegister shiftRegisterEvent ->
            let
                newShiftRegister =
                    setShiftRegister shiftRegisterEvent machineState.shiftRegister
            in
            { machineState | shiftRegister = newShiftRegister }

        SetPort setPortEvent ->
            let
                newPorts =
                    setPorts setPortEvent machineState.ports
            in
            { machineState | ports = newPorts }


setMemory : AddressValue -> ByteValue -> MachineState -> MachineState
setMemory address value cpuState =
    let
        updatedMemory =
            Array.set address value cpuState.memory
    in
    { cpuState | memory = updatedMemory }


setCpuState : SetCpuStateEvent -> CpuState -> CpuState
setCpuState event cpuState =
    case event of
        SetRegisterA register ->
            { cpuState | a = register }

        SetRegisterB register ->
            { cpuState | b = register }

        SetRegisterC register ->
            { cpuState | c = register }

        SetRegisterD register ->
            { cpuState | d = register }

        SetRegisterE register ->
            { cpuState | e = register }

        SetRegisterH register ->
            { cpuState | h = register }

        SetRegisterL register ->
            { cpuState | l = register }

        SetPC value ->
            { cpuState | pc = value }

        SetSP value ->
            { cpuState | sp = value }

        SetFlag setFlagEvent ->
            { cpuState | conditionCodes = setFlag setFlagEvent cpuState.conditionCodes }

        SetIntEnable flag ->
            { cpuState | intEnable = flag }

        AddCycles cycles ->
            { cpuState | cycleCount = cpuState.cycleCount + cycles }


setFlag : SetFlagEvent -> ConditionCodes -> ConditionCodes
setFlag event conditionCodes =
    case event of
        SetFlagZ flag ->
            { conditionCodes | z = flag }

        SetFlagS flag ->
            { conditionCodes | s = flag }

        SetFlagP flag ->
            { conditionCodes | p = flag }

        SetFlagCY flag ->
            { conditionCodes | cy = flag }

        SetFlagAC flag ->
            { conditionCodes | ac = flag }


setShiftRegister : SetShiftRegisterEvent -> ShiftRegister -> ShiftRegister
setShiftRegister event shiftRegister =
    case event of
        SetLower data ->
            { shiftRegister | lower = data }

        SetUpper data ->
            { shiftRegister | upper = data }

        SetOffset data ->
            { shiftRegister | offset = data }


setPorts : SetPortEvent -> Ports -> Ports
setPorts event ports =
    case event of
        SetOne data ->
            { ports | one = data }

        SetTwo data ->
            { ports | one = data }


init : List ByteValue -> EmulatorState
init rom =
    let
        memory =
            initMemory rom

        conditionCodes =
            initConditionCodes

        shiftRegister =
            initShiftRegister

        ports =
            initPorts
    in
    Valid
        (MachineState
            (CpuState
                0x00
                -- A
                0x00
                -- B
                0x00
                -- C
                0x00
                -- D
                0x00
                -- E
                0x00
                -- H
                0x00
                -- L
                0xFFFF
                -- SP
                0x00
                -- PC
                conditionCodes
                False
                -- intEnable
                0
             -- cycleCount
            )
            memory
            shiftRegister
            ports
            0
        )


initMemory : List ByteValue -> Memory
initMemory rom =
    let
        lengthRom =
            List.length rom

        paddingAmount =
            0xFFFF - lengthRom

        padding =
            List.repeat paddingAmount 0

        memory =
            List.concat [ rom, padding ]
    in
    Array.fromList memory


initConditionCodes : ConditionCodes
initConditionCodes =
    ConditionCodes False False False False False


initShiftRegister : ShiftRegister
initShiftRegister =
    ShiftRegister 0 0 0


initPorts : Ports
initPorts =
    Ports 14 8


keyPressed : GameKey -> MachineState -> EmulatorState
keyPressed key machineState =
    case key of
        Left ->
            apply (pressLeft machineState) machineState

        Right ->
            apply (pressRight machineState) machineState

        Space ->
            apply (pressSpace machineState) machineState


keyReleased : GameKey -> MachineState -> EmulatorState
keyReleased key machineState =
    case key of
        Left ->
            apply (relaseLeft machineState) machineState

        Right ->
            apply (relaseRight machineState) machineState

        Space ->
            apply (relaseSpace machineState) machineState
