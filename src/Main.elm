module Main exposing (main)

import Array
import Bootstrap.Button as Button
import Bootstrap.CDN as CDN
import Bootstrap.Grid as Grid
import Browser
import Bytes exposing (Bytes)
import Cpu exposing (oneStep)
import File exposing (File)
import File.Select as Select
import FileDecoder exposing (decodeFile)
import Hex
import Html exposing (Html, h1, h3, pre, text)
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
    | Reset


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
            ( loadDataIntoMemory model content
            , Cmd.none
            )

        NextStepRequested machineState ->
            case machineState of
                Valid currentCpuState ->
                    ( { model | currentCpuState = oneStep currentCpuState }
                    , Cmd.none
                    )

                Invalid _ _ ->
                    ( model
                    , Cmd.none
                    )

        Reset ->
            init ()


-- TODO: Sloppily hacked together, needs improving...
loadDataIntoMemory : Model -> Bytes -> Model
loadDataIntoMemory model data =
    let
        currentCpuState = model.currentCpuState
        memoryWithFileLoaded = Array.fromList( decodeFile data) -- TODO: We need to fill values
    in
        case currentCpuState of
            Valid cpuState ->
                    Model (Just data) (Valid { cpuState | memory = memoryWithFileLoaded })

            Invalid _ _ -> Model Nothing currentCpuState


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
                [ "a:  " ++ Hex.pad2 cpuState.a
                , "b:  " ++ Hex.pad2 cpuState.b
                , "d:  " ++ Hex.pad2 cpuState.c
                , "d:  " ++ Hex.pad2 cpuState.d
                , "e:  " ++ Hex.pad2 cpuState.e
                , "h:  " ++ Hex.pad2 cpuState.h
                , "l:  " ++ Hex.pad2 cpuState.l
                , "sp: " ++ Hex.pad4 cpuState.sp
                , "pc: " ++ Hex.pad4 cpuState.pc
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
                            [ Button.outlineSuccess
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
                            [ Button.outlineDanger
                            , Button.attrs
                                [ onClick Reset
                                ]
                            ]
                            [ text "Reset" ]
                        ]
                    , Grid.col []
                        [ Button.button
                            [ Button.outlinePrimary
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
