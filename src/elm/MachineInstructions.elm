module MachineInstructions exposing (..)

import BitOperations exposing (combineBytes, getAddressLE)
import Bitwise
import ConditionCodesFlags
import EmulatorState exposing (AddressValue, ByteValue, ConditionCodes, Flag, MachineState, MachineStateDiff(..), MachineStateDiffEvent(..), Memory, RegisterValue, SetCpuStateEvent(..), SetFlagEvent(..))
import Memory
import Psw



-- event creation


setMemory : AddressValue -> ByteValue -> MachineStateDiffEvent
setMemory address value =
    SetMemory address value


setRegisterA : RegisterValue -> MachineStateDiffEvent
setRegisterA newValue =
    SetCpu (SetRegisterA newValue)


setRegisterB : RegisterValue -> MachineStateDiffEvent
setRegisterB newValue =
    SetCpu (SetRegisterB newValue)


setRegisterC : RegisterValue -> MachineStateDiffEvent
setRegisterC newValue =
    SetCpu (SetRegisterC newValue)


setRegisterD : RegisterValue -> MachineStateDiffEvent
setRegisterD newValue =
    SetCpu (SetRegisterD newValue)


setRegisterE : RegisterValue -> MachineStateDiffEvent
setRegisterE newValue =
    SetCpu (SetRegisterE newValue)


setRegisterH : RegisterValue -> MachineStateDiffEvent
setRegisterH newValue =
    SetCpu (SetRegisterH newValue)


setRegisterL : RegisterValue -> MachineStateDiffEvent
setRegisterL newValue =
    SetCpu (SetRegisterL newValue)


setPC : AddressValue -> MachineStateDiffEvent
setPC newValue =
    SetCpu (SetPC newValue)


setSP : AddressValue -> MachineStateDiffEvent
setSP newValue =
    SetCpu (SetSP newValue)


setIntEnable : Flag -> MachineStateDiffEvent
setIntEnable newValue =
    SetCpu (SetIntEnable newValue)


setFlagCY : Flag -> MachineStateDiffEvent
setFlagCY newValue =
    SetCpu (SetFlag (SetFlagCY newValue))


setFlagAC : Flag -> MachineStateDiffEvent
setFlagAC newValue =
    SetCpu (SetFlag (SetFlagAC newValue))


setFlagZ : Flag -> MachineStateDiffEvent
setFlagZ newValue =
    SetCpu (SetFlag (SetFlagZ newValue))


setFlagS : Flag -> MachineStateDiffEvent
setFlagS newValue =
    SetCpu (SetFlag (SetFlagS newValue))


setFlagP : Flag -> MachineStateDiffEvent
setFlagP newValue =
    SetCpu (SetFlag (SetFlagP newValue))



-- access


getMemory : MachineState -> Memory
getMemory machineState =
    machineState.memory


getA : MachineState -> ByteValue
getA machineState =
    machineState.cpuState.a


getB : MachineState -> ByteValue
getB machineState =
    machineState.cpuState.b


getC : MachineState -> ByteValue
getC machineState =
    machineState.cpuState.c


getD : MachineState -> ByteValue
getD machineState =
    machineState.cpuState.d


getE : MachineState -> ByteValue
getE machineState =
    machineState.cpuState.e


getH : MachineState -> ByteValue
getH machineState =
    machineState.cpuState.h


getL : MachineState -> ByteValue
getL machineState =
    machineState.cpuState.l


getPC : MachineState -> AddressValue
getPC machineState =
    machineState.cpuState.pc


getSP : MachineState -> AddressValue
getSP machineState =
    machineState.cpuState.sp


getConditionCodes : MachineState -> ConditionCodes
getConditionCodes machineState =
    machineState.cpuState.conditionCodes


getFlagZ : MachineState -> Flag
getFlagZ machineState =
    let
        conditionCodes =
            getConditionCodes machineState
    in
    conditionCodes.z



-- general


logic_flags_a : RegisterValue -> List MachineStateDiffEvent
logic_flags_a newA =
    [ setFlagCY False
    , setFlagAC False
    , setFlagZ (ConditionCodesFlags.zFlag newA)
    , setFlagS (ConditionCodesFlags.sFlag newA)
    , setFlagP (ConditionCodesFlags.pFlag newA)
    ]


