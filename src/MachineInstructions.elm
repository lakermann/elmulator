module MachineInstructions exposing (..)

import BitOperations exposing (combineBytes, getAddressLE)
import Bitwise
import ConditionCodesFlags
import MachineState exposing (ByteValue, ConditionCodes, CpuState, MachineStateDiff(..), MachineStateDiffEvent(..), RegisterValue, SetFlagEvent(..))
import Psw



-- general


dcr_ : (RegisterValue -> MachineStateDiffEvent) -> RegisterValue -> CpuState -> MachineStateDiff
dcr_ diffEvent registerValue cpuState =
    let
        newPc =
            cpuState.pc + 1

        newRegisterValue =
            registerValue - 1
    in
    Events
        [ diffEvent newRegisterValue
        , SetFlag (SetFlagZ (ConditionCodesFlags.zFlag newRegisterValue))
        , SetFlag (SetFlagS (ConditionCodesFlags.sFlag newRegisterValue))
        , SetFlag (SetFlagP (ConditionCodesFlags.pFlag newRegisterValue))
        , SetPC newPc
        ]


mvi_d8_ : MachineStateDiffEvent -> CpuState -> MachineStateDiff
mvi_d8_ diffEvent cpuState =
    let
        newPc =
            cpuState.pc + 2
    in
    Events
        [ diffEvent
        , SetPC newPc
        ]


lxi_d16_ : MachineStateDiffEvent -> MachineStateDiffEvent -> CpuState -> MachineStateDiff
lxi_d16_ firstDiffEvent secondDiffEvent cpuState =
    let
        newPc =
            cpuState.pc + 3
    in
    Events
        [ firstDiffEvent
        , secondDiffEvent
        , SetPC newPc
        ]



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
    lxi_d16_ (SetRegisterB secondArg) (SetRegisterC firstArg) cpuState



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



-- 0x05


dcr_b : CpuState -> MachineStateDiff
dcr_b cpuState =
    dcr_ (\value -> SetRegisterB value) cpuState.b cpuState



-- 0x06


mvi_b_d8 : ByteValue -> CpuState -> MachineStateDiff
mvi_b_d8 firstArg cpuState =
    mvi_d8_ (SetRegisterB firstArg) cpuState



-- 0x09


dad_b : CpuState -> MachineStateDiff
dad_b cpuState =
    let
        newPc =
            cpuState.pc + 1

        hl =
            Bitwise.or (Bitwise.shiftLeftBy 8 cpuState.h) cpuState.l

        bc =
            Bitwise.or (Bitwise.shiftLeftBy 8 cpuState.b) cpuState.c
    in
    let
        newH =
            Bitwise.shiftRightBy 8 (Bitwise.and (hl + bc) 0xFF00)

        newL =
            Bitwise.and (hl + bc) 0xFF

        newCY =
            Bitwise.and (hl + bc) 0xFFFF0000 > 0
    in
    Events
        [ SetRegisterH newH
        , SetRegisterL newL
        , SetFlag (SetFlagZ newCY)
        , SetPC newPc
        ]



-- 0x0d


dcr_c : CpuState -> MachineStateDiff
dcr_c cpuState =
    dcr_ (\value -> SetRegisterC value) cpuState.c cpuState



-- 0x0e


mvi_c_d8 : ByteValue -> CpuState -> MachineStateDiff
mvi_c_d8 firstArg cpuState =
    mvi_d8_ (SetRegisterC firstArg) cpuState



--0x0f


rrc : CpuState -> MachineStateDiff
rrc cpuState =
    let
        newPc =
            cpuState.pc + 1

        newA =
            Bitwise.or (Bitwise.shiftLeftBy 7 (Bitwise.and cpuState.a 1)) (Bitwise.shiftRightBy 1 cpuState.a)

        newCY =
            1 == Bitwise.and cpuState.a 1
    in
    Events
        [ SetRegisterA newA
        , SetFlag (SetFlagCY newCY)
        , SetPC newPc
        ]



-- 0x11


lxi_d_d16 : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
lxi_d_d16 firstArg secondArg cpuState =
    lxi_d16_ (SetRegisterD secondArg) (SetRegisterE firstArg) cpuState



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
