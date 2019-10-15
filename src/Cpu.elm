module Cpu exposing (..)

import Array
import MachineState exposing (Address, ConditionCodes, CpuState, Flag, MachineState(..), MachineStateDiff(..), MachineStateDiffEvent(..), Memory, Register, SetFlagEvent(..))
import OpCode exposing (OpCode)
import OpCodeTable exposing (getOpCodeFromTable)


oneStep : CpuState -> MachineState
oneStep cpuState =
    let
        opcode =
            0

        -- memory
        opCodeFromTable =
            getOpCodeFromTable opcode

        machineStateDiff =
            Maybe.withDefault (Failed (Just cpuState) "Error while getting OpCode") (Maybe.map (evaluate cpuState) opCodeFromTable)
    in
    apply machineStateDiff cpuState


evaluate : CpuState -> OpCode -> MachineStateDiff
evaluate cpuState opCode =
    opCode.information.impl cpuState


apply : MachineStateDiff -> CpuState -> MachineState
apply machineStateDiff cpuState =
    case machineStateDiff of
        Failed maybePreviousState errorMessage ->
            Invalid maybePreviousState errorMessage

        Events machineStateDiffEvents ->
            Valid (List.foldl applyEvent cpuState machineStateDiffEvents)


applyEvent : MachineStateDiffEvent -> CpuState -> CpuState
applyEvent event cpuState =
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

        SetMemory address value ->
            setMemory address value cpuState

        SetPC value ->
            { cpuState | pc = value }

        SetSP value ->
            { cpuState | sp = value }

        SetFlag setFlagEvent ->
            { cpuState | conditionCodes = setFlag setFlagEvent cpuState.conditionCodes }

        SetIntEnable flag ->
            { cpuState | intEnable = flag }


setMemory : Address -> Int -> CpuState -> CpuState
setMemory address value cpuState =
    let
        updatedMemory =
            Array.set address value cpuState.memory
    in
    { cpuState | memory = updatedMemory }


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


init : () -> MachineState
init _ =
    let
        memory =
            initMemory

        conditionCodes =
            initConditionCodes
    in
    Valid
        (CpuState
            0
            0
            0
            0
            0
            0
            0
            0
            0
            memory
            conditionCodes
            False
        )


initMemory : Memory
initMemory =
    Array.initialize 0xFFFF (always 0)


initConditionCodes : ConditionCodes
initConditionCodes =
    ConditionCodes False False False False False