dcr_ : (RegisterValue -> MachineStateDiffEvent) -> RegisterValue -> MachineState -> MachineStateDiff
dcr_ diffEvent registerValue machineState =
    let
        newPc =
            getPC machineState + 1

        newRegisterValue =
            registerValue - 1
    in
    if newRegisterValue < 0 then
        Events
            [ diffEvent (256 - abs newRegisterValue)
            , setFlagZ (ConditionCodesFlags.zFlag newRegisterValue)
            , setFlagS (ConditionCodesFlags.sFlag newRegisterValue)
            , setFlagP (ConditionCodesFlags.pFlag newRegisterValue)
            , setPC newPc
            ]

    else
        Events
            [ diffEvent newRegisterValue
            , setFlagZ (ConditionCodesFlags.zFlag newRegisterValue)
            , setFlagS (ConditionCodesFlags.sFlag newRegisterValue)
            , setFlagP (ConditionCodesFlags.pFlag newRegisterValue)
            , setPC newPc
            ]


mvi_d8_ : MachineStateDiffEvent -> MachineState -> MachineStateDiff
mvi_d8_ diffEvent machineState =
    let
        newPc =
            getPC machineState + 2
    in
    Events
        [ diffEvent
        , setPC newPc
        ]


lxi_d16_ : MachineStateDiffEvent -> MachineStateDiffEvent -> MachineState -> MachineStateDiff
lxi_d16_ firstDiffEvent secondDiffEvent machineState =
    let
        newPc =
            getPC machineState + 3
    in
    Events
        [ firstDiffEvent
        , secondDiffEvent
        , setPC newPc
        ]


inx_ : ByteValue -> (ByteValue -> MachineStateDiffEvent) -> ByteValue -> (ByteValue -> MachineStateDiffEvent) -> MachineState -> MachineStateDiff
inx_ firstArg firstDiffEvent secondArg secondDiffEvent machineState =
    let
        newPc =
            getPC machineState + 1

        newSecond =
            --l
            modBy 256 (secondArg + 1)
    in
    if newSecond == 0 then
        Events
            [ firstDiffEvent (modBy 256 (firstArg + 1))
            , secondDiffEvent newSecond
            , setPC newPc
            ]

    else
        Events
            [ secondDiffEvent newSecond
            , setPC newPc
            ]


dad_ : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
dad_ firstRegister secondRegister machineState =
    let
        newPc =
            getPC machineState + 1

        hl =
            Bitwise.or (Bitwise.shiftLeftBy 8 (getH machineState)) (getL machineState)

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
        [ setRegisterH newH
        , setRegisterL newL
        , setFlagCY newCY
        , setPC newPc
        ]


mov_m_ : (ByteValue -> MachineStateDiffEvent) -> MachineState -> MachineStateDiff
mov_m_ diffEvent machineState =
    let
        memoryAddress =
            getAddressLE (getL machineState) (getH machineState)

        newPc =
            getPC machineState + 1

        memoryAccessResult =
            Memory.readMemory memoryAddress (getMemory machineState)
    in
    case memoryAccessResult of
        Memory.Valid byteValue ->
            Events
                [ diffEvent byteValue
                , setPC newPc
                ]

        Memory.Invalid message ->
            Failed (Just machineState) message


mov_register_ : ByteValue -> MachineState -> MachineStateDiff
mov_register_ firstArg machineState =
    let
        memoryAddress =
            getAddressLE (getL machineState) (getH machineState)

        newPc =
            getPC machineState + 1
    in
    Events
        [ setMemory memoryAddress firstArg
        , setPC newPc
        ]


pop_ : (ByteValue -> MachineStateDiffEvent) -> (ByteValue -> MachineStateDiffEvent) -> MachineState -> MachineStateDiff
pop_ firstDiffEvent secondDiffEvent machineState =
    let
        newSp =
            getSP machineState + 2

        addressForTwo =
            getSP machineState

        addressForOne =
            getSP machineState + 1

        memory =
            getMemory machineState

        firstMemoryAccessResult =
            Memory.readMemory addressForOne memory

        secondMemoryAccessResult =
            Memory.readMemory addressForTwo memory

        newPc =
            getPC machineState + 1
    in
    case ( firstMemoryAccessResult, secondMemoryAccessResult ) of
        ( Memory.Valid firstByteValue, Memory.Valid secondByteValue ) ->
            Events
                [ secondDiffEvent secondByteValue
                , firstDiffEvent firstByteValue
                , setSP newSp
                , setPC newPc
                ]

        ( Memory.Valid _, Memory.Invalid message ) ->
            Failed (Just machineState) message

        ( Memory.Invalid message, _ ) ->
            Failed (Just machineState) message


