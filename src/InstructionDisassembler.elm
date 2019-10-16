module InstructionDisassembler exposing (..)

import Instruction exposing (Instruction)
import MachineState exposing (ByteValue)
import OpCode exposing (OpCode, getOpCodeLength)
import OpCodeTable exposing (getOpCodeFromTable)


type alias DisassemblyState =
    { currentPosition : Int
    , remainingBytes : List ByteValue
    , disassembledInstructions : List Instruction
    }


disassembleToInstructions : List ByteValue -> List Instruction
disassembleToInstructions byteCodes =
    (disassembleToInstructionsRec (DisassemblyState 0 byteCodes [])).disassembledInstructions


disassembleToInstructionsRec : DisassemblyState -> DisassemblyState
disassembleToInstructionsRec state =
    let
        disassembledInstruction =
            disassembleOneInstruction state
    in
    case disassembledInstruction of
        Nothing ->
            state

        Just newState ->
            disassembleToInstructionsRec newState


disassembleOneInstruction : DisassemblyState -> Maybe DisassemblyState
disassembleOneInstruction state =
    case state.remainingBytes of
        [] ->
            Nothing

        _ ->
            List.head state.remainingBytes
                |> Maybe.andThen getOpCodeFromTable
                |> Maybe.map (\opCode -> applyOpCodeToDisassemblyState opCode state)


applyOpCodeToDisassemblyState : OpCode -> DisassemblyState -> DisassemblyState
applyOpCodeToDisassemblyState opCode { currentPosition, remainingBytes, disassembledInstructions } =
    let
        length =
            getOpCodeLength opCode

        newPosition =
            currentPosition + length

        newRemainingBytes =
            List.drop length remainingBytes

        instructionBytes =
            List.take length remainingBytes

        currentInstruction =
            Instruction currentPosition opCode instructionBytes
    in
    DisassemblyState newPosition newRemainingBytes (disassembledInstructions ++ [ currentInstruction ])
