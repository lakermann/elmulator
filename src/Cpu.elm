module Main exposing (..)

import CpuState exposing (CpuState, MachineStateDiff(..), MachineStateDiffEvent(..), Register)
import OpCode exposing (MachineState(..), OpCode, getOpCodeFromTable)


oneStep : CpuState -> MachineState
oneStep state =
    let
        opcode =
            0

        -- memory
        opCodeFromTable =
            getOpCodeFromTable opcode

        machineStateDiff =
            Maybe.map (evaluate state) opCodeFromTable
    in
    Maybe.withDefault (Invalid (Just state) "error while doing step") machineState


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


        SetFlagZ flag ->


        SetFlagS flag ->


        SetFlagP flag ->


        SetFlagCY flag ->


        SetFlagAC flag ->


        SetIntEnable flag ->
