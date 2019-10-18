module Memory exposing (..)

import Array exposing (Array)
import EmulatorState exposing (AddressValue, ByteValue, Memory)


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


readMemoryProvider : AddressValue -> Int -> Memory -> () -> ByteValue
readMemoryProvider address offset memory =
    let
        readValue =
            Array.get (address + offset) memory
    in
    \_ ->
        case readValue of
            Just value ->
                value

            Nothing ->
                0



-- TODO: What should we do here?


readMemorySlice : AddressValue -> AddressValue -> Memory -> Array ByteValue
readMemorySlice startAddress endAddress memory =
    Array.slice startAddress endAddress memory
