module Main exposing (main)

import Bootstrap.Button as Button
import Bootstrap.CDN as CDN
import Bootstrap.Grid as Grid
import Browser
import Bytes exposing (Bytes)
import Cpu exposing (oneStep)
import File exposing (File)
import File.Select as Select
import FileDecoder exposing (decodeFile)
import Html exposing (Html, div, h1, h2, h3, pre, text)
import Html.Events exposing (onClick)
import Instruction exposing (Instruction, instructionToString)
import InstructionDisassembler exposing (disassembleToInstructions)
import MachineState exposing (CpuState, MachineState(..))
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
    , currentCpuState : MachineState
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model Nothing Cpu.init, Cmd.none )



-- UPDATE


type Msg
    = RomRequested
    | RomSelected File
    | RomLoaded Bytes
    | NextStepRequested MachineState


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

        NextStepRequested machineState ->
            case machineState of
                Valid currentCpuState ->
                    ( { model | currentCpuState = oneStep currentCpuState }
                    , Cmd.none
                    )

                Invalid maybe string ->
                    ( model
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


cpustate : MachineState -> String
cpustate state =
    case state of
        Invalid _ string ->
            string

        Valid cpuState ->
            String.join "\n"
                [ "a: " ++ String.fromInt cpuState.a
                , "b: " ++ String.fromInt cpuState.b
                , "d: " ++ String.fromInt cpuState.c
                , "d: " ++ String.fromInt cpuState.d
                , "e: " ++ String.fromInt cpuState.e
                , "h: " ++ String.fromInt cpuState.h
                , "l: " ++ String.fromInt cpuState.l
                , "sp:" ++ String.fromInt cpuState.sp
                , "pc:" ++ String.fromInt cpuState.pc
                ]


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
                                [ onClick (NextStepRequested model.currentCpuState)
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
                        , pre [] [ text (cpustate model.currentCpuState) ]
                        ]
                    ]
                ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
