module OpCode exposing (OpCode, OpCodeSpec(..), OpCodeData, ImplOneByte, getOpCodeLength, getImplementation, getName, getCycles)

import MachineState exposing (AddressValue, ByteValue, CpuState, MachineStateDiff(..), MachineStateDiffEvent(..), Memory)

type alias ImplOneByte = CpuState -> MachineStateDiff
type alias ImplTwoBytes = ByteValue -> (CpuState -> MachineStateDiff)
type alias ImplThreeBytes = ByteValue -> ByteValue -> (CpuState -> MachineStateDiff)

type OpCodeSpec
    = OneByte ImplOneByte
    | TwoBytes ImplTwoBytes
    | ThreeBytes ImplThreeBytes


type alias OpCodeData =
    { name : String
    , cycles : Int
    , opCodeSpec : OpCodeSpec
    }


type alias OpCode =
    { hexCode : ByteValue
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

getImplementation: OpCode -> (() -> ByteValue) -> (() -> ByteValue) -> (CpuState -> MachineStateDiff)
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

getCycles: OpCode -> Int
getCycles opCode = opCode.data.cycles