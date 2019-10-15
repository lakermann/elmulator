module InstructionTests exposing (..)

import MachineState exposing (CpuState, MachineStateDiff(..))
import Expect
import Instruction exposing (Instruction)
import OpCode exposing (OpCode, OpCodeLength, OpCodeMetaData)
import Test exposing (..)


all : Test
all =
    describe "Instruction"
        [ describe "instructionToString"
            [ test "for NOP" <|
                \() ->
                    Instruction 1
                        (OpCode 0x00 (OpCodeMetaData "NOP" OpCode.OneByte (\cpuState -> Failed (Just cpuState) "not implemented yet")))
                        []
                        |> Instruction.instructionToString
                        |> Expect.equal "00001:          -- NOP"
            ]
        ]
