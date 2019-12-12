module LogicFlags exposing (..)

import Bitwise
import EmulatorState exposing (ByteValue, Flag, MachineStateDiffEvent(..), SetCpuStateEvent(..), SetFlagEvent(..))


setFlagZ : Flag -> MachineStateDiffEvent
setFlagZ newValue =
    SetCpu (SetFlag (SetFlagZ newValue))


setFlagS : Flag -> MachineStateDiffEvent
setFlagS newValue =
    SetCpu (SetFlag (SetFlagS newValue))


setFlagP : Flag -> MachineStateDiffEvent
setFlagP newValue =
    SetCpu (SetFlag (SetFlagP newValue))


flags_ZSP : ByteValue -> List MachineStateDiffEvent
flags_ZSP value =
    [ setFlagZ (value == 0)
    , setFlagS (Bitwise.and 128 value == 128)
    , setFlagP (modBy 2 value == 0)
    ]
