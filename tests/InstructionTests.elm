module InstructionTests exposing (..)

import MachineState exposing (CpuState, MachineStateDiff(..))
import Expect
import Instruction exposing (Instruction)
import OpCode exposing (ImplOneByte, OpCode, OpCodeMetaData, OpCodeType)
import Test exposing (..)


all : Test
all =
    describe "Instruction"
        [ describe "instructionToString"
            [ test "for NOP" <|
                \() ->
                    let
                      opCodeType = OpCode.OneByte (\cpuState -> Failed (Just cpuState) "not implemented yet")
                      opCodeMetadata = OpCodeMetaData "NOP" opCodeType
                      opCode = OpCode 0x00 opCodeMetadata
                    in
                    Instruction 1
                        opCode
                        []
                        |> Instruction.instructionToString
                        |> Expect.equal "00001:          -- NOP"
            ]
        ]
