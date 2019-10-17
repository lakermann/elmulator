module UI.Formatter exposing (..)

import EmulatorState exposing (EmulatorState(..), MachineState)
import Hex
import Psw exposing (createPSW)


formatCpuState : MachineState -> String
formatCpuState cpuState =
    String.join "\n" (formatRegisters cpuState)


formatRegisters : MachineState -> List String
formatRegisters machineState =
    [ "a:   " ++ Hex.padX2 machineState.cpuState.a
    , "b:   " ++ Hex.padX2 machineState.cpuState.b
    , "d:   " ++ Hex.padX2 machineState.cpuState.c
    , "d:   " ++ Hex.padX2 machineState.cpuState.d
    , "e:   " ++ Hex.padX2 machineState.cpuState.e
    , "h:   " ++ Hex.padX2 machineState.cpuState.h
    , "l:   " ++ Hex.padX2 machineState.cpuState.l
    , "psw: " ++ Hex.padX2 (createPSW machineState.cpuState.conditionCodes)
    , "sp:  " ++ Hex.padX4 machineState.cpuState.sp
    , "pc:  " ++ Hex.padX4 machineState.cpuState.pc
    , "cycleCount: " ++ String.fromInt machineState.cpuState.cycleCount
    ]


cpustate : EmulatorState -> String
cpustate state =
    case state of
        Invalid Nothing string ->
            "ERROR:" ++ "\n" ++ string ++ "\n\n" ++ "No last known CPU state"

        Invalid (Just cpuState) string ->
            "ERROR:" ++ "\n" ++ string ++ "\n\n" ++ "Last known CPU state:" ++ "\n" ++ formatCpuState cpuState

        Valid cpuState ->
            formatCpuState cpuState
