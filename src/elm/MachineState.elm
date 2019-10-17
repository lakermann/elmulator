module MachineState exposing (..)

import Array exposing (Array)

-- 8 bit
type alias ByteValue
    = Int

type alias RegisterValue =
    ByteValue

-- 16 bit
type alias AddressValue =
    Int

type MachineState
    = Valid CpuState
    | Invalid (Maybe CpuState) String

type alias CpuState =
    { a : RegisterValue
    , b : RegisterValue
    , c : RegisterValue
    , d : RegisterValue
    , e : RegisterValue
    , h : RegisterValue
    , l : RegisterValue
    , sp : AddressValue
    , pc : AddressValue
    , memory : Memory
    , conditionCodes : ConditionCodes
    , intEnable : Flag
    }


type alias Memory =
    Array ByteValue


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
    = SetRegisterA RegisterValue
    | SetRegisterB RegisterValue
    | SetRegisterC RegisterValue
    | SetRegisterD RegisterValue
    | SetRegisterE RegisterValue
    | SetRegisterH RegisterValue
    | SetRegisterL RegisterValue
    | SetMemory AddressValue ByteValue
    | SetPC AddressValue
    | SetSP AddressValue
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
