module Psw exposing (..)

import BitOperations exposing (flagToByte)
import Bitwise
import EmulatorState exposing (ByteValue, ConditionCodes, MachineStateDiffEvent(..), SetCpuStateEvent(..), SetFlagEvent(..))
import String


createPSW : ConditionCodes -> ByteValue
createPSW conditionCodes =
    let
        seven =
            Bitwise.shiftLeftBy 7 (flagToByte conditionCodes.s)

        six =
            Bitwise.shiftLeftBy 6 (flagToByte conditionCodes.z)

        five =
            0

        four =
            Bitwise.shiftLeftBy 4 (flagToByte conditionCodes.ac)

        three =
            0

        two =
            Bitwise.shiftLeftBy 2 (flagToByte conditionCodes.p)

        one =
            Bitwise.shiftLeftBy 1 1

        zero =
            flagToByte conditionCodes.cy
    in
    List.foldl
        Bitwise.or
        0
        [ seven, six, five, four, three, two, one, zero ]


readPSW : ByteValue -> List MachineStateDiffEvent
readPSW psw =
    [ SetCpu (SetFlag (SetFlagZ (64 == Bitwise.and psw 64)))
    , SetCpu (SetFlag (SetFlagS (128 == Bitwise.and psw 128)))
    , SetCpu (SetFlag (SetFlagP (4 == Bitwise.and psw 4)))
    , SetCpu (SetFlag (SetFlagCY (1 == Bitwise.and psw 1)))
    , SetCpu (SetFlag (SetFlagAC (16 == Bitwise.and psw 16)))
    ]


createFlags : ConditionCodes -> String
createFlags conditionCodes =
    let
        sFlag =
            if conditionCodes.s then
                "s"

            else
                "."

        zFlag =
            if conditionCodes.z then
                "z"

            else
                "."

        acFlag =
            if conditionCodes.ac then
                "(ac)"

            else
                "."

        pFlag =
            if conditionCodes.p then
                "p"

            else
                "."

        cyFlag =
            if conditionCodes.cy then
                "(cy)"

            else
                "."
    in
    String.concat [ sFlag, zFlag, acFlag, pFlag, cyFlag ]
