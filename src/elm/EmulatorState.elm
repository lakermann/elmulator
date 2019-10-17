module EmulatorState exposing (..)

import Array exposing (Array)


type alias ByteValue =
    Int



-- 8 bit


type alias RegisterValue =
    ByteValue


type alias AddressValue =
    Int



-- 16 bit


type EmulatorState
    = Valid MachineState
    | Invalid (Maybe MachineState) String


type alias Memory =
    Array ByteValue


type alias MachineState =
    { cpuState : CpuState
    , memory : Memory
    }


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
    , conditionCodes : ConditionCodes
    , intEnable : Flag
    , cycleCount : Int
    }


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
    = SetCpu SetCpuStateEvent
    | SetMemory AddressValue ByteValue


type SetCpuStateEvent
    = SetRegisterA RegisterValue
    | SetRegisterB RegisterValue
    | SetRegisterC RegisterValue
    | SetRegisterD RegisterValue
    | SetRegisterE RegisterValue
    | SetRegisterH RegisterValue
    | SetRegisterL RegisterValue
    | SetPC AddressValue
    | SetSP AddressValue
    | SetFlag SetFlagEvent
    | SetIntEnable Flag
    | AddCycles Int


type SetFlagEvent
    = SetFlagZ Flag
    | SetFlagS Flag
    | SetFlagP Flag
    | SetFlagCY Flag
    | SetFlagAC Flag


type MachineStateDiff
    = Failed (Maybe MachineState) String
    | Events (List MachineStateDiffEvent)
