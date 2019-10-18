module UI.Msg exposing (..)

import Bytes exposing (Bytes)
import File exposing (File)


type Msg
    = RomRequested
    | RomSelected File
    | RomLoaded Bytes
    | NextStepsRequested Int
    | KeyDown GameKey
    | KeyUp GameKey
    | Reset


type GameKey
    = Left
    | Right
    | Space
