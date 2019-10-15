module BitOperations exposing (..)

import Bitwise


boolToInt : Bool -> Int
boolToInt bool =
    case bool of
        True ->
            1

        False ->
            0


getAddressLE : Int -> Int -> Int
getAddressLE low high =
    combineBytes high low


combineBytes : Int -> Int -> Int
combineBytes high low =
    Bitwise.shiftLeftBy high 8
        + low
