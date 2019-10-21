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
    CpuState 0 0 0 0 0 0 0 0 0 allFalseConditionCodes False 0


allFalseConditionCodes : ConditionCodes
allFalseConditionCodes =
    ConditionCodes False False False False False


all : Test
all =
    describe "MachineInstructions"
        [ describe "0x00 - nop"
            [ test "for zero machine state" <|
                \() ->
                    let
                        expectedMachineStateDiff =
                            Events [ SetCpu (SetPC 1) ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.nop allZeroMachineState)
            ]
        , describe "0x01 - lxi_b_d16"
            [ test "for zero machine state" <|
                \() ->
                    let
                        expectedMachineStateDiff =
                            Events [ SetCpu (SetRegisterB 3), SetCpu (SetRegisterC 2), SetCpu (SetPC 3) ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.lxi_b_d16 2 3 allZeroMachineState)
            ]
        , describe "0x02 - stax_b"
            [ test "for zero machine state" <|
                \() ->
                    let
                        a =
                            1

                        b =
                            2

                        c =
                            3

                        machineState =
                            { allZeroMachineState | cpuState = CpuState a b c 0 0 0 0 0 0 allFalseConditionCodes False 0 }

                        expectedMachineStateDiff =
                            Events [ SetMemory (b * 256 + c) a, SetCpu (SetPC 1) ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.stax_b machineState)
            ]
        ]
