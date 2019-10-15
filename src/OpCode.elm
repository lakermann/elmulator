module OpCode exposing (OpCode, OpCodeSpec(..), OpCodeData, ImplOneByte, getOpCodeLength, getImplementation, getName)

import MachineState exposing (Address, CpuState, MachineStateDiff(..), MachineStateDiffEvent(..), Memory)

type alias ImplOneByte = CpuState -> MachineStateDiff
type alias ImplTwoBytes = Int -> (CpuState -> MachineStateDiff)
type alias ImplThreeBytes = Int -> Int -> (CpuState -> MachineStateDiff)

type OpCodeSpec
    = OneByte ImplOneByte
    | TwoBytes ImplTwoBytes
    | ThreeBytes ImplThreeBytes


type alias OpCodeData =
    { name : String
    , opCodeSpec : OpCodeSpec
    }


type alias OpCode =
    { hexCode : Int
    , data : OpCodeData
    }

getOpCodeLength : OpCode -> Int
getOpCodeLength opCode =
    let
        opCodeSpec = getSpec opCode
    in
    case opCodeSpec of
        OneByte _ ->
            1

        TwoBytes _ ->
            2

        ThreeBytes _ ->
            3

getImplementation: OpCode -> (() -> Int) -> (() -> Int) -> (CpuState -> MachineStateDiff)
getImplementation opCode firstValueProvider secondValueProvider =
    let
        opCodeSpec = getSpec opCode
    in
    case opCodeSpec of
        OneByte implOneByte ->
            implOneByte

        TwoBytes implTwoBytes ->
            let
                firstArg = firstValueProvider ()
            in
            implTwoBytes firstArg

        ThreeBytes implThreeBytes ->
            let
                firstArg = firstValueProvider ()
                secondArg = secondValueProvider ()
            in
            implThreeBytes firstArg secondArg

getSpec: OpCode -> OpCodeSpec
getSpec opCode = opCode.data.opCodeSpec

getName: OpCode -> String
getName opCode = opCode.data.name