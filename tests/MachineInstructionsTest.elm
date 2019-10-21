module MachineInstructionsTest exposing (..)

import Array
import EmulatorState exposing (ConditionCodes, CpuState, MachineState, MachineStateDiff(..), MachineStateDiffEvent(..), Ports, SetCpuStateEvent(..), ShiftRegister)
import Expect
import MachineInstructions
import Test exposing (..)


allZeroMachineState : MachineState
allZeroMachineState =
    MachineState allZeroCpuState Array.empty (ShiftRegister 0 0 0) (Ports 0 0)


allZeroCpuState : CpuState
allZeroCpuState =
    CpuState 0 0 0 0 0 0 0 0 0 (ConditionCodes False False False False False) False 0


all : Test
all =
    describe "MachineInstructions"
        [ describe "nop"
            [ test "for zero machine state" <|
                \() ->
                    let
                        expectedMachineStateDiff =
                            Events [ SetCpu (SetPC 1) ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.nop allZeroMachineState)
            ]
        , describe "lxi_b_d16"
            [ test "for zero machine state" <|
                \() ->
                    let
                        expectedMachineStateDiff =
                            Events [ SetCpu (SetRegisterB 3), SetCpu (SetRegisterC 2), SetCpu (SetPC 3) ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.lxi_b_d16 2 3 allZeroMachineState)
            ]
        ]
