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
        address = String.padLeft 5 '0' (String.fromInt instruction.address)
        payloadHex = List.map (\x -> String.padLeft 2 '0' x) (List.map Hex.toString instruction.payload)
        payload = String.padLeft 8 ' ' (String.join " " payloadHex)
        instructionName = OpCode.getName instruction.opCode
    in
    address ++ ": " ++ payload ++ " -- " ++ instructionName
