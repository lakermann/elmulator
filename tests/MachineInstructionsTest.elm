module MachineInstructionsTest exposing (..)

import Array
import EmulatorState exposing (ConditionCodes, CpuState, MachineState, MachineStateDiff(..), MachineStateDiffEvent(..), Ports, SetCpuStateEvent(..), SetFlagEvent(..), ShiftRegister)
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
                            Events
                                [ SetCpu (SetPC 0x01)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.nop allZeroMachineState)
            ]
        , describe "0x01 - lxi_b_d16"
            [ test "for zero machine state" <|
                \() ->
                    let
                        expectedMachineStateDiff =
                            Events
                                [ SetCpu (SetRegisterB 0x03)
                                , SetCpu (SetRegisterC 0x02)
                                , SetCpu (SetPC 0x03)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.lxi_b_d16 0x02 0x03 allZeroMachineState)
            ]
        , describe "0x02 - stax_b"
            [ test "for a=0x01, b=0x02, c=0x03 machine state" <|
                \() ->
                    let
                        a =
                            0x01

                        b =
                            0x02

                        c =
                            0x03

                        machineState =
                            { allZeroMachineState | cpuState = CpuState a b c 0 0 0 0 0 0 allFalseConditionCodes False 0 }

                        expectedMachineStateDiff =
                            Events
                                [ SetMemory (b * 0x0100 + c) a
                                , SetCpu (SetPC 1)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.stax_b machineState)
            ]
        , describe "0x03 - inx_b"
            [ test "for zero machine state" <|
                \() ->
                    let
                        expectedMachineStateDiff1 =
                            Events
                                [ SetCpu (SetRegisterC 1)
                                , SetCpu (SetPC 1)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff1 (MachineInstructions.inx_b allZeroMachineState)
            , test "for c=0xFF machine state" <|
                \() ->
                    let
                        machineState =
                            { allZeroMachineState | cpuState = CpuState 0 0 0xFF 0 0 0 0 0 0 allFalseConditionCodes False 0 }

                        expectedMachineStateDiff2 =
                            Events
                                [ SetCpu (SetRegisterB 1)
                                , SetCpu (SetRegisterC 0)
                                , SetCpu (SetPC 1)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff2 (MachineInstructions.inx_b machineState)
            ]
        , describe "0x05 - dcr_b"
            [ test "for zero machine state" <|
                \() ->
                    let
                        expectedMachineStateDiff =
                            Events
                                [ SetCpu (SetRegisterB 0xFF)
                                , SetCpu (SetFlag (SetFlagZ False))
                                , SetCpu (SetFlag (SetFlagS True))
                                , SetCpu (SetFlag (SetFlagP False))
                                , SetCpu (SetPC 1)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.dcr_b allZeroMachineState)
            ]
        ]



--