push_ : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
push_ firstArg secondArg machineState =
    let
        addressForOne =
            getSP machineState - 1

        addressForTwo =
            getSP machineState - 2

        newSp =
            getSP machineState - 2

        newPc =
            getPC machineState + 1
    in
    Events
        [ setMemory addressForOne firstArg
        , setMemory addressForTwo secondArg
        , setSP newSp
        , setPC newPc
        ]



-- 0x00


nop : MachineState -> MachineStateDiff
nop machineState =
    let
        newPc =
            getPC machineState + 1
    in
    Events [ setPC newPc ]



-- 0x01


lxi_b_d16 : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
lxi_b_d16 firstArg secondArg machineState =
    lxi_d16_ (setRegisterB secondArg) (setRegisterC firstArg) machineState



-- 0x02


stax_b : MachineState -> MachineStateDiff
stax_b machineState =
    let
        address =
            combineBytes (getB machineState) (getC machineState)

        newPc =
            getPC machineState + 1
    in
    Events
        [ setMemory address (getA machineState)
        , setPC newPc
        ]



-- 0x03


inx_b : MachineState -> MachineStateDiff
inx_b machineState =
    inx_ (getB machineState) (\data -> setRegisterB data) (getC machineState) (\data -> setRegisterC data) machineState



-- 0x05


dcr_b : MachineState -> MachineStateDiff
dcr_b machineState =
    dcr_ (\value -> setRegisterB value) (getB machineState) machineState



-- 0x06


mvi_b_d8 : ByteValue -> MachineState -> MachineStateDiff
mvi_b_d8 firstArg machineState =
    mvi_d8_ (setRegisterB firstArg) machineState



-- 0x07


rlc : MachineState -> MachineStateDiff
rlc machineState =
    let
        newPc =
            getPC machineState + 1

        currentA =
            getA machineState

        newA =
            modBy 256 (Bitwise.or (Bitwise.shiftLeftBy 1 currentA) (Bitwise.shiftRightBy 7 currentA))

        newCy =
            Bitwise.and 128 currentA == 128
    in
    Events
        [ setRegisterA newA
        , setFlagCY newCy
        , setPC newPc
        ]



-- 0x09


dad_b : MachineState -> MachineStateDiff
dad_b machineState =
    dad_ (getB machineState) (getC machineState) machineState



-- 0x0a


ldax_b : MachineState -> MachineStateDiff
ldax_b machineState =
    let
        newPc =
            getPC machineState + 1

        memoryAddress =
            getAddressLE (getC machineState) (getB machineState)

        memoryAccessResult =
            Memory.readMemory memoryAddress (getMemory machineState)
    in
    case memoryAccessResult of
        Memory.Valid byteValue ->
            Events
                [ setRegisterA byteValue
                , setPC newPc
                ]

        Memory.Invalid message ->
            Failed (Just machineState) message



-- 0x0d


dcr_c : MachineState -> MachineStateDiff
dcr_c machineState =
    dcr_ (\value -> setRegisterC value) (getC machineState) machineState



-- 0x0e


mvi_c_d8 : ByteValue -> MachineState -> MachineStateDiff
mvi_c_d8 firstArg machineState =
    mvi_d8_ (setRegisterC firstArg) machineState



--0x0f


rrc : MachineState -> MachineStateDiff
rrc machineState =
    let
        newPc =
            getPC machineState + 1

        newA =
            Bitwise.or (Bitwise.shiftLeftBy 7 (Bitwise.and (getA machineState) 1)) (Bitwise.shiftRightBy 1 (getA machineState))

        newCY =
            1 == Bitwise.and (getA machineState) 1
    in
    Events
        [ setRegisterA newA
        , setFlagCY newCY
        , setPC newPc
        ]



-- 0x11


lxi_d_d16 : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
lxi_d_d16 firstArg secondArg machineState =
    lxi_d16_ (setRegisterD secondArg) (setRegisterE firstArg) machineState



-- 0x13


