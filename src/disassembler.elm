module Disassembler exposing (main)

import Browser
import Bytes exposing (Bytes)
import File exposing (File)
import File.Select as Select
import Html exposing (Html, button, p, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
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


init : () -> (Model, Cmd Msg)
init _ =
  ( Model Nothing, Cmd.none )



-- UPDATE


type Msg
  = RomRequested
  | RomSelected File
  | RomLoaded Bytes


update : Msg -> Model -> (Model, Cmd Msg)
update msg model =
  case msg of
    RomRequested ->
      ( model
      , Select.file ["application/any"] RomSelected
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
disassemble data = "Hello, world"


view : Model -> Html Msg
view model =
  case model.data of
    Nothing ->
      button [ onClick RomRequested ] [ text "Load ROM" ]

    Just content ->
      p [ style "white-space" "pre" ] [ text (disassemble content) ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
  Sub.none