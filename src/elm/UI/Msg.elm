module UI.Msg exposing (..)

import Bytes exposing (Bytes)
import File exposing (File)
import Time


type Msg
    = RomRequested
    | RomSelected File
    | RomLoaded Bytes
    | NextStepsRequested Int
    | KeyDown GameKey
    | KeyUp GameKey
    | Reset
    | Tick Time.Posix


type GameKey
    = Left
    | Right
    | Space
