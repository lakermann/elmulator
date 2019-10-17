module MachineInstructions exposing (..)

import BitOperations exposing (combineBytes, getAddressLE)
import Bitwise
import ConditionCodesFlags
import MachineState exposing (ByteValue, ConditionCodes, CpuState, MachineStateDiff(..), MachineStateDiffEvent(..), RegisterValue, SetFlagEvent(..))
import Memory
import Psw



-- general


logic_flags_a : CpuState -> List MachineStateDiffEvent
logic_flags_a cpuState =
    let
        regA =
            cpuState.a
    in
    [ SetFlag (SetFlagCY False)
    , SetFlag (SetFlagAC False)
    , SetFlag (SetFlagZ (regA == 0))
    , SetFlag (SetFlagS (0x80 == Bitwise.and regA 0x80))
    , SetFlag (SetFlagP (ConditionCodesFlags.pFlag regA))
    ]


dcr_ : (RegisterValue -> MachineStateDiffEvent) -> RegisterValue -> CpuState -> MachineStateDiff
dcr_ diffEvent registerValue cpuState =
    let
        newPc =
            cpuState.pc + 1

        newRegisterValue =
            registerValue - 1
    in
    if newRegisterValue < 0 then
        Events
            [ diffEvent (256 - newRegisterValue)
            , SetFlag (SetFlagZ (ConditionCodesFlags.zFlag newRegisterValue))
            , SetFlag (SetFlagS (ConditionCodesFlags.sFlag newRegisterValue))
            , SetFlag (SetFlagP (ConditionCodesFlags.pFlag newRegisterValue))
            , SetPC newPc
            ]

    else
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


inx_ : ByteValue -> (ByteValue -> MachineStateDiffEvent) -> ByteValue -> (ByteValue -> MachineStateDiffEvent) -> CpuState -> MachineStateDiff
inx_ firstArg firstDiffEvent secondArg secondDiffEvent cpuState =
    let
        newPc =
            cpuState.pc + 1

        newSecond =
            secondArg + 1
    in
    if newSecond == 0 then
        Events
            [ firstDiffEvent (firstArg + 1)
            , secondDiffEvent newSecond
            , SetPC newPc
            ]

    else
        Events
            [ firstDiffEvent newSecond
            , SetPC newPc
            ]


dad_ : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
dad_ firstRegister secondRegister cpuState =
    let
        newPc =
            cpuState.pc + 1

        hl =
            Bitwise.or (Bitwise.shiftLeftBy 8 cpuState.h) cpuState.l

        combinedRegister =
            Bitwise.or (Bitwise.shiftLeftBy 8 firstRegister) secondRegister
    in
    let
        newH =
            Bitwise.shiftRightBy 8 (Bitwise.and (hl + combinedRegister) 0xFF00)

        newL =
            Bitwise.and (hl + combinedRegister) 0xFF

        newCY =
            Bitwise.and (hl + combinedRegister) 0xFFFF0000 > 0
    in
    Events
        [ SetRegisterH newH
        , SetRegisterL newL
        , SetFlag (SetFlagZ newCY)
        , SetPC newPc
        ]


mov_m_ : (ByteValue -> MachineStateDiffEvent) -> CpuState -> MachineStateDiff
mov_m_ diffEvent cpuState =
    let
        memoryAddress =
            getAddressLE cpuState.l cpuState.h

        newPc =
            cpuState.pc + 1
    in
    Events
        [ diffEvent (Memory.readMemory memoryAddress cpuState.memory)
        , SetPC newPc
        ]


mov_register_ : ByteValue -> CpuState -> MachineStateDiff
mov_register_ firstArg cpuState =
    let
        memoryAddress =
            getAddressLE cpuState.l cpuState.h

        newPc =
            cpuState.pc + 1
    in
    Events
        [ SetMemory memoryAddress firstArg
        , SetPC newPc
        ]


pop_ : (ByteValue -> MachineStateDiffEvent) -> (ByteValue -> MachineStateDiffEvent) -> CpuState -> MachineStateDiff
pop_ firstDiffEvent secondDiffEvent cpuState =
    let
        newSp =
            cpuState.sp + 2

        addressForTwo =
            cpuState.sp

        addressForOne =
            cpuState.sp + 1

        memory =
            cpuState.memory
    in
    Events
        [ secondDiffEvent (Memory.readMemory addressForOne memory)
        , firstDiffEvent (Memory.readMemory addressForTwo memory)
        , SetSP newSp
        ]


