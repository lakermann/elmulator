module Memory exposing (..)

import Array
import MachineState exposing (AddressValue, ByteValue, Memory)


readMemory : AddressValue -> Memory -> ByteValue
readMemory address memory =
    let
        readValue =
            Array.get address memory
    in
    case readValue of
        Just value ->
            value

        Nothing ->
            0
