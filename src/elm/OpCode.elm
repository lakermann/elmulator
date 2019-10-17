module OpCode exposing (ImplOneByte, OpCode, OpCodeData, OpCodeSpec(..), getCycles, getImplementation, getName, getOpCodeLength)

import EmulatorState exposing (AddressValue, ByteValue, MachineState, MachineStateDiff(..), MachineStateDiffEvent(..), Memory)


type alias ImplOneByte =
    MachineState -> MachineStateDiff


type alias ImplTwoBytes =
    ByteValue -> (MachineState -> MachineStateDiff)


type alias ImplThreeBytes =
    ByteValue -> ByteValue -> (MachineState -> MachineStateDiff)


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
        opCodeSpec =
            getSpec opCode
    in
    case opCodeSpec of
        OneByte _ ->
            1

        TwoBytes _ ->
            2

        ThreeBytes _ ->
            3


getImplementation : OpCode -> (() -> ByteValue) -> (() -> ByteValue) -> (MachineState -> MachineStateDiff)
getImplementation opCode firstValueProvider secondValueProvider =
    let
        opCodeSpec =
            getSpec opCode
    in
    case opCodeSpec of
        OneByte implOneByte ->
            implOneByte

        TwoBytes implTwoBytes ->
            let
                firstArg =
                    firstValueProvider ()
            in
            implTwoBytes firstArg

        ThreeBytes implThreeBytes ->
            let
                firstArg =
                    firstValueProvider ()

                secondArg =
                    secondValueProvider ()
            in
            implThreeBytes firstArg secondArg


getSpec : OpCode -> OpCodeSpec
getSpec opCode =
    opCode.data.opCodeSpec


getName : OpCode -> String
getName opCode =
    opCode.data.name


getCycles : OpCode -> Int
getCycles opCode =
    opCode.data.cycles
