module CpuTests exposing (..)

import Array
import Cpu exposing (apply)
import EmulatorState exposing (ConditionCodes, CpuState, EmulatorState(..), MachineState, MachineStateDiff(..), MachineStateDiffEvent(..), SetCpuStateEvent(..))
import Expect
import Test exposing (..)

all : Test
all =
    describe "Cpu"
    [ describe "apply"
      [ test "applies diff events from left to right" <|
        \() ->
            let
              machineStateDiff =  Events [ SetCpu (SetRegisterB 11), SetCpu (SetRegisterB 22) ]
              initialMachineState = allZeroMachineState
              updatedMachineState = apply machineStateDiff initialMachineState
              valueOfRegisterB = getValueOfRegisterB updatedMachineState
            in
              Expect.equal (Just 22) valueOfRegisterB
        , test "applies PC update correctly" <|
        \() ->
            let
                machineStateDiff = Events [ SetCpu (SetPC 99) ]
                initialMachineState = allZeroMachineState
                updatedMachineState = apply machineStateDiff initialMachineState
                valueOfPC = getValueOfPC updatedMachineState
            in
              Expect.equal (Just 99) valueOfPC
      ]
    ]

allZeroMachineState = MachineState allZeroCpuState Array.empty
allZeroCpuState = CpuState 0 0 0 0 0 0 0 0 0 (ConditionCodes False False False False False) False 0

getValueOfRegisterB : EmulatorState -> Maybe Int
getValueOfRegisterB emulatorState =
    case emulatorState of
        Valid machineState -> Just (machineState.cpuState.b)


        Invalid _ _ -> Nothing

getValueOfPC : EmulatorState -> Maybe Int
getValueOfPC emulatorState =
    case emulatorState of
        Valid machineState -> Just (machineState.cpuState.pc)


        Invalid _ _ -> Nothing
