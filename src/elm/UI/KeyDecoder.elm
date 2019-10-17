module UI.KeyDecoder exposing (..)

import Json.Decode as Decode
import UI.Msg exposing (Msg(..))


keyDecoder : Decode.Decoder Msg
keyDecoder =
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

                    _ ->
                        Decode.fail "Pressed key is not a Elmulator Button"
            )
