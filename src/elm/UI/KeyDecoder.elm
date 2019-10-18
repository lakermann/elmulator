module UI.KeyDecoder exposing (..)

import Json.Decode as Decode
import UI.Msg exposing (Msg(..))


keyDecoderDown : Decode.Decoder Msg
keyDecoderDown =
    Decode.field "key" Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "l" ->
                        Decode.succeed RomRequested

                    "r" ->
                        Decode.succeed Reset

                    "n" ->
                        Decode.succeed (NextStepsRequested 1)

                    "x" ->
                        Decode.succeed (NextStepsRequested 1500)

                    "a" ->
                        Decode.succeed LeftDown

                    _ ->
                        Decode.fail "Pressed key is not a Elmulator Button"
            )


keyDecoderUp : Decode.Decoder Msg
keyDecoderUp =
    Decode.field "key" Decode.string
        |> Decode.andThen
            (\string ->
                case string of
                    "a" ->
                        Decode.succeed LeftUp

                    _ ->
                        Decode.fail "Pressed key is not a Elmulator Button"
            )
