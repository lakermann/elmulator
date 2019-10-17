module UI.Formatter exposing (..)

import Hex
import MachineState exposing (CpuState, MachineState(..))


formatCpuState : CpuState -> String
formatCpuState cpuState =
    String.join "\n" (formatRegisters cpuState)


formatRegisters : CpuState -> List String
formatRegisters cpuState =
    [ "a:  " ++ Hex.padX2 cpuState.a
    , "b:  " ++ Hex.padX2 cpuState.b
    , "d:  " ++ Hex.padX2 cpuState.c
    , "d:  " ++ Hex.padX2 cpuState.d
    , "e:  " ++ Hex.padX2 cpuState.e
    , "h:  " ++ Hex.padX2 cpuState.h
    , "l:  " ++ Hex.padX2 cpuState.l
    , "sp: " ++ Hex.padX4 cpuState.sp
    , "pc: " ++ Hex.padX4 cpuState.pc
    , "cycleCount: " ++ String.fromInt cpuState.cycleCount
    ]


cpustate : MachineState -> String
cpustate state =
    case state of
        Invalid Nothing string ->
            "ERROR:" ++ "\n" ++ string ++ "\n\n" ++ "No last known CPU state"

        Invalid (Just cpuState) string ->
            "ERROR:" ++ "\n" ++ string ++ "\n\n" ++ "Last known CPU state:" ++ "\n" ++ formatCpuState cpuState

        Valid cpuState ->
            formatCpuState cpuState
