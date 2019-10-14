module Instruction exposing (DisassembledProgram, Instruction, instructionToString)

import OpCode exposing (OpCode)


type alias Instruction =
    { address : Int
    , opCode : OpCode
    , payload : List Int
    }


type alias DisassembledProgram =
    List Instruction


instructionToString : Instruction -> String
instructionToString instruction =
    instruction.opCode.information.name
