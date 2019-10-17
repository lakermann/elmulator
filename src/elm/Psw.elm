module Psw exposing (..)

import BitOperations exposing (flagToByte)
import Bitwise
import EmulatorState exposing (ByteValue, ConditionCodes)


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
