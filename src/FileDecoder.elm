module FileDecoder exposing (decodeFile)

import Bytes exposing (Bytes)
import Bytes.Decode as Decode


decodeFile : Bytes -> List Int
decodeFile rawData =
    let
        listDecoder =
            bytesListDecoder Decode.unsignedInt8 (Bytes.width rawData)
    in
    Maybe.withDefault [] (Decode.decode listDecoder rawData)


bytesListDecoder : Decode.Decoder a -> Int -> Decode.Decoder (List a)
bytesListDecoder decoder len =
    Decode.loop ( len, [] ) (listStep decoder)


listStep : Decode.Decoder a -> ( Int, List a ) -> Decode.Decoder (Decode.Step ( Int, List a ) (List a))
listStep decoder ( n, xs ) =
    if n <= 0 then
        Decode.succeed (Decode.Done xs)

    else
        Decode.map (\x -> Decode.Loop ( n - 1, xs ++ [ x ] )) decoder