inx_d : MachineState -> MachineStateDiff
inx_d machineState =
    inx_ (getD machineState) (\data -> setRegisterD data) (getE machineState) (\data -> setRegisterE data) machineState



-- 0x16


mvi_d_d8 : ByteValue -> MachineState -> MachineStateDiff
mvi_d_d8 firstArg machineState =
    mvi_d8_ (setRegisterD firstArg) machineState



-- 0x19


dad_d : MachineState -> MachineStateDiff
dad_d machineState =
    dad_ (getD machineState) (getE machineState) machineState



-- 0x1a


ldax_d : MachineState -> MachineStateDiff
ldax_d machineState =
    let
        newPc =
            getPC machineState + 1

        memoryAddress =
            Bitwise.or (Bitwise.shiftLeftBy 8 (getD machineState)) (getE machineState)

        memoryAccessResult =
            Memory.readMemory memoryAddress (getMemory machineState)
    in
    case memoryAccessResult of
        Memory.Valid byteValue ->
            Events
                [ setRegisterA byteValue
                , setPC newPc
                ]

        Memory.Invalid message ->
            Failed (Just machineState) message



-- 0x1f


rar : MachineState -> MachineStateDiff
rar machineState =
    let
        currentA =
            getA machineState

        newCy =
            Bitwise.and 1 currentA == 1

        newAWithoutCarry =
            Bitwise.shiftRightBy 1 currentA

        newA =
            if machineState.cpuState.conditionCodes.cy then
                newAWithoutCarry + 128

            else
                newAWithoutCarry

        newPc =
            getPC machineState + 1
    in
    Events
        [ setRegisterA newA
        , setFlagCY newCy
        , setPC newPc
        ]



-- 0x21


lxi_h_d16 : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
lxi_h_d16 firstArg secondArg machineState =
    lxi_d16_ (setRegisterH secondArg) (setRegisterL firstArg) machineState



-- 0x23


inx_h : MachineState -> MachineStateDiff
inx_h machineState =
    inx_ (getH machineState) (\data -> setRegisterH data) (getL machineState) (\data -> setRegisterL data) machineState



-- 0x26


mvi_h_d8 : ByteValue -> MachineState -> MachineStateDiff
mvi_h_d8 firstArg machineState =
    mvi_d8_ (setRegisterH firstArg) machineState



-- 0x29


dad_h : MachineState -> MachineStateDiff
dad_h machineState =
    dad_ (getH machineState) (getL machineState) machineState



-- 0x2a


lhld : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
lhld firstArg secondArg machineState =
    let
        addressForL =
            getAddressLE firstArg secondArg

        addressForH =
            getAddressLE firstArg secondArg + 1

        memoryAccessResultL =
            Memory.readMemory addressForL (getMemory machineState)

        memoryAccessResultH =
            Memory.readMemory addressForH (getMemory machineState)

        newPc =
            getPC machineState + 3
    in
    case ( memoryAccessResultL, memoryAccessResultH ) of
        ( Memory.Valid byteValueL, Memory.Valid byteValueH ) ->
            Events
                [ setRegisterL byteValueL
                , setRegisterH byteValueH
                , setPC newPc
                ]

        ( Memory.Valid _, Memory.Invalid message ) ->
            Failed (Just machineState) message

        ( Memory.Invalid message, _ ) ->
            Failed (Just machineState) message



-- 0x2e


mvi_l_d8 : ByteValue -> MachineState -> MachineStateDiff
mvi_l_d8 firstArg machineState =
    mvi_d8_ (setRegisterL firstArg) machineState



-- 0x31


lxi_sp_d16 : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
lxi_sp_d16 firstArg secondArg machineState =
    let
        newPc =
            getPC machineState + 3

        newSp =
            getAddressLE firstArg secondArg
    in
    Events
        [ setSP newSp
        , setPC newPc
        ]



-- 0x32


sta : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
sta firstArg secondArg machineState =
    let
        address =
            getAddressLE firstArg secondArg

        newPc =
            getPC machineState + 3
    in
    Events
        [ setMemory address (getA machineState)
        , setPC newPc
        ]



-- 0x35


