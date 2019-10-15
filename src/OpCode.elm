module OpCode exposing (OpCode, OpCodeLength(..), OpCodeMetaData, getOpCodeLength)

import MachineState exposing (CpuState, MachineStateDiff(..), MachineStateDiffEvent(..))


type OpCodeLength
    = OneByte
    | TwoBytes
    | ThreeBytes


getOpCodeLength : OpCodeLength -> Int
getOpCodeLength opCodeLength =
    case opCodeLength of
        OneByte ->
            1

        TwoBytes ->
            2

        ThreeBytes ->
            3


type alias OpCodeMetaData =
    { name : String
    , length : OpCodeLength
    , impl : CpuState -> MachineStateDiff
    }


type alias OpCode =
    { hexCode : Int
    , information : OpCodeMetaData
    }

