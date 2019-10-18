module UI.Formatter exposing (..)

import BitOperations exposing (flagToByte)
import EmulatorState exposing (EmulatorState(..), MachineState)
import Hex
import Memory
import Psw exposing (createPSW)


formatCpuState : MachineState -> String
formatCpuState cpuState =
    String.join "\n" (formatRegisters cpuState)


formatRegisters : MachineState -> List String
formatRegisters machineState =
    [ "a:   " ++ Hex.padX2 machineState.cpuState.a
    , "b:   " ++ Hex.padX2 machineState.cpuState.b
    , "c:   " ++ Hex.padX2 machineState.cpuState.c
    , "d:   " ++ Hex.padX2 machineState.cpuState.d
    , "e:   " ++ Hex.padX2 machineState.cpuState.e
    , "h:   " ++ Hex.padX2 machineState.cpuState.h
    , "l:   " ++ Hex.padX2 machineState.cpuState.l
    , "psw: " ++ Hex.padX2 (createPSW machineState.cpuState.conditionCodes)
    , "sp:  " ++ Hex.padX4 machineState.cpuState.sp
    , "pc:  " ++ Hex.padX4 machineState.cpuState.pc
    , "ie:  " ++ Hex.padX2 (flagToByte machineState.cpuState.intEnable)
    , "cycleCount: " ++ String.fromInt machineState.cpuState.cycleCount
    , "-----------------------"
    , "sr l:  " ++ Hex.padX2 machineState.shiftRegister.lower
    , "sr u:  " ++ Hex.padX2 machineState.shiftRegister.upper
    , "sr o:  " ++ Hex.padX2 machineState.shiftRegister.offset
    , "p 1:   " ++ Hex.padX2 machineState.ports.one
    , "p 2:   " ++ Hex.padX2 machineState.ports.two
    , "-----------------------"
    , "sp -1: " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.sp - 1) machineState.memory)
    , "sp 0:  " ++ Hex.padX2 (Memory.readMemory machineState.cpuState.sp machineState.memory)
    , "sp 1:  " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.sp + 1) machineState.memory)
    , "sp 2:  " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.sp + 2) machineState.memory)
    , "-----------------------"
    , "pc -4: " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.pc - 4) machineState.memory)
    , "pc -3: " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.pc - 3) machineState.memory)
    , "pc -2: " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.pc - 2) machineState.memory)
    , "pc -1: " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.pc - 1) machineState.memory)
    , "pc 0:  " ++ Hex.padX2 (Memory.readMemory machineState.cpuState.pc machineState.memory)
    , "pc 1:  " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.pc + 1) machineState.memory)
    , "pc 2:  " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.pc + 2) machineState.memory)
    , "pc 3:  " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.pc + 3) machineState.memory)
    , "pc 4:  " ++ Hex.padX2 (Memory.readMemory (machineState.cpuState.pc + 4) machineState.memory)
    , "-----------------------"
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
