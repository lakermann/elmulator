module Cpu exposing (..)

import Array exposing (Array)
import Bitwise
import EmulatorState exposing (AddressValue, ByteValue, ConditionCodes, CpuState, EmulatorState(..), Flag, MachineState, MachineStateDiff(..), MachineStateDiffEvent(..), Memory, Ports, RegisterValue, SetCpuStateEvent(..), SetFlagEvent(..), SetPortEvent(..), SetShiftRegisterEvent(..), ShiftRegister)
import IO exposing (pressLeft, pressRight, pressSpace, relaseLeft, relaseRight, relaseSpace)
import MachineInstructions exposing (push_)
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


checkForInterrupt : MachineState -> EmulatorState
checkForInterrupt machineState =
    let
        intEnabled =
            True

        --machineState.cpuState.intEnable
    in
    if intEnabled then
        generateInterrupt machineState 2

    else
        Valid machineState


generateInterrupt : MachineState -> Int -> EmulatorState
generateInterrupt machineState number =
    let
        machineStateDiff =
            genereateInterruptEvents machineState number
    in
    apply machineStateDiff machineState


genereateInterruptEvents : MachineState -> Int -> MachineStateDiff
genereateInterruptEvents machineState number =
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
            [ [ SetCpu (SetPC newPc) ]
            , pushEvents
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
            readMemoryProvider address 1 memory

        secondValueProvider =
            readMemoryProvider address 2 memory

        implementation =
            getImplementation opCode firstValueProvider secondValueProvider

        cycles =
            getCycles opCode
    in
    implementation machineState
        |> addCycles cycles


readMemoryProvider : AddressValue -> Int -> Memory -> () -> ByteValue
readMemoryProvider address offset memory =
    let
        readValue =
            Array.get (address + offset) memory
    in
    \_ ->
        case readValue of
            Just value ->
                value

            Nothing ->
                0



-- TODO: What should we do here?


readMemory : AddressValue -> AddressValue -> Memory -> Array ByteValue
readMemory startAddress endAddress memory =
    Array.slice startAddress endAddress memory


addCycles : Int -> MachineStateDiff -> MachineStateDiff
addCycles cycles machineStateDiff =
    case machineStateDiff of
        Failed _ _ ->
            machineStateDiff

        Events list ->
            Events (list ++ [ SetCpu (AddCycles cycles) ])


apply : MachineStateDiff -> MachineState -> EmulatorState
apply machineStateDiff cpuState =
    case machineStateDiff of
        Failed maybePreviousState errorMessage ->
            Invalid maybePreviousState errorMessage

        Events machineStateDiffEvents ->
            Valid (List.foldl applyEvent cpuState machineStateDiffEvents)


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
                0xF000
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
    Ports 1 0


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
