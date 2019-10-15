module InstructionTests exposing (..)

import CpuState exposing (CpuState)
import Expect
import Instruction exposing (Instruction)
import OpCode exposing (MachineState(..), OpCode, OpCodeLength, OpCodeMetaData)
import Test exposing (..)


all : Test
all =
    describe "Instruction"
        [ describe "instructionToString"
            [ test "for NOP" <|
                \() ->
                    Instruction 1
                        (OpCode 0x00 (OpCodeMetaData "NOP" OpCode.OneByte (\s -> CpuState)))
                        []
                        |> Instruction.instructionToString
                        |> Expect.equal "00001:          -- NOP"
            ]
        ]
