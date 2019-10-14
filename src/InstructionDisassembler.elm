module InstructionDisassembler exposing (..)

import Instruction exposing (InstructionType)
import OpCode exposing (OpCode, getOpCodeFromTable, getOpCodeLength)


type alias DisassemblyState =
    { currentPosition : Int
    , remainingBytes : List Int
    , disassembledInstructions : List InstructionType
    }


disassembleToInstructions : List Int -> List InstructionType
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
            getOpCodeLength opCode.information.length

        newPosition =
            currentPosition + length

        newRemainingBytes =
            List.drop length remainingBytes

        instructionBytes =
            List.take length remainingBytes

        currentInstruction =
            createInstruction currentPosition opCode instructionBytes
    in
    DisassemblyState newPosition newRemainingBytes (disassembledInstructions ++ [ currentInstruction ])


createInstruction : Int -> OpCode -> List Int -> InstructionType
createInstruction address opCode payload =
    InstructionType address opCode payload