module InstructionTests exposing (..)

import MachineState exposing (CpuState, MachineStateDiff(..))
import Expect
import Instruction exposing (Instruction)
import OpCode exposing (ImplOneByte, OpCode, OpCodeData, OpCodeSpec)
import Test exposing (..)


all : Test
all =
    describe "Instruction"
        [ describe "instructionToString"
            [ test "for NOP" <|
                \() ->
                    let
                      opCodeSpec = OpCode.OneByte (\cpuState -> Failed (Just cpuState) "not implemented yet")
                      opCodeMetadata = OpCodeData "NOP" opCodeSpec
                      opCode = OpCode 0x00 opCodeMetadata
                    in
                    Instruction 1
                        opCode
                        []
                        |> Instruction.instructionToString
                        |> Expect.equal "0x0001:                -- NOP"
            ]
        ]
