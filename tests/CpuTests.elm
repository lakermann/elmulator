module CpuTests exposing (..)

import Array
import Cpu exposing (apply)
import MachineState exposing (ConditionCodes, CpuState, MachineState(..), MachineStateDiff(..), MachineStateDiffEvent(..))
import Expect
import Test exposing (..)

all : Test
all =
    describe "Cpu"
    [ describe "apply"
      [ test "applies diff events from left to right" <|
        \() ->
            let
              machineStateDiff =  Events [ SetRegisterB 11, SetRegisterB 22 ]
              initialCpuState = allZeroCpuState
              updatedCpuState = apply machineStateDiff initialCpuState
              valueOfRegisterB = getValueOfRegisterB updatedCpuState
            in
              Expect.equal (Just 22) valueOfRegisterB
        , test "applies PC update correctly" <|
        \() ->
            let
                machineStateDiff = Events [ SetPC 99 ]
                initialCpuState = allZeroCpuState
                updatedCpuState = apply machineStateDiff initialCpuState
                valueOfPC = getValueOfPC updatedCpuState
            in
              Expect.equal (Just 99) valueOfPC
      ]
    ]

allZeroCpuState = CpuState 0 0 0 0 0 0 0 0 0 Array.empty (ConditionCodes False False False False False) False

getValueOfRegisterB : MachineState -> Maybe Int
getValueOfRegisterB machineState =
    case machineState of
        Valid cpuState -> Just (cpuState.b)


        Invalid _ _ -> Nothing

getValueOfPC : MachineState -> Maybe Int
getValueOfPC machineState =
    case machineState of
        Valid cpuState -> Just (cpuState.pc)


        Invalid _ _ -> Nothing
