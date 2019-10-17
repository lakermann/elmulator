module UI.Formatter exposing (..)

import Hex
import MachineState exposing (CpuState)


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
