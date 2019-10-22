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
                                [ SetMemory 0x0203 0x01
                                , SetCpu (SetPC 0x01)
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
                                [ SetCpu (SetRegisterC 0x01)
                                , SetCpu (SetPC 0x01)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff1 (MachineInstructions.inx_b allZeroMachineState)
            , test "for c=0xFF machine state" <|
                \() ->
                    let
                        c =
                            0xFF

                        machineState =
                            { allZeroMachineState | cpuState = CpuState 0 0 c 0 0 0 0 0 0 allFalseConditionCodes False 0 }

                        expectedMachineStateDiff2 =
                            Events
                                [ SetCpu (SetRegisterB 0x01)
                                , SetCpu (SetRegisterC 0x00)
                                , SetCpu (SetPC 0x01)
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
                                , SetCpu (SetPC 0x01)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.dcr_b allZeroMachineState)
            , test "for b=0x01 machine state" <|
                \() ->
                    let
                        b =
                            0x01

                        machineState =
                            { allZeroMachineState | cpuState = CpuState 0 b 0 0 0 0 0 0 0 allFalseConditionCodes False 0 }

                        expectedMachineStateDiff =
                            Events
                                [ SetCpu (SetRegisterB 0)
                                , SetCpu (SetFlag (SetFlagZ True))
                                , SetCpu (SetFlag (SetFlagS False))
                                , SetCpu (SetFlag (SetFlagP True))
                                , SetCpu (SetPC 0x01)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.dcr_b machineState)
            ]
        , describe "0x06 - mvi_b_d8"
            [ test "for zero machine state" <|
                \() ->
                    let
                        expectedMachineStateDiff =
                            Events
                                [ SetCpu (SetRegisterB 0x0D)
                                , SetCpu (SetPC 0x02)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.mvi_b_d8 0x0D allZeroMachineState)
            ]
        , describe "0x09 - dad_b"
            [ test "for b=0x01, c=0x02, h=0x03, l=0x04 machine state" <|
                \() ->
                    let
                        b =
                            0x01

                        c =
                            0x02

                        h =
                            0x03

                        l =
                            0x04

                        machineState =
                            { allZeroMachineState | cpuState = CpuState 0 b c 0 0 h l 0 0 allFalseConditionCodes False 0 }

                        expectedMachineStateDiff =
                            Events
                                [ SetCpu (SetRegisterH 0x04)
                                , SetCpu (SetRegisterL 0x06)
                                , SetCpu (SetFlag (SetFlagCY False))
                                , SetCpu (SetPC 0x01)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.dad_b machineState)
            ]
        , describe "0x0d - dcr_c"
            [ test "for zero machine state" <|
                \() ->
                    let
                        expectedMachineStateDiff =
                            Events
                                [ SetCpu (SetRegisterC 0xFF)
                                , SetCpu (SetFlag (SetFlagZ False))
                                , SetCpu (SetFlag (SetFlagS True))
                                , SetCpu (SetFlag (SetFlagP False))
                                , SetCpu (SetPC 0x01)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.dcr_c allZeroMachineState)
            , test "for c=0x01 machine state" <|
                \() ->
                    let
                        c =
                            0x01

                        machineState =
                            { allZeroMachineState | cpuState = CpuState 0 0 c 0 0 0 0 0 0 allFalseConditionCodes False 0 }

                        expectedMachineStateDiff =
                            Events
                                [ SetCpu (SetRegisterC 0)
                                , SetCpu (SetFlag (SetFlagZ True))
                                , SetCpu (SetFlag (SetFlagS False))
                                , SetCpu (SetFlag (SetFlagP True))
                                , SetCpu (SetPC 0x01)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.dcr_c machineState)
            ]
        , describe "0x0e - mvi_c_d8"
            [ test "for zero machine state" <|
                \() ->
                    let
                        expectedMachineStateDiff =
                            Events
                                [ SetCpu (SetRegisterC 0x0D)
                                , SetCpu (SetPC 0x02)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.mvi_c_d8 0x0D allZeroMachineState)
            ]
        , describe "0x0f - rrc"
            [ test "for a=0x01 machine state" <|
                \() ->
                    let
                        a =
                            0x01

                        machineState =
                            { allZeroMachineState | cpuState = CpuState a 0 0 0 0 0 0 0 0 allFalseConditionCodes False 0 }

                        expectedMachineStateDiff =
                            Events
                                [ SetCpu (SetRegisterA 0x80)
                                , SetCpu (SetFlag (SetFlagCY True))
                                , SetCpu (SetPC 1)
                                ]
                    in
                    Expect.equal expectedMachineStateDiff (MachineInstructions.rrc machineState)
            ]
        ]