dcr_m : MachineState -> MachineStateDiff
dcr_m machineState =
    let
        newPc =
            machineState.cpuState.pc + 1

        memoryAccessResult =
            Memory.readMemory (getAddressLE machineState.cpuState.l machineState.cpuState.h) machineState.memory
    in
    case memoryAccessResult of
        Memory.Valid memoryValue ->
            let
                newMemoryValue =
                    memoryValue - 1
            in
            Events
                [ setMemory (getAddressLE machineState.cpuState.l machineState.cpuState.h) newMemoryValue
                , setFlagZ (ConditionCodesFlags.zFlag newMemoryValue)
                , setFlagS (ConditionCodesFlags.sFlag newMemoryValue)
                , setFlagP (ConditionCodesFlags.pFlag newMemoryValue)
                , setPC newPc
                ]

        Memory.Invalid message ->
            Failed (Just machineState) message



-- 0x36


mvi_m_d8 : ByteValue -> MachineState -> MachineStateDiff
mvi_m_d8 firstArg machineState =
    let
        address =
            getAddressLE (getL machineState) (getH machineState)
    in
    mvi_d8_ (SetMemory address firstArg) machineState



-- 0x37


stc : MachineState -> MachineStateDiff
stc machineState =
    let
        newPc =
            getPC machineState + 1
    in
    Events
        [ setFlagCY True
        , setPC newPc
        ]



-- 0x3a


lda : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
lda firstArg secondArg machineState =
    let
        newPc =
            getPC machineState + 3

        memoryAddress =
            getAddressLE firstArg secondArg

        memoryAccessResult =
            Memory.readMemory memoryAddress (getMemory machineState)
    in
    case memoryAccessResult of
        Memory.Valid byteValue ->
            Events
                [ setRegisterA byteValue
                , setPC newPc
                ]

        Memory.Invalid message ->
            Failed (Just machineState) message



-- 0x3d


dcr_a : MachineState -> MachineStateDiff
dcr_a machineState =
    dcr_ (\value -> setRegisterA value) (getA machineState) machineState



-- 0x3e


mvi_a_d8 : ByteValue -> MachineState -> MachineStateDiff
mvi_a_d8 firstArg machineState =
    mvi_d8_ (setRegisterA firstArg) machineState



-- 0x46


mov_b_m : MachineState -> MachineStateDiff
mov_b_m machineState =
    mov_m_ (\data -> setRegisterB data) machineState



-- 0x4f


mov_c_a : MachineState -> MachineStateDiff
mov_c_a machineState =
    let
        newPc =
            getPC machineState + 1

        newC =
            getA machineState
    in
    Events
        [ setRegisterC newC
        , setPC newPc
        ]



-- 0x56


mov_d_m : MachineState -> MachineStateDiff
mov_d_m machineState =
    mov_m_ (\data -> setRegisterD data) machineState



--0x57


mov_d_a : MachineState -> MachineStateDiff
mov_d_a machineState =
    let
        newPc =
            getPC machineState + 1

        newD =
            getA machineState
    in
    Events
        [ setRegisterD newD
        , setPC newPc
        ]



-- 0x5e


mov_e_m : MachineState -> MachineStateDiff
mov_e_m machineState =
    mov_m_ (\data -> setRegisterE data) machineState



-- 0x5f


mov_e_a : MachineState -> MachineStateDiff
mov_e_a machineState =
    let
        newPc =
            getPC machineState + 1

        newE =
            getA machineState
    in
    Events
        [ setRegisterE newE
        , setPC newPc
        ]



-- 0x66


mov_h_m : MachineState -> MachineStateDiff
mov_h_m machineState =
    mov_m_ (\data -> setRegisterH data) machineState



-- 0x67


mov_h_a : MachineState -> MachineStateDiff
mov_h_a machineState =
    mov_m_ (\data -> setRegisterA data) machineState



-- 0x6f


mov_l_a : MachineState -> MachineStateDiff
mov_l_a machineState =
    let
        newPc =
            getPC machineState + 1

        newL =
            getA machineState
    in
    Events
        [ setRegisterL newL
        , setPC newPc
        ]



--0x77


mov_m_a : MachineState -> MachineStateDiff
mov_m_a machineState =
    mov_register_ (getA machineState) machineState



-- 0x78


mov_a_b : MachineState -> MachineStateDiff
mov_a_b machineState =
    let
        newPc =
            getPC machineState + 1

        newA =
            getB machineState
    in
    Events
        [ setRegisterA newA
        , setPC newPc
        ]



