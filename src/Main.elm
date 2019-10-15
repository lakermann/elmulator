module Main exposing (main)

import Bootstrap.Button as Button
import Bootstrap.CDN as CDN
import Bootstrap.Grid as Grid
import Browser
import Bytes exposing (Bytes)
import File exposing (File)
import File.Select as Select
import FileDecoder exposing (decodeFile)
import Html exposing (Html, div, h1, h2, h3, pre, text)
import Html.Events exposing (onClick)
import Instruction exposing (Instruction, instructionToString)
import InstructionDisassembler exposing (disassembleToInstructions)
import Task



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { data : Maybe Bytes
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model Nothing, Cmd.none )



-- UPDATE


type Msg
    = RomRequested
    | RomSelected File
    | RomLoaded Bytes


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RomRequested ->
            ( model
            , Select.file [ "application/any" ] RomSelected
            )

        RomSelected file ->
            ( model
            , Task.perform RomLoaded (File.toBytes file)
            )

        RomLoaded content ->
            ( { model | data = Just content }
            , Cmd.none
            )



-- VIEW


disassemble : Bytes -> String
disassemble data =
    let
        decodedFile =
            decodeFile data

        disassembledFile =
            disassembleToInstructions decodedFile
    in
    String.join "\n" (List.map instructionToString disassembledFile)


view : Model -> Html Msg
view model =
    case model.data of
        Nothing ->
            Grid.container []
                [ CDN.stylesheet -- creates an inline style node with the Bootstrap CSS
                , Grid.row []
                    [ Grid.col []
                        [ h1 [] [ text "Elmulator" ] ]
                    ]
                , Grid.row []
                    [ Grid.col []
                        [ Button.button
                            [ Button.success
                            , Button.attrs
                                [ onClick RomRequested
                                ]
                            ]
                            [ text "Load ROM" ]
                        ]
                    ]
                ]

        Just content ->
            Grid.container []
                [ CDN.stylesheet -- creates an inline style node with the Bootstrap CSS
                , Grid.row []
                    [ Grid.col []
                        [ h1 [] [ text "Elmulator" ] ]
                    ]
                , Grid.row []
                    [ Grid.col []
                        [ Button.button
                            [ Button.success
                            , Button.attrs
                                [ onClick RomRequested
                                ]
                            ]
                            [ text "Load ROM" ]
                        ]
                    , Grid.col []
                        [ Button.button
                            [ Button.primary
                            , Button.attrs
                                [ onClick RomRequested
                                ]
                            ]
                            [ text "Next Step" ]
                        ]
                    ]
                , Grid.row []
                    [ Grid.col []
                        [ h3 [] [ text "Code" ]
                        , pre [] [ text (disassemble content) ]
                        ]
                    , Grid.col []
                        [ h3 [] [ text "CPU State" ]
                        ]
                    ]
                ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
