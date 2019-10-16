module MachineInstructions exposing (..)

import BitOperations exposing (combineBytes, getAddressLE)
import MachineState exposing (ByteValue, ConditionCodes, CpuState, MachineStateDiff(..), MachineStateDiffEvent(..))
import Psw



-- 0x00


nop : CpuState -> MachineStateDiff
nop cpuState =
    let
        newPc =
            cpuState.pc + 1
    in
    Events [ SetPC newPc ]



-- 0x01


lxi_b_d16 : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
lxi_b_d16 firstArg secondArg cpuState =
    let
        newPc =
            cpuState.pc + 3
    in
    Events
        [ SetRegisterB secondArg
        , SetRegisterC firstArg
        , SetPC newPc
        ]



-- 0x02


stax_b : CpuState -> MachineStateDiff
stax_b cpuState =
    let
        address =
            combineBytes cpuState.b cpuState.c

        newPc =
            cpuState.pc + 1
    in
    Events
        [ SetMemory address cpuState.a
        , SetPC newPc
        ]



-- 0x03


inx_b : CpuState -> MachineStateDiff
inx_b cpuState =
    let
        address =
            combineBytes cpuState.b cpuState.c

        data =
            combineBytes cpuState.b cpuState.c + 1

        newPc =
            cpuState.pc + 1
    in
    Events
        [ SetMemory address data
        , SetPC newPc
        ]



-- 0x06


mvi_b_d8 : ByteValue -> CpuState -> MachineStateDiff
mvi_b_d8 firstArg cpuState =
    let
        newPc =
            cpuState.pc + 2
    in
    Events
        [ SetRegisterB firstArg
        , SetPC newPc
        ]



-- 0xc3


jmp : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
jmp firstArg secondArg _ =
    Events [ SetPC (getAddressLE firstArg secondArg) ]



-- 0xc5


push_b : CpuState -> MachineStateDiff
push_b cpuState =
    let
        newPc =
            cpuState.pc + 1

        addressForB =
            cpuState.sp - 1

        addressForC =
            cpuState.sp - 2

        newSP =
            cpuState.sp - 2
    in
    Events
        [ SetMemory addressForB cpuState.b
        , SetMemory addressForC cpuState.c
        , SetSP newSP
        , SetPC newPc
        ]



-- 0xf5


push_psw : CpuState -> MachineStateDiff
push_psw cpuState =
    let
        newPc =
            cpuState.pc + 1

        addressForA =
            cpuState.sp - 1

        addressForPSW =
            cpuState.sp - 2

        newSP =
            cpuState.sp - 2

        psw =
            Psw.createPSW cpuState.conditionCodes
    in
    Events
        [ SetMemory addressForA cpuState.a
        , SetMemory addressForPSW psw
        , SetSP newSP
        , SetPC newPc
        ]
