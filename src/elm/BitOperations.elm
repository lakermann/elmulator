module BitOperations exposing (..)

import Bitwise
import EmulatorState exposing (AddressValue, ByteValue, Flag)


flagToByte : Flag -> ByteValue
flagToByte bool =
    case bool of
        True ->
            1

        False ->
            0


getAddressLE : ByteValue -> ByteValue -> AddressValue
getAddressLE low high =
    combineBytes high low


combineBytes : ByteValue -> ByteValue -> AddressValue
combineBytes high low =
    Bitwise.shiftLeftBy 8 high
        + low
