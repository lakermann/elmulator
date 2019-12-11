module Main exposing (main)

import Array exposing (Array)
import Bootstrap.Button as Button
import Bootstrap.CDN as CDN
import Bootstrap.Form.Input as Input
import Bootstrap.Grid as Grid
import Browser
import Browser.Events
import Bytes exposing (Bytes)
import Canvas exposing (Renderable, rect, shapes)
import Canvas.Settings exposing (fill)
import Color exposing (Color)
import Cpu exposing (checkForInterrupt, interrupt, keyPressed, keyReleased, nStep)
import EmulatorState exposing (ByteValue, EmulatorState(..), MachineState)
import File exposing (File)
import File.Select as Select
import FileDecoder exposing (decodeFile)
import Graphics exposing (Pixel(..), renderScreen, toPixels)
import Html exposing (Html, div, h1, h3, p, pre, text)
import Html.Attributes exposing (class, height, width)
import Html.Events exposing (onClick)
import Instruction exposing (Instruction, instructionToString)
import InstructionDisassembler exposing (disassembleToInstructions)
import Memory exposing (readMemorySlice)
import Task
import Time
import UI.Formatter exposing (cpustate)
import UI.KeyDecoder exposing (keyDecoderDown, keyDecoderUp)
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
    , nsteps : Int
    , ticks : Int
    , ticksDiff : Int
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model Nothing (Invalid Nothing "No ROM loaded yet") 0 0 0, Cmd.none )



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

        KeyDown key ->
            case model.currentCpuState of
                Valid currentCpuState ->
                    ( { model | currentCpuState = keyPressed key currentCpuState }
                    , Cmd.none
                    )

                Invalid _ _ ->
                    ( model
                    , Cmd.none
                    )

        KeyUp key ->
            case model.currentCpuState of
                Valid currentCpuState ->
                    ( { model | currentCpuState = keyReleased key currentCpuState }
                    , Cmd.none
                    )

                Invalid _ _ ->
                    ( model
                    , Cmd.none
                    )

        TickInterrupt _ ->
            case model.currentCpuState of
                Valid currentCpuState ->
                    ( { model | currentCpuState = checkForInterrupt currentCpuState }
                    , Cmd.none
                    )

                Invalid _ _ ->
                    ( model
                    , Cmd.none
                    )

        Emulation posix ->
            case model.currentCpuState of
                Valid currentCpuState ->
                    let
                        lastTicks =
                            model.ticks
                    in
                    ( { model
                        | currentCpuState = nStep 2000 currentCpuState
                        , ticks = Time.posixToMillis posix
                        , ticksDiff = Time.posixToMillis posix - lastTicks
                      }
                    , Cmd.none
                    )

                Invalid _ _ ->
                    ( model
                    , Cmd.none
                    )

        InterruptRequested ->
            case model.currentCpuState of
                Valid currentCpuState ->
                    ( { model | currentCpuState = interrupt currentCpuState }
                    , Cmd.none
                    )

                Invalid _ _ ->
                    ( model
                    , Cmd.none
                    )

        Reset ->
            init ()

        StepsUpdated n ->
            ( { model | nsteps = Maybe.withDefault 0 (String.toInt n) }, Cmd.none )

        StepsSubmitted ->
            case model.currentCpuState of
                Valid currentCpuState ->
                    ( { model | currentCpuState = nStep model.nsteps currentCpuState }
                    , Cmd.none
                    )

                Invalid _ _ ->
                    ( model
                    , Cmd.none
                    )


loadDataIntoMemory : Model -> Bytes -> Model
loadDataIntoMemory _ data =
    let
        decodedFile =
            decodeFile data

        initialCpuState =
            Cpu.init decodedFile
    in
    Model (Just data) initialCpuState 0 0 0



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
                , Input.text [ Input.id "steps", Input.onInput StepsUpdated, Input.value (String.fromInt model.nsteps) ]
                , Button.button [ Button.outlinePrimary, Button.attrs [ onClick StepsSubmitted ] ] [ text "n(e)xt n steps" ]
                , text "   "
                , Button.button
                    [ Button.outlinePrimary
                    , Button.attrs
                        [ onClick (NextStepsRequested 20000)
                        ]
                    ]
                    [ text "ne(x)t 20000 steps" ]
                , text "   "
                , Button.button
                    [ Button.outlinePrimary
                    , Button.attrs
                        [ onClick InterruptRequested
                        ]
                    ]
                    [ text "(i)nterrupt" ]
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
                        , screen model.currentCpuState
                        ]
                    , Grid.col []
                        [ h3 [] [ text "Machine State" ]
                        , pre [] [ text (cpustate model.currentCpuState) ]
                        , pre [] [ text ("diff: " ++ String.fromInt model.ticksDiff ++ " ms") ]
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


screen : EmulatorState -> Html msg
screen emulatorState =
    let
        width =
            256

        height =
            224

        renderedScreen =
            --toRenderable Nothing
            toRenderable (readGraphicsMemory emulatorState)
    in
    Canvas.toHtml ( width, height )
        []
        renderedScreen


toRenderable : Maybe (Array ByteValue) -> List Renderable
toRenderable maybeGraphicsMemory =
    case maybeGraphicsMemory of
        Just graphicsMemory ->
            renderScreen (toPixels graphicsMemory)

        Nothing ->
            [ shapes [ fill Color.green ] [ rect ( 0, 0 ) 256 224 ] ]


readGraphicsMemory : EmulatorState -> Maybe (Array ByteValue)
readGraphicsMemory emulatorState =
    case emulatorState of
        Valid machineState ->
            Just (readMemorySlice 0x2400 0x3FFF machineState.memory)

        Invalid _ _ ->
            Nothing



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.batch
        [ Browser.Events.onKeyDown keyDecoderDown
        , Browser.Events.onKeyUp keyDecoderUp
        , Time.every 1 Emulation
        , Time.every 17 TickInterrupt
        ]
