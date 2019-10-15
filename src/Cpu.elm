module Main exposing (..)

import CpuState exposing (CpuState, MachineStateDiff(..), MachineStateDiffEvent(..), Register)
import OpCode exposing (MachineState(..), OpCode, getOpCodeFromTable)


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
        Failed maybePreviousState errorMessage -> Invalid maybePreviousState errorMessage
        Events machineStateDiffEvents -> Valid (List.foldl applyEvent cpuState machineStateDiffEvents)

applyEvent : MachineStateDiffEvent -> CpuState -> CpuState
applyEvent event cpuState =
    case event of
        SetRegisterA register -> cpuState


        SetRegisterB register -> cpuState


        SetRegisterC register -> cpuState


        SetRegisterD register -> cpuState


        SetRegisterE register -> cpuState


        SetRegisterH register -> cpuState


        SetRegisterL register -> cpuState


        SetMemory address int -> cpuState


        SetPC int -> cpuState


        SetSP int -> cpuState


        SetFlagZ flag -> cpuState


        SetFlagS flag -> cpuState


        SetFlagP flag -> cpuState


        SetFlagCY flag -> cpuState


        SetFlagAC flag -> cpuState


        SetIntEnable flag -> cpuState