-- 0x7a


mov_a_d : MachineState -> MachineStateDiff
mov_a_d machineState =
    let
        newPc =
            getPC machineState + 1

        newA =
            getD machineState
    in
    Events
        [ setRegisterA newA
        , setPC newPc
        ]



-- 0x7b


mov_a_e : MachineState -> MachineStateDiff
mov_a_e machineState =
    let
        newPc =
            getPC machineState + 1

        newA =
            getE machineState
    in
    Events
        [ setRegisterA newA
        , setPC newPc
        ]



-- 0x7c


mov_a_h : MachineState -> MachineStateDiff
mov_a_h machineState =
    let
        newPc =
            getPC machineState + 1

        newA =
            getH machineState
    in
    Events
        [ setRegisterA newA
        , setPC newPc
        ]



-- 0x7d


mov_a_l : MachineState -> MachineStateDiff
mov_a_l machineState =
    let
        newPc =
            getPC machineState + 1

        newA =
            getL machineState
    in
    Events
        [ setRegisterA newA
        , setPC newPc
        ]



-- 0x7e


mov_a_m : MachineState -> MachineStateDiff
mov_a_m machineState =
    mov_m_ (\data -> setRegisterA data) machineState



-- 0xa7


ana_a : MachineState -> MachineStateDiff
ana_a machineState =
    let
        newPc =
            getPC machineState + 1

        newA =
            Bitwise.and (getA machineState) (getA machineState)
    in
    Events
        (List.concat
            [ [ setRegisterA newA
              , setPC newPc
              ]
            , logic_flags_a newA
            ]
        )



--0xaf


xra_a : MachineState -> MachineStateDiff
xra_a machineState =
    let
        newPc =
            getPC machineState + 1

        newA =
            Bitwise.xor (getA machineState) (getA machineState)
    in
    Events
        (List.concat
            [ [ setRegisterA newA
              , setPC newPc
              ]
            , logic_flags_a newA
            ]
        )



-- 0xb6


ora_m : MachineState -> MachineStateDiff
ora_m machineState =
    let
        newPc =
            getPC machineState + 1

        memoryAddress =
            getAddressLE (getL machineState) (getH machineState)

        memoryAccessResult =
            Memory.readMemory memoryAddress (getMemory machineState)
    in
    case memoryAccessResult of
        Memory.Valid byteValue ->
            let
                newA =
                    Bitwise.or (getA machineState) byteValue
            in
            Events
                (List.concat
                    [ [ setRegisterA newA
                      , setPC newPc
                      ]
                    , logic_flags_a newA
                    ]
                )

        Memory.Invalid message ->
            Failed (Just machineState) message



-- 0xc1


pop_b : MachineState -> MachineStateDiff
pop_b machineState =
    pop_ (\data -> setRegisterB data) (\data -> setRegisterC data) machineState



-- 0xc2


jnz : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
jnz firstArg secondArg machineState =
    if False == getFlagZ machineState then
        Events [ setPC (getAddressLE firstArg secondArg) ]

    else
        Events [ setPC (getPC machineState + 3) ]



-- 0xc3


jmp : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
jmp firstArg secondArg _ =
    Events [ setPC (getAddressLE firstArg secondArg) ]



-- 0xc4


cnz : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
cnz firstArg secondArg machineState =
    if machineState.cpuState.conditionCodes.z then
        let
            newPc =
                getPC machineState + 3
        in
        Events [ setPC newPc ]

    else
        let
            newPc =
                getAddressLE firstArg secondArg
        in
        Events [ setPC newPc ]



-- 0xc5


push_b : MachineState -> MachineStateDiff
push_b machineState =
    push_ (getB machineState) (getC machineState) machineState



-- 0xc6


adi_d8 : ByteValue -> MachineState -> MachineStateDiff
adi_d8 firstArg machineState =
    let
        x =
            getA machineState + firstArg

        newPc =
            getPC machineState + 2
    in
    Events
        [ setRegisterA x
        , setFlagZ (0 == Bitwise.and x 0xFF)
        , setFlagS (0x80 == Bitwise.and x 0x80)
        , setFlagP (ConditionCodesFlags.pFlag (Bitwise.and x 0xFF))
        , setFlagCY (ConditionCodesFlags.cyFlag x)
        , setPC newPc
        ]



