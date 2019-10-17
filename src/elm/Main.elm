module Main exposing (main)

import Bootstrap.Button as Button
import Bootstrap.CDN as CDN
import Bootstrap.Grid as Grid
import Browser
import Bytes exposing (Bytes)
import Canvas exposing (rect, shapes)
import Canvas.Settings exposing (fill)
import Color exposing (Color)
import Cpu exposing (oneStep)
import File exposing (File)
import File.Select as Select
import FileDecoder exposing (decodeFile)
import Hex
import Html exposing (Html, div, h1, h3, p, pre, text)
import Html.Attributes exposing (class, height, width)
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
    ( Model Nothing (Invalid Nothing "No ROM loaded yet"), Cmd.none )



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


loadDataIntoMemory : Model -> Bytes -> Model
loadDataIntoMemory _ data =
    let
        decodedFile =
            decodeFile data

        initialCpuState =
            Cpu.init decodedFile
    in
    Model (Just data) initialCpuState



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
        Invalid Nothing string ->
            "ERROR:" ++ "\n" ++ string ++ "\n\n" ++ "No last known CPU state"

        Invalid (Just cpuState) string ->
            "ERROR:" ++ "\n" ++ string ++ "\n\n" ++ "Last known CPU state:" ++ "\n" ++ (formatCpuState cpuState)

        Valid cpuState ->
            formatCpuState cpuState

formatCpuState : CpuState -> String
formatCpuState cpuState =
    String.join "\n" (formatRegisters cpuState)


formatRegisters : CpuState -> List String
formatRegisters cpuState =
    [ "a:  " ++ Hex.padX2 cpuState.a
    , "b:  " ++ Hex.padX2 cpuState.b
    , "d:  " ++ Hex.padX2 cpuState.c
    , "d:  " ++ Hex.padX2 cpuState.d
    , "e:  " ++ Hex.padX2 cpuState.e
    , "h:  " ++ Hex.padX2 cpuState.h
    , "l:  " ++ Hex.padX2 cpuState.l
    , "sp: " ++ Hex.padX4 cpuState.sp
    , "pc: " ++ Hex.padX4 cpuState.pc
    , "cycleCount: " ++ (String.fromInt cpuState.cycleCount)
    ]


view : Model -> Html Msg
view model =
    case model.data of
        Nothing ->
            Grid.container []
                [ CDN.stylesheet -- creates an inline style node with the Bootstrap CSS
                , pageHeader
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
                , pageHeader
                , Button.button
                    [ Button.outlineDanger
                    , Button.attrs
                        [ onClick Reset
                        ]
                    ]
                    [ text "Reset" ]
                , Button.button
                    [ Button.outlinePrimary
                    , Button.attrs
                        [ onClick (NextStepRequested model.currentCpuState)
                        ]
                    ]
                    [ text "Next Step" ]
                , Grid.row []
                    [ Grid.col []
                        [ h3 [] [ text "Screen" ]
                        , screen
                        ]
                    , Grid.col []
                        [ h3 [] [ text "CPU State" ]
                        , pre [] [ text (cpustate model.currentCpuState) ]
                        ]
                    , Grid.col []
                        [ h3 [] [ text "Code" ]
                        , div [ class "code-wrapper" ] [ pre [] [ text (disassemble content) ] ]
                        ]
                    ]
                ]


pageHeader : Html Msg
pageHeader =
    div []
        [ h1 [] [ text "Elmulator ", p [ class "lead" ] [ text "A 8080 Emulator written in Elm" ] ]
        ]


screen : Html msg
screen =
    let
        width =
            256

        height =
            224
    in
    Canvas.toHtml ( width, 224 )
        []
        [ shapes [ fill Color.green ] [ rect ( 0, 0 ) width height ]
        , renderPixel
        ]


renderPixel =
    shapes [ fill Color.black ]
        [ rect ( 0, 0 ) 1 1 ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
