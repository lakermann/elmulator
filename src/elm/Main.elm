module Main exposing (main)

import Bootstrap.Button as Button
import Bootstrap.CDN as CDN
import Bootstrap.Grid as Grid
import Browser
import Browser.Events
import Bytes exposing (Bytes)
import Canvas exposing (rect, shapes)
import Canvas.Settings exposing (fill)
import Color exposing (Color)
import Cpu exposing (nStep, oneStep)
import EmulatorState exposing (EmulatorState(..), MachineState)
import File exposing (File)
import File.Select as Select
import FileDecoder exposing (decodeFile)
import Html exposing (Html, div, h1, h3, p, pre, text)
import Html.Attributes exposing (class, height, width)
import Html.Events exposing (onClick)
import Instruction exposing (Instruction, instructionToString)
import InstructionDisassembler exposing (disassembleToInstructions)
import Task
import UI.Formatter exposing (cpustate)
import UI.KeyDecoder exposing (keyDecoder)
import UI.Msg exposing (Msg(..))



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
    , currentCpuState : EmulatorState
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model Nothing (Invalid Nothing "No ROM loaded yet"), Cmd.none )



-- UPDATE


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

        NextStepsRequested n ->
            case model.currentCpuState of
                Valid currentCpuState ->
                    ( { model | currentCpuState = nStep n currentCpuState }
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
                            [ text "(l)oad rom" ]
                        ]
                    ]
                ]

        Just content ->
            Grid.container []
                [ CDN.stylesheet -- creates an inline style node with the Bootstrap CSS
                , pageHeader
                , Button.button
                    [ Button.outlinePrimary
                    , Button.attrs
                        [ onClick (NextStepsRequested 1)
                        ]
                    ]
                    [ text "(n)ext step" ]
                , text "   "
                , Button.button
                    [ Button.outlinePrimary
                    , Button.attrs
                        [ onClick (NextStepsRequested 1500)
                        ]
                    ]
                    [ text "ne(x)t 1500 step" ]
                , text "   "
                , Button.button
                    [ Button.outlineDanger
                    , Button.attrs
                        [ onClick Reset
                        ]
                    ]
                    [ text "(r)eset" ]
                , Grid.row []
                    [ Grid.col []
                        [ h3 [] [ text "Screen" ]
                        , screen
                        ]
                    , Grid.col []
                        [ h3 [] [ text "Machine State" ]
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
    Canvas.toHtml ( width, height )
        []
        [ shapes [ fill Color.green ] [ rect ( 0, 0 ) width height ]
        , renderPixel
        ]


renderPixel =
    shapes [ fill Color.black ]
        [ rect ( 0, 0 ) 1 1 ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions model =
    Browser.Events.onKeyDown keyDecoder
