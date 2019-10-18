module UI.Msg exposing (..)

import Bytes exposing (Bytes)
import File exposing (File)
import Time


type Msg
    = RomRequested
    | RomSelected File
    | RomLoaded Bytes
    | NextStepsRequested Int
    | Emulation Time.Posix
    | KeyDown GameKey
    | KeyUp GameKey
    | Reset
    | TickInterrupt Time.Posix
    | InterruptRequested


type GameKey
    = Left
    | Right
    | Space
