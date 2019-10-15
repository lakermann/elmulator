module OpCode exposing (OpCode, OpCodeType(..), OpCodeMetaData, ImplOneByte, getOpCodeLength, getImplementation)

import MachineState exposing (Address, CpuState, MachineStateDiff(..), MachineStateDiffEvent(..), Memory)

type alias ImplOneByte = CpuState -> MachineStateDiff
type alias ImplTwoBytes = Int -> (CpuState -> MachineStateDiff)
type alias ImplThreeBytes = Int -> Int -> (CpuState -> MachineStateDiff)

type OpCodeType
    = OneByte ImplOneByte
    | TwoBytes ImplTwoBytes
    | ThreeBytes ImplThreeBytes


type alias OpCodeMetaData =
    { name : String
    , opCodeType : OpCodeType
    }


type alias OpCode =
    { hexCode : Int
    , information : OpCodeMetaData
    }

getOpCodeLength : OpCodeType -> Int
getOpCodeLength opCodeType =
    case opCodeType of
        OneByte _ ->
            1

        TwoBytes _ ->
            2

        ThreeBytes _ ->
            3

getImplementation: OpCode -> (() -> Int) -> (() -> Int) -> (CpuState -> MachineStateDiff)
getImplementation opCode firstValueProvider secondValueProvider =
    let
        opCodeType = opCode.information.opCodeType
    in
    case opCodeType of
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