module Instruction exposing (DisassembledProgram, Instruction, instructionToString)

import Hex as Hex
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
    let
        address = Hex.pad4 instruction.address
        payloadHex = List.map Hex.pad2 instruction.payload
        payload = String.padLeft 14 ' ' (String.join " " payloadHex)
        instructionName = OpCode.getName instruction.opCode
    in
    address ++ ": " ++ payload ++ " -- " ++ instructionName