-- 0xc8


rz : MachineState -> MachineStateDiff
rz machineState =
    if machineState.cpuState.conditionCodes.z then
        let
            firstMemoryAccessResult =
                Memory.readMemory machineState.cpuState.sp machineState.memory

            secondMemoryAccessResult =
                Memory.readMemory (machineState.cpuState.sp + 1) machineState.memory
        in
        case ( firstMemoryAccessResult, secondMemoryAccessResult ) of
            ( Memory.Valid spLow, Memory.Valid spHigh ) ->
                createRz spLow spHigh machineState

            ( Memory.Valid _, Memory.Invalid message ) ->
                Failed (Just machineState) message

            ( Memory.Invalid message, _ ) ->
                Failed (Just machineState) message

    else
        Events [ setPC (machineState.cpuState.pc + 1) ]


createRz : Int -> Int -> (MachineState -> MachineStateDiff)
createRz spLow spHigh machineState =
    let
        newSp =
            machineState.cpuState.sp + 2

        newPc =
            Bitwise.or spLow (Bitwise.shiftLeftBy 8 spHigh)
    in
    Events
        [ setSP newSp
        , setPC newPc
        ]



-- 0xc9


ret : MachineState -> MachineStateDiff
ret machineState =
    let
        memSpLow =
            Memory.readMemory (getSP machineState) (getMemory machineState)

        memSpHigh =
            Memory.readMemory (getSP machineState + 1) (getMemory machineState)
    in
    case ( memSpLow, memSpHigh ) of
        ( Memory.Valid spLowByteValue, Memory.Valid spHighByteValue ) ->
            createRet spLowByteValue spHighByteValue machineState

        ( Memory.Valid _, Memory.Invalid message ) ->
            Failed (Just machineState) message

        ( Memory.Invalid message, _ ) ->
            Failed (Just machineState) message


createRet : ByteValue -> ByteValue -> (MachineState -> MachineStateDiff)
createRet memSpLow memSpHigh machineState =
    let
        newSp =
            getSP machineState + 2

        memSpHighShifted =
            Bitwise.shiftLeftBy 8 memSpHigh

        newPC =
            Bitwise.or memSpLow memSpHighShifted
    in
    Events
        [ setSP newSp
        , setPC newPC
        ]



-- 0xca


jz : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
jz firstArg secondArg machineState =
    if machineState.cpuState.conditionCodes.z then
        let
            newPc =
                getAddressLE firstArg secondArg
        in
        Events
            [ setPC newPc
            ]

    else
        let
            newPc =
                getPC machineState + 3
        in
        Events
            [ setPC newPc
            ]



-- 0xcd


call : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
call firstArg secondArg machineState =
    let
        data =
            getPC machineState + 3

        memoryOne =
            getSP machineState - 1

        memoryTwo =
            getSP machineState - 2

        newSp =
            getSP machineState - 2

        newPc =
            getAddressLE firstArg secondArg
    in
    Events
        [ setMemory memoryOne (Bitwise.and (Bitwise.shiftRightBy 8 data) 0xFF)
        , setMemory memoryTwo (Bitwise.and data 0xFF)
        , setSP newSp
        , setPC newPc
        ]



-- 0xd1


pop_d : MachineState -> MachineStateDiff
pop_d machineState =
    pop_ (\data -> setRegisterD data) (\data -> setRegisterE data) machineState



-- 0xd3
-- see IO
-- 0xd5


push_d : MachineState -> MachineStateDiff
push_d machineState =
    push_ (getD machineState) (getE machineState) machineState



-- 0xd8


rc : MachineState -> MachineStateDiff
rc machineState =
    if machineState.cpuState.conditionCodes.cy then
        let
            newSp =
                getSP machineState + 2

            addressForH =
                getSP machineState + 1

            addressForL =
                getSP machineState

            hMemoryAccessResult =
                Memory.readMemory addressForH machineState.memory

            lMemoryAccessResult =
                Memory.readMemory addressForL machineState.memory
        in
        case ( hMemoryAccessResult, lMemoryAccessResult ) of
            ( Memory.Valid hByteValue, Memory.Valid lByteValue ) ->
                Events
                    [ setSP newSp
                    , setPC (BitOperations.getAddressLE lByteValue hByteValue)
                    ]

            ( Memory.Valid _, Memory.Invalid message ) ->
                Failed (Just machineState) message

            ( Memory.Invalid message, _ ) ->
                Failed (Just machineState) message

    else
        let
            newPc =
                getPC machineState + 1
        in
        Events
            [ setPC newPc
            ]



