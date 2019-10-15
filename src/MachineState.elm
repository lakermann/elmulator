module MachineState exposing (..)

import Array exposing (Array)

type MachineState
    = Valid CpuState
    | Invalid (Maybe CpuState) String

type alias CpuState =
    { a : Register
    , b : Register
    , c : Register
    , d : Register
    , e : Register
    , h : Register
    , l : Register
    , sp : Address
    , pc : Address
    , memory : Memory
    , conditionCodes : ConditionCodes
    , intEnable : Flag
    }


type alias Register =
    Int


type alias Address =
    Int


type alias Memory =
    Array Int


type alias ConditionCodes =
    { z : Flag
    , s : Flag
    , p : Flag
    , cy : Flag
    , ac : Flag

    -- pad
    }


type alias Flag =
    Bool


type MachineStateDiffEvent
    = SetRegisterA Register
    | SetRegisterB Register
    | SetRegisterC Register
    | SetRegisterD Register
    | SetRegisterE Register
    | SetRegisterH Register
    | SetRegisterL Register
    | SetMemory Address Int
    | SetPC Int
    | SetSP Int
    | SetFlag SetFlagEvent
    | SetIntEnable Flag


type SetFlagEvent
    = SetFlagZ Flag
    | SetFlagS Flag
    | SetFlagP Flag
    | SetFlagCY Flag
    | SetFlagAC Flag


type MachineStateDiff
    = Failed (Maybe CpuState) String
    | Events (List MachineStateDiffEvent)
