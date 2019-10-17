module UI.Msg exposing (..)

import Bytes exposing (Bytes)
import File exposing (File)


type Msg
    = RomRequested
    | RomSelected File
    | RomLoaded Bytes
    | NextStepRequested
    | Reset