push_ : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
push_ firstArg secondArg cpuState =
    let
        addressForOne =
            cpuState.sp - 1

        addressForTwo =
            cpuState.sp - 2

        newSp =
            cpuState.sp - 2
    in
    Events
        [ SetMemory addressForOne firstArg
        , SetMemory addressForTwo secondArg
        , SetSP newSp
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
    inx_ cpuState.b (\data -> SetRegisterB data) cpuState.c (\data -> SetRegisterC data) cpuState



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
    dad_ cpuState.b cpuState.c cpuState



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



-- 0x13


inx_d : CpuState -> MachineStateDiff
inx_d cpuState =
    inx_ cpuState.d (\data -> SetRegisterD data) cpuState.e (\data -> SetRegisterE data) cpuState



-- 0x19


dad_d : CpuState -> MachineStateDiff
dad_d cpuState =
    dad_ cpuState.d cpuState.e cpuState



-- 0x1a


ldax_d : CpuState -> MachineStateDiff
ldax_d cpuState =
    let
        newPc =
            cpuState.pc + 1

        memoryAddress =
            Bitwise.or (Bitwise.shiftLeftBy 8 cpuState.d) cpuState.e
    in
    Events
        [ SetRegisterA (Memory.readMemory memoryAddress cpuState.memory)
        , SetPC newPc
        ]



-- 0x21


lxi_h_d16 : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
lxi_h_d16 firstArg secondArg cpuState =
    lxi_d16_ (SetRegisterH secondArg) (SetRegisterL firstArg) cpuState



-- 0x23


inx_h : CpuState -> MachineStateDiff
inx_h cpuState =
    inx_ cpuState.h (\data -> SetRegisterH data) cpuState.l (\data -> SetRegisterL data) cpuState



-- 0x26


mvi_h_d8 : ByteValue -> CpuState -> MachineStateDiff
mvi_h_d8 firstArg cpuState =
    mvi_d8_ (SetRegisterH firstArg) cpuState



-- 0x29


dad_h : CpuState -> MachineStateDiff
dad_h cpuState =
    dad_ cpuState.h cpuState.l cpuState



-- 0x31


lxi_sp_d16 : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
lxi_sp_d16 firstArg secondArg cpuState =
    let
        newPc =
            cpuState.pc + 3

        newSp =
            getAddressLE firstArg secondArg
    in
    Events
        [ SetSP newSp
        , SetPC newPc
        ]



-- 0x32


sta : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
sta firstArg secondArg cpuState =
    let
        address =
            getAddressLE firstArg secondArg

        newPc =
            cpuState.pc + 3
    in
    Events
        [ SetMemory address cpuState.a
        , SetPC newPc
        ]



-- 0x36


mvi_m_d8 : ByteValue -> CpuState -> MachineStateDiff
mvi_m_d8 firstArg cpuState =
    let
        address =
            getAddressLE cpuState.l cpuState.h
    in
    mvi_d8_ (SetMemory address firstArg) cpuState



-- 0x3a


lda : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
lda firstArg secondArg cpuState =
    let
        newPc =
            cpuState.pc + 3

        memoryAddress =
            getAddressLE firstArg secondArg
    in
    Events
        [ SetRegisterA (Memory.readMemory memoryAddress cpuState.memory)
        , SetPC newPc
        ]



-- 0x3e


mvi_a_d8 : ByteValue -> CpuState -> MachineStateDiff
mvi_a_d8 firstArg cpuState =
    mvi_d8_ (SetRegisterA firstArg) cpuState



-- 0x56


mov_d_m : CpuState -> MachineStateDiff
mov_d_m cpuState =
    mov_m_ (\data -> SetRegisterD data) cpuState



-- 0x5e


mov_e_m : CpuState -> MachineStateDiff
mov_e_m cpuState =
    mov_m_ (\data -> SetRegisterE data) cpuState



-- 0x66


mov_h_m : CpuState -> MachineStateDiff
mov_h_m cpuState =
    mov_m_ (\data -> SetRegisterH data) cpuState



--0x77


mov_m_a : CpuState -> MachineStateDiff
mov_m_a cpuState =
    mov_register_ cpuState.a cpuState



-- 0x7e


mov_a_m : CpuState -> MachineStateDiff
mov_a_m cpuState =
    mov_m_ (\data -> SetRegisterA data) cpuState



-- 0xa7


ana_a : CpuState -> MachineStateDiff
ana_a cpuState =
    let
        newPc =
            cpuState.pc + 1
    in
    Events
        (List.concat
            [ [ SetRegisterA (Bitwise.and cpuState.a cpuState.a), SetPC newPc ]
            , logic_flags_a cpuState
            ]
        )



--0xaf


xra_a : CpuState -> MachineStateDiff
xra_a cpuState =
    let
        newPc =
            cpuState.pc + 1
    in
    Events
        (List.concat
            [ [ SetRegisterA (Bitwise.xor cpuState.a cpuState.a), SetPC newPc ]
            , logic_flags_a cpuState
            ]
        )



-- 0xc1


pop_b : CpuState -> MachineStateDiff
pop_b cpuState =
    pop_ (\data -> SetRegisterB data) (\data -> SetRegisterC data) cpuState



-- 0xc2


jnz : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
jnz firstArg secondArg cpuState =
    if False == cpuState.conditionCodes.z then
        Events [ SetPC (getAddressLE firstArg secondArg) ]

    else
        Events [ SetPC (cpuState.pc + 3) ]



-- 0xc3


jmp : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
jmp firstArg secondArg _ =
    Events [ SetPC (getAddressLE firstArg secondArg) ]



-- 0xc5


push_b : CpuState -> MachineStateDiff
push_b cpuState =
    push_ cpuState.b cpuState.c cpuState



-- 0xc6


adi_d8 : ByteValue -> CpuState -> MachineStateDiff
adi_d8 firstArg cpuState =
    let
        x =
            cpuState.a + firstArg

        newPc =
            cpuState.pc + 2
    in
    Events
        [ SetRegisterA x
        , SetFlag (SetFlagZ (0 == Bitwise.and x 0xFF))
        , SetFlag (SetFlagS (0x80 == Bitwise.and x 0x80))
        , SetFlag (SetFlagP (ConditionCodesFlags.pFlag (Bitwise.and x 0xFF)))
        , SetFlag (SetFlagCY (ConditionCodesFlags.cyFlagAdd x))
        , SetPC newPc
        ]



-- 0xc9


ret : CpuState -> MachineStateDiff
ret cpuState =
    let
        newSp =
            cpuState.sp + 2

        memSpLow =
            Memory.readMemory cpuState.sp cpuState.memory

        memSpHigh =
            Bitwise.shiftLeftBy 8 (Memory.readMemory (cpuState.sp + 1) cpuState.memory)
    in
    Events
        [ SetSP newSp
        , SetPC (Bitwise.or memSpLow memSpHigh)
        ]



-- 0xcd


call : ByteValue -> ByteValue -> CpuState -> MachineStateDiff
call firstArg secondArg cpuState =
    let
        newPc =
            getAddressLE firstArg secondArg

        newSp =
            cpuState.sp - 2

        memoryOne =
            cpuState.sp - 1

        memoryTwo =
            cpuState.sp - 2

        data =
            cpuState.pc + 2
    in
    Events
        [ SetMemory memoryOne (Bitwise.and (Bitwise.shiftRightBy 8 data) 0xFF)
        , SetMemory memoryTwo (Bitwise.and data 0xFF)
        , SetSP newSp
        , SetPC newPc
        ]



-- 0xd1


pop_d : CpuState -> MachineStateDiff
pop_d cpuState =
    pop_ (\data -> SetRegisterD data) (\data -> SetRegisterE data) cpuState



-- 0xd5


push_d : CpuState -> MachineStateDiff
push_d cpuState =
    push_ cpuState.d cpuState.e cpuState



-- 0xe1


pop_h : CpuState -> MachineStateDiff
pop_h cpuState =
    pop_ (\data -> SetRegisterH data) (\data -> SetRegisterL data) cpuState



-- 0xe5


push_h : CpuState -> MachineStateDiff
push_h cpuState =
    push_ cpuState.h cpuState.l cpuState



-- 0xe6


ani : ByteValue -> CpuState -> MachineStateDiff
ani firstArg cpuState =
    let
        newPc =
            cpuState.pc + 1

        newA =
            Bitwise.and cpuState.a firstArg
    in
    Events
        (List.concat
            [ [ SetRegisterA newA, SetPC newPc ]
            , logic_flags_a cpuState
            ]
        )



-- 0xeb


xchg : CpuState -> MachineStateDiff
xchg cpuState =
    let
        saveOne =
            cpuState.d

        saveTwo =
            cpuState.e

        newPc =
            cpuState.pc + 1
    in
    Events
        [ SetRegisterD cpuState.h
        , SetRegisterE cpuState.l
        , SetRegisterH saveOne
        , SetRegisterL saveTwo
        , SetPC newPc
        ]



-- 0xf1


pop_psw : CpuState -> MachineStateDiff
pop_psw cpuState =
    let
        addressForA =
            cpuState.sp + 1

        psw =
            Memory.readMemory cpuState.sp cpuState.memory

        newSp =
            cpuState.sp + 2
    in
    Events
        [ SetRegisterA (Memory.readMemory addressForA cpuState.memory)
        , SetFlag (SetFlagZ (0x01 == Bitwise.and psw 0x01))
        , SetFlag (SetFlagS (0x02 == Bitwise.and psw 0x02))
        , SetFlag (SetFlagP (0x04 == Bitwise.and psw 0x04))
        , SetFlag (SetFlagCY (0x05 == Bitwise.and psw 0x08))
        , SetFlag (SetFlagAC (0x10 == Bitwise.and psw 0x10))
        , SetSP newSp
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



-- 0xfb


ei : CpuState -> MachineStateDiff
ei cpuState =
    let
        newPc =
            cpuState.pc + 1
    in
    Events
        [ SetIntEnable True
        , SetPC newPc
        ]



-- 0xfe


cpi : ByteValue -> CpuState -> MachineStateDiff
cpi firstArg cpuState =
    let
        x =
            cpuState.a - firstArg

        newPc =
            cpuState.pc + 2
    in
    Events
        [ SetFlag (SetFlagZ (ConditionCodesFlags.zFlag x))
        , SetFlag (SetFlagS (ConditionCodesFlags.sFlag x))
        , SetFlag (SetFlagP (ConditionCodesFlags.pFlag x))
        , SetFlag (SetFlagCY (cpuState.a < firstArg))
        , SetPC newPc
        ]
