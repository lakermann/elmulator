module Psw exposing (..)

import Bitwise
import BitOperations exposing (boolToInt)
import MachineState exposing (ConditionCodes)


createPSW : ConditionCodes -> Int
createPSW conditionCodes =
    let
        seven =
            Bitwise.shiftLeftBy 7 (boolToInt conditionCodes.s)

        six =
            Bitwise.shiftLeftBy 6 (boolToInt conditionCodes.z)

        five =
            0

        four =
            Bitwise.shiftLeftBy 4 (boolToInt conditionCodes.ac)

        three =
            0

        two =
            Bitwise.shiftLeftBy 2 (boolToInt conditionCodes.p)

        one =
            Bitwise.shiftLeftBy 1 1

        zero =
            boolToInt conditionCodes.cy
    in
    List.foldl
        Bitwise.or
        0
        [ seven, six, five, four, three, two, one, zero ]
