module ConditionCodesFlags exposing (..)

import Bitwise


zFlag : Int -> Bool
zFlag result =
    if result == 0 then
        True

    else
        False


sFlag : Int -> Bool
sFlag result =
    if Bitwise.and 128 result == 128 then
        True

    else
        False


pFlag : Int -> Bool
pFlag result =
    if modBy 2 result == 0 then
        True

    else
        False


cyFlagAdd : Int -> Bool
cyFlagAdd result =
    if result > 255 then
        True

    else
        False


acFalg : Bool
acFalg =
    False
