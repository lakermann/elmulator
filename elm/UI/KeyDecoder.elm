module UI.KeyDecoder exposing (..)

import Json.Decode as Decode
import UI.Msg exposing (GameKey(..), Msg(..))


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

                    "i" ->
                        Decode.succeed InterruptRequested

                    "a" ->
                        Decode.succeed (KeyDown Left)

                    "d" ->
                        Decode.succeed (KeyDown Right)

                    "e" ->
                        Decode.succeed StepsSubmitted

                    "s" ->
                        Decode.succeed (KeyDown Space)

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
                        Decode.succeed (KeyUp Left)

                    "d" ->
                        Decode.succeed (KeyUp Right)

                    "s" ->
                        Decode.succeed (KeyUp Space)

                    _ ->
                        Decode.fail "Pressed key is not a Elmulator Button"
            )
