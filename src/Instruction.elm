module Instruction exposing (InstructionType, instructionToString)

import OpCode exposing (OpCode)


type alias InstructionType =
    { address : Int
    , opCode : OpCode
    , payload : List Int
    }


type alias DisassembledProgram =
    List InstructionType


instructionToString : InstructionType -> String
instructionToString instruction =
    instruction.opCode.information.name