-- 0xda


jc : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
jc firstArg secondArg machineState =
    if machineState.cpuState.conditionCodes.cy then
        let
            newPc =
                getAddressLE firstArg secondArg
        in
        Events
            [ setPC newPc
            ]

    else
        let
            newPc =
                getPC machineState + 3
        in
        Events
            [ setPC newPc
            ]



-- 0xdb
-- see IO
-- 0xe1


pop_h : MachineState -> MachineStateDiff
pop_h machineState =
    pop_ (\data -> setRegisterH data) (\data -> setRegisterL data) machineState



-- 0xe5


push_h : MachineState -> MachineStateDiff
push_h machineState =
    push_ (getH machineState) (getL machineState) machineState



-- 0xe6


ani : ByteValue -> MachineState -> MachineStateDiff
ani firstArg machineState =
    let
        newPc =
            getPC machineState + 2

        newA =
            Bitwise.and (getA machineState) firstArg
    in
    Events
        (List.concat
            [ [ setRegisterA newA
              , setPC newPc
              ]
            , logic_flags_a newA
            ]
        )



-- 0xeb


xchg : MachineState -> MachineStateDiff
xchg machineState =
    let
        saveOne =
            getD machineState

        saveTwo =
            getE machineState

        newPc =
            getPC machineState + 1
    in
    Events
        [ setRegisterD (getH machineState)
        , setRegisterE (getL machineState)
        , setRegisterH saveOne
        , setRegisterL saveTwo
        , setPC newPc
        ]



-- 0xf1


pop_psw : MachineState -> MachineStateDiff
pop_psw machineState =
    let
        addressForA =
            getSP machineState + 1

        pswAccessResult =
            Memory.readMemory (getSP machineState) (getMemory machineState)

        newSp =
            getSP machineState + 2

        newPc =
            getPC machineState + 1

        memoryAccessResult =
            Memory.readMemory addressForA (getMemory machineState)
    in
    case ( pswAccessResult, memoryAccessResult ) of
        ( Memory.Valid psw, Memory.Valid byteValue ) ->
            Events
                (List.concat
                    [ Psw.readPSW psw
                    , [ setRegisterA byteValue
                      , setSP newSp
                      , setPC newPc
                      ]
                    ]
                )

        ( Memory.Invalid message, _ ) ->
            Failed (Just machineState) message

        ( Memory.Valid _, Memory.Invalid message ) ->
            Failed (Just machineState) message



-- 0xf5


push_psw : MachineState -> MachineStateDiff
push_psw machineState =
    let
        newPc =
            getPC machineState + 1

        addressForA =
            getSP machineState - 1

        addressForPSW =
            getSP machineState - 2

        newSP =
            getSP machineState - 2

        psw =
            Psw.createPSW (getConditionCodes machineState)
    in
    Events
        [ setMemory addressForA (getA machineState)
        , setMemory addressForPSW psw
        , setSP newSP
        , setPC newPc
        ]



-- 0xf6


ori_d8 : ByteValue -> MachineState -> MachineStateDiff
ori_d8 firstArg machineState =
    let
        newA =
            Bitwise.or (getA machineState) firstArg

        newPc =
            getPC machineState + 2
    in
    Events
        (List.concat
            [ [ setRegisterA newA
              , setPC newPc
              ]
            , logic_flags_a newA
            ]
        )



-- 0xfb


ei : MachineState -> MachineStateDiff
ei machineState =
    let
        newPc =
            getPC machineState + 1
    in
    Events
        [ setIntEnable True
        , setPC newPc
        ]



-- 0xfe


cpi : ByteValue -> MachineState -> MachineStateDiff
cpi firstArg machineState =
    let
        x =
            getA machineState - firstArg

        newPc =
            getPC machineState + 2
    in
    Events
        [ setFlagZ (ConditionCodesFlags.zFlag x)
        , setFlagS (ConditionCodesFlags.sFlag x)
        , setFlagP (ConditionCodesFlags.pFlag x)
        , setFlagCY (getA machineState < firstArg)
        , setPC newPc
        ]
