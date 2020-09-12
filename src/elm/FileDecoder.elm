module FileDecoder exposing (decodeFile, patchDecodedFile)

import Bytes exposing (Bytes)
import Bytes.Decode as Decode
import EmulatorState exposing (ByteValue)
import List


decodeFile : Bytes -> List ByteValue
decodeFile rawData =
    let
        listDecoder =
            bytesListDecoder Decode.unsignedInt8 (Bytes.width rawData)
    in
    Maybe.withDefault [] (Decode.decode listDecoder rawData)


patchDecodedFile : List ByteValue -> List ByteValue
patchDecodedFile decodedFile =
    let
        start =
            List.take 111 decodedFile

        endOne =
            List.drop 112 decodedFile

        withDAA =
            List.concat
                [ [ 0xC3, 0x00, 0x01 ], List.repeat 253 0, start, [ 0x07 ], endOne ]
    in
    List.concat [ List.take 0x059C withDAA, [ 0xC3, 0xC2, 0x05 ], List.drop 0x059F withDAA ]


bytesListDecoder : Decode.Decoder a -> Int -> Decode.Decoder (List a)
bytesListDecoder decoder len =
    Decode.loop ( len, [] ) (listStep decoder)


listStep : Decode.Decoder a -> ( Int, List a ) -> Decode.Decoder (Decode.Step ( Int, List a ) (List a))
listStep decoder ( n, xs ) =
    if n <= 0 then
        Decode.succeed (Decode.Done xs)

    else
        Decode.map (\x -> Decode.Loop ( n - 1, xs ++ [ x ] )) decoder
