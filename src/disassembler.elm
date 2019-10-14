module Disassembler exposing (main)

import Browser
import Bytes exposing (Bytes)
import Bytes.Decode as Decode
import Dict exposing (Dict)
import File exposing (File)
import File.Select as Select
import Html exposing (Html, button, p, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Task



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { data : Maybe Bytes
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model Nothing, Cmd.none )



-- UPDATE


type Msg
    = RomRequested
    | RomSelected File
    | RomLoaded Bytes


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RomRequested ->
            ( model
            , Select.file [ "application/any" ] RomSelected
            )

        RomSelected file ->
            ( model
            , Task.perform RomLoaded (File.toBytes file)
            )

        RomLoaded content ->
            ( { model | data = Just content }
            , Cmd.none
            )



-- VIEW


type OpCodeLength
    = OneByte
    | TwoBytes
    | ThreeBytes


getOpCodeLength : OpCodeLength -> Int
getOpCodeLength opCodeLength =
    case opCodeLength of
        OneByte ->
            1

        TwoBytes ->
            2

        ThreeBytes ->
            3


type alias OpCodeMetaInformation =
    { name : String
    , length : OpCodeLength
    }


type alias OpCodeType =
    { hexCode : Int
    , information : OpCodeMetaInformation
    }


opCodeTable : Dict Int OpCodeMetaInformation
opCodeTable =
    Dict.fromList
        [ ( 0x00, OpCodeMetaInformation "NOP" OneByte )
        , ( 0x01, OpCodeMetaInformation "LXI B,D16" ThreeBytes )
        , ( 0x02, OpCodeMetaInformation "STAX B" OneByte )
        , ( 0x03, OpCodeMetaInformation "INX B" OneByte )
        , ( 0x04, OpCodeMetaInformation "INR B" OneByte )
        , ( 0x05, OpCodeMetaInformation "DCR B" OneByte )
        , ( 0x06, OpCodeMetaInformation "MVI B, D8" TwoBytes )
        , ( 0x07, OpCodeMetaInformation "RLC" OneByte )
        , --(0x08, OpCodeMetaInformation "-" 0),
          ( 0x09, OpCodeMetaInformation "DAD B" OneByte )
        , ( 0x0A, OpCodeMetaInformation "LDAX B" OneByte )
        , ( 0x0B, OpCodeMetaInformation "DCX B" OneByte )
        , ( 0x0C, OpCodeMetaInformation "INR C" OneByte )
        , ( 0x0D, OpCodeMetaInformation "DCR C" OneByte )
        , ( 0x0E, OpCodeMetaInformation "MVI C,D8" TwoBytes )
        , ( 0x0F, OpCodeMetaInformation "RRC" OneByte )
        , --(0x10, OpCodeMetaInformation "-" 0),
          ( 0x11, OpCodeMetaInformation "LXI D,D16" ThreeBytes )
        , ( 0x12, OpCodeMetaInformation "STAX D" OneByte )
        , ( 0x13, OpCodeMetaInformation "INX D" OneByte )
        , ( 0x14, OpCodeMetaInformation "INR D" OneByte )
        , ( 0x15, OpCodeMetaInformation "DCR D" OneByte )
        , ( 0x16, OpCodeMetaInformation "MVI D, D8" TwoBytes )
        , ( 0x17, OpCodeMetaInformation "RAL" OneByte )
        , --(0x18, OpCodeMetaInformation "-" 0),
          ( 0x19, OpCodeMetaInformation "DAD D" OneByte )
        , ( 0x1A, OpCodeMetaInformation "LDAX D" OneByte )
        , ( 0x1B, OpCodeMetaInformation "DCX D" OneByte )
        , ( 0x1C, OpCodeMetaInformation "INR E" OneByte )
        , ( 0x1D, OpCodeMetaInformation "DCR E" OneByte )
        , ( 0x1E, OpCodeMetaInformation "MVI E,D8" TwoBytes )
        , ( 0x1F, OpCodeMetaInformation "RAR" OneByte )
        , ( 0x20, OpCodeMetaInformation "RIM" OneByte )
        , ( 0x21, OpCodeMetaInformation "LXI H,D16" ThreeBytes )
        , ( 0x22, OpCodeMetaInformation "SHLD adr" ThreeBytes )
        , ( 0x23, OpCodeMetaInformation "INX H" OneByte )
        , ( 0x24, OpCodeMetaInformation "INR H" OneByte )
        , ( 0x25, OpCodeMetaInformation "DCR H" OneByte )
        , ( 0x26, OpCodeMetaInformation "MVI H,D8" TwoBytes )
        , ( 0x27, OpCodeMetaInformation "DAA" OneByte )
        , --(0x28, OpCodeMetaInformation "-" 0),
          ( 0x29, OpCodeMetaInformation "DAD H" OneByte )
        , ( 0x2A, OpCodeMetaInformation "LHLD adr" ThreeBytes )
        , ( 0x2B, OpCodeMetaInformation "DCX H" OneByte )
        , ( 0x2C, OpCodeMetaInformation "INR L" OneByte )
        , ( 0x2D, OpCodeMetaInformation "DCR L" OneByte )
        , ( 0x2E, OpCodeMetaInformation "MVI L, D8" TwoBytes )
        , ( 0x2F, OpCodeMetaInformation "CMA" OneByte )
        , ( 0x30, OpCodeMetaInformation "SIM" OneByte )
        , ( 0x31, OpCodeMetaInformation "LXI SP, D16" ThreeBytes )
        , ( 0x32, OpCodeMetaInformation "STA adr" ThreeBytes )
        , ( 0x33, OpCodeMetaInformation "INX SP" OneByte )
        , ( 0x34, OpCodeMetaInformation "INR M" OneByte )
        , ( 0x35, OpCodeMetaInformation "DCR M" OneByte )
        , ( 0x36, OpCodeMetaInformation "MVI M,D8" TwoBytes )
        , ( 0x37, OpCodeMetaInformation "STC" OneByte )
        , --(0x38, OpCodeMetaInformation "-" 0),
          ( 0x39, OpCodeMetaInformation "DAD SP" OneByte )
        , ( 0x3A, OpCodeMetaInformation "LDA adr" ThreeBytes )
        , ( 0x3B, OpCodeMetaInformation "DCX SP" OneByte )
        , ( 0x3C, OpCodeMetaInformation "INR A" OneByte )
        , ( 0x3D, OpCodeMetaInformation "DCR A" OneByte )
        , ( 0x3E, OpCodeMetaInformation "MVI A,D8" TwoBytes )
        , ( 0x3F, OpCodeMetaInformation "CMC" OneByte )
        , ( 0x40, OpCodeMetaInformation "MOV B,B" OneByte )
        , ( 0x41, OpCodeMetaInformation "MOV B,C" OneByte )
        , ( 0x42, OpCodeMetaInformation "MOV B,D" OneByte )
        , ( 0x43, OpCodeMetaInformation "MOV B,E" OneByte )
        , ( 0x44, OpCodeMetaInformation "MOV B,H" OneByte )
        , ( 0x45, OpCodeMetaInformation "MOV B,L" OneByte )
        , ( 0x46, OpCodeMetaInformation "MOV B,M" OneByte )
        , ( 0x47, OpCodeMetaInformation "MOV B,A" OneByte )
        , ( 0x48, OpCodeMetaInformation "MOV C,B" OneByte )
        , ( 0x49, OpCodeMetaInformation "MOV C,C" OneByte )
        , ( 0x4A, OpCodeMetaInformation "MOV C,D" OneByte )
        , ( 0x4B, OpCodeMetaInformation "MOV C,E" OneByte )
        , ( 0x4C, OpCodeMetaInformation "MOV C,H" OneByte )
        , ( 0x4D, OpCodeMetaInformation "MOV C,L" OneByte )
        , ( 0x4E, OpCodeMetaInformation "MOV C,M" OneByte )
        , ( 0x4F, OpCodeMetaInformation "MOV C,A" OneByte )
        , ( 0x50, OpCodeMetaInformation "MOV D,B" OneByte )
        , ( 0x51, OpCodeMetaInformation "MOV D,C" OneByte )
        , ( 0x52, OpCodeMetaInformation "MOV D,D" OneByte )
        , ( 0x53, OpCodeMetaInformation "MOV D,E" OneByte )
        , ( 0x54, OpCodeMetaInformation "MOV D,H" OneByte )
        , ( 0x55, OpCodeMetaInformation "MOV D,L" OneByte )
        , ( 0x56, OpCodeMetaInformation "MOV D,M" OneByte )
        , ( 0x57, OpCodeMetaInformation "MOV D,A" OneByte )
        , ( 0x58, OpCodeMetaInformation "MOV E,B" OneByte )
        , ( 0x59, OpCodeMetaInformation "MOV E,C" OneByte )
        , ( 0x5A, OpCodeMetaInformation "MOV E,D" OneByte )
        , ( 0x5B, OpCodeMetaInformation "MOV E,E" OneByte )
        , ( 0x5C, OpCodeMetaInformation "MOV E,H" OneByte )
        , ( 0x5D, OpCodeMetaInformation "MOV E,L" OneByte )
        , ( 0x5E, OpCodeMetaInformation "MOV E,M" OneByte )
        , ( 0x5F, OpCodeMetaInformation "MOV E,A" OneByte )
        , ( 0x60, OpCodeMetaInformation "MOV H,B" OneByte )
        , ( 0x61, OpCodeMetaInformation "MOV H,C" OneByte )
        , ( 0x62, OpCodeMetaInformation "MOV H,D" OneByte )
        , ( 0x63, OpCodeMetaInformation "MOV H,E" OneByte )
        , ( 0x64, OpCodeMetaInformation "MOV H,H" OneByte )
        , ( 0x65, OpCodeMetaInformation "MOV H,L" OneByte )
        , ( 0x66, OpCodeMetaInformation "MOV H,M" OneByte )
        , ( 0x67, OpCodeMetaInformation "MOV H,A" OneByte )
        , ( 0x68, OpCodeMetaInformation "MOV L,B" OneByte )
        , ( 0x69, OpCodeMetaInformation "MOV L,C" OneByte )
        , ( 0x6A, OpCodeMetaInformation "MOV L,D" OneByte )
        , ( 0x6B, OpCodeMetaInformation "MOV L,E" OneByte )
        , ( 0x6C, OpCodeMetaInformation "MOV L,H" OneByte )
        , ( 0x6D, OpCodeMetaInformation "MOV L,L" OneByte )
        , ( 0x6E, OpCodeMetaInformation "MOV L,M" OneByte )
        , ( 0x6F, OpCodeMetaInformation "MOV L,A" OneByte )
        , ( 0x70, OpCodeMetaInformation "MOV M,B" OneByte )
        , ( 0x71, OpCodeMetaInformation "MOV M,C" OneByte )
        , ( 0x72, OpCodeMetaInformation "MOV M,D" OneByte )
        , ( 0x73, OpCodeMetaInformation "MOV M,E" OneByte )
        , ( 0x74, OpCodeMetaInformation "MOV M,H" OneByte )
        , ( 0x75, OpCodeMetaInformation "MOV M,L" OneByte )
        , ( 0x76, OpCodeMetaInformation "HLT" OneByte )
        , ( 0x77, OpCodeMetaInformation "MOV M,A" OneByte )
        , ( 0x78, OpCodeMetaInformation "MOV A,B" OneByte )
        , ( 0x79, OpCodeMetaInformation "MOV A,C" OneByte )
        , ( 0x7A, OpCodeMetaInformation "MOV A,D" OneByte )
        , ( 0x7B, OpCodeMetaInformation "MOV A,E" OneByte )
        , ( 0x7C, OpCodeMetaInformation "MOV A,H" OneByte )
        , ( 0x7D, OpCodeMetaInformation "MOV A,L" OneByte )
        , ( 0x7E, OpCodeMetaInformation "MOV A,M" OneByte )
        , ( 0x7F, OpCodeMetaInformation "MOV A,A" OneByte )
        , ( 0x80, OpCodeMetaInformation "ADD B" OneByte )
        , ( 0x81, OpCodeMetaInformation "ADD C" OneByte )
        , ( 0x82, OpCodeMetaInformation "ADD D" OneByte )
        , ( 0x83, OpCodeMetaInformation "ADD E" OneByte )
        , ( 0x84, OpCodeMetaInformation "ADD H" OneByte )
        , ( 0x85, OpCodeMetaInformation "ADD L" OneByte )
        , ( 0x86, OpCodeMetaInformation "ADD M" OneByte )
        , ( 0x87, OpCodeMetaInformation "ADD A" OneByte )
        , ( 0x88, OpCodeMetaInformation "ADC B" OneByte )
        , ( 0x89, OpCodeMetaInformation "ADC C" OneByte )
        , ( 0x8A, OpCodeMetaInformation "ADC D" OneByte )
        , ( 0x8B, OpCodeMetaInformation "ADC E" OneByte )
        , ( 0x8C, OpCodeMetaInformation "ADC H" OneByte )
        , ( 0x8D, OpCodeMetaInformation "ADC L" OneByte )
        , ( 0x8E, OpCodeMetaInformation "ADC M" OneByte )
        , ( 0x8F, OpCodeMetaInformation "ADC A" OneByte )
        , ( 0x90, OpCodeMetaInformation "SUB B" OneByte )
        , ( 0x91, OpCodeMetaInformation "SUB C" OneByte )
        , ( 0x92, OpCodeMetaInformation "SUB D" OneByte )
        , ( 0x93, OpCodeMetaInformation "SUB E" OneByte )
        , ( 0x94, OpCodeMetaInformation "SUB H" OneByte )
        , ( 0x95, OpCodeMetaInformation "SUB L" OneByte )
        , ( 0x96, OpCodeMetaInformation "SUB M" OneByte )
        , ( 0x97, OpCodeMetaInformation "SUB A" OneByte )
        , ( 0x98, OpCodeMetaInformation "SBB B" OneByte )
        , ( 0x99, OpCodeMetaInformation "SBB C" OneByte )
        , ( 0x9A, OpCodeMetaInformation "SBB D" OneByte )
        , ( 0x9B, OpCodeMetaInformation "SBB E" OneByte )
        , ( 0x9C, OpCodeMetaInformation "SBB H" OneByte )
        , ( 0x9D, OpCodeMetaInformation "SBB L" OneByte )
        , ( 0x9E, OpCodeMetaInformation "SBB M" OneByte )
        , ( 0x9F, OpCodeMetaInformation "SBB A" OneByte )
        , ( 0xA0, OpCodeMetaInformation "ANA B" OneByte )
        , ( 0xA1, OpCodeMetaInformation "ANA C" OneByte )
        , ( 0xA2, OpCodeMetaInformation "ANA D" OneByte )
        , ( 0xA3, OpCodeMetaInformation "ANA E" OneByte )
        , ( 0xA4, OpCodeMetaInformation "ANA H" OneByte )
        , ( 0xA5, OpCodeMetaInformation "ANA L" OneByte )
        , ( 0xA6, OpCodeMetaInformation "ANA M" OneByte )
        , ( 0xA7, OpCodeMetaInformation "ANA A" OneByte )
        , ( 0xA8, OpCodeMetaInformation "XRA B" OneByte )
        , ( 0xA9, OpCodeMetaInformation "XRA C" OneByte )
        , ( 0xAA, OpCodeMetaInformation "XRA D" OneByte )
        , ( 0xAB, OpCodeMetaInformation "XRA E" OneByte )
        , ( 0xAC, OpCodeMetaInformation "XRA H" OneByte )
        , ( 0xAD, OpCodeMetaInformation "XRA L" OneByte )
        , ( 0xAE, OpCodeMetaInformation "XRA M" OneByte )
        , ( 0xAF, OpCodeMetaInformation "XRA A" OneByte )
        , ( 0xB0, OpCodeMetaInformation "ORA B" OneByte )
        , ( 0xB1, OpCodeMetaInformation "ORA C" OneByte )
        , ( 0xB2, OpCodeMetaInformation "ORA D" OneByte )
        , ( 0xB3, OpCodeMetaInformation "ORA E" OneByte )
        , ( 0xB4, OpCodeMetaInformation "ORA H" OneByte )
        , ( 0xB5, OpCodeMetaInformation "ORA L" OneByte )
        , ( 0xB6, OpCodeMetaInformation "ORA M" OneByte )
        , ( 0xB7, OpCodeMetaInformation "ORA A" OneByte )
        , ( 0xB8, OpCodeMetaInformation "CMP B" OneByte )
        , ( 0xB9, OpCodeMetaInformation "CMP C" OneByte )
        , ( 0xBA, OpCodeMetaInformation "CMP D" OneByte )
        , ( 0xBB, OpCodeMetaInformation "CMP E" OneByte )
        , ( 0xBC, OpCodeMetaInformation "CMP H" OneByte )
        , ( 0xBD, OpCodeMetaInformation "CMP L" OneByte )
        , ( 0xBE, OpCodeMetaInformation "CMP M" OneByte )
        , ( 0xBF, OpCodeMetaInformation "CMP A" OneByte )
        , ( 0xC0, OpCodeMetaInformation "RNZ" OneByte )
        , ( 0xC1, OpCodeMetaInformation "POP B" OneByte )
        , ( 0xC2, OpCodeMetaInformation "JNZ adr" ThreeBytes )
        , ( 0xC3, OpCodeMetaInformation "JMP adr" ThreeBytes )
        , ( 0xC4, OpCodeMetaInformation "CNZ adr" ThreeBytes )
        , ( 0xC5, OpCodeMetaInformation "PUSH B" OneByte )
        , ( 0xC6, OpCodeMetaInformation "ADI D8" TwoBytes )
        , ( 0xC7, OpCodeMetaInformation "RST 0" OneByte )
        , ( 0xC8, OpCodeMetaInformation "RZ" OneByte )
        , ( 0xC9, OpCodeMetaInformation "RET" OneByte )
        , ( 0xCA, OpCodeMetaInformation "JZ adr" ThreeBytes )
        , --(0xcb, OpCodeMetaInformation "-" 0),
          ( 0xCC, OpCodeMetaInformation "CZ adr" ThreeBytes )
        , ( 0xCD, OpCodeMetaInformation "CALL adr" ThreeBytes )
        , ( 0xCE, OpCodeMetaInformation "ACI D8" TwoBytes )
        , ( 0xCF, OpCodeMetaInformation "RST 1" OneByte )
        , ( 0xD0, OpCodeMetaInformation "RNC" OneByte )
        , ( 0xD1, OpCodeMetaInformation "POP D" OneByte )
        , ( 0xD2, OpCodeMetaInformation "JNC adr" ThreeBytes )
        , ( 0xD3, OpCodeMetaInformation "OUT D8" TwoBytes )
        , ( 0xD4, OpCodeMetaInformation "CNC adr" ThreeBytes )
        , ( 0xD5, OpCodeMetaInformation "PUSH D" OneByte )
        , ( 0xD6, OpCodeMetaInformation "SUI D8" TwoBytes )
        , ( 0xD7, OpCodeMetaInformation "RST 2" OneByte )
        , ( 0xD8, OpCodeMetaInformation "RC" OneByte )
        , --(0xd9, OpCodeMetaInformation "-" 0),
          ( 0xDA, OpCodeMetaInformation "JC adr" ThreeBytes )
        , ( 0xDB, OpCodeMetaInformation "IN D8" TwoBytes )
        , ( 0xDC, OpCodeMetaInformation "CC adr" ThreeBytes )
        , --(0xdd, OpCodeMetaInformation "-" 0),
          ( 0xDE, OpCodeMetaInformation "SBI D8" TwoBytes )
        , ( 0xDF, OpCodeMetaInformation "RST 3" OneByte )
        , ( 0xE0, OpCodeMetaInformation "RPO" OneByte )
        , ( 0xE1, OpCodeMetaInformation "POP H" OneByte )
        , ( 0xE2, OpCodeMetaInformation "JPO adr" ThreeBytes )
        , ( 0xE3, OpCodeMetaInformation "XTHL" OneByte )
        , ( 0xE4, OpCodeMetaInformation "CPO adr" ThreeBytes )
        , ( 0xE5, OpCodeMetaInformation "PUSH H" OneByte )
        , ( 0xE6, OpCodeMetaInformation "ANI D8" TwoBytes )
        , ( 0xE7, OpCodeMetaInformation "RST 4" OneByte )
        , ( 0xE8, OpCodeMetaInformation "RPE" OneByte )
        , ( 0xE9, OpCodeMetaInformation "PCHL" OneByte )
        , ( 0xEA, OpCodeMetaInformation "JPE adr" ThreeBytes )
        , ( 0xEB, OpCodeMetaInformation "XCHG" OneByte )
        , ( 0xEC, OpCodeMetaInformation "CPE adr" ThreeBytes )
        , --(0xed, OpCodeMetaInformation "-" 0),
          ( 0xEE, OpCodeMetaInformation "XRI D8" TwoBytes )
        , ( 0xEF, OpCodeMetaInformation "RST 5" OneByte )
        , ( 0xF0, OpCodeMetaInformation "RP" OneByte )
        , ( 0xF1, OpCodeMetaInformation "POP PSW" OneByte )
        , ( 0xF2, OpCodeMetaInformation "JP adr" ThreeBytes )
        , ( 0xF3, OpCodeMetaInformation "DI" OneByte )
        , ( 0xF4, OpCodeMetaInformation "CP adr" ThreeBytes )
        , ( 0xF5, OpCodeMetaInformation "PUSH PSW" OneByte )
        , ( 0xF6, OpCodeMetaInformation "ORI D8" TwoBytes )
        , ( 0xF7, OpCodeMetaInformation "RST 6" OneByte )
        , ( 0xF8, OpCodeMetaInformation "RM" OneByte )
        , ( 0xF9, OpCodeMetaInformation "SPHL" OneByte )
        , ( 0xFA, OpCodeMetaInformation "JM adr" ThreeBytes )
        , ( 0xFB, OpCodeMetaInformation "EI" OneByte )
        , ( 0xFC, OpCodeMetaInformation "CM adr" ThreeBytes )
        , --(0xfd, OpCodeMetaInformation "-" 0),
          ( 0xFE, OpCodeMetaInformation "CPI D8" TwoBytes )
        , ( 0xFF, OpCodeMetaInformation "RST 7" OneByte )
        ]


type alias InstructionType =
    { address : Int
    , opCode : OpCodeType
    , payload : List Int
    }


type alias DisassembledProgram =
    List InstructionType


decodeFile : Bytes -> List Int
decodeFile rawData =
    let
        listDecoder =
            bytesListDecoder Decode.unsignedInt8 (Bytes.width rawData)
    in
    Maybe.withDefault [] (Decode.decode listDecoder rawData)


bytesListDecoder : Decode.Decoder a -> Int -> Decode.Decoder (List a)
bytesListDecoder decoder len =
    Decode.loop ( len, [] ) (listStep decoder)


listStep : Decode.Decoder a -> ( Int, List a ) -> Decode.Decoder (Decode.Step ( Int, List a ) (List a))
listStep decoder ( n, xs ) =
    if n <= 0 then
        Decode.succeed (Decode.Done xs)

    else
        Decode.map (\x -> Decode.Loop ( n - 1, xs ++ [ x ] )) decoder


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
                |> Maybe.map (\opCodeType -> applyOpCodeToDisassemblyState opCodeType state)


applyOpCodeToDisassemblyState : OpCodeType -> DisassemblyState -> DisassemblyState
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


createInstruction : Int -> OpCodeType -> List Int -> InstructionType
createInstruction address opCode payload =
    InstructionType address opCode payload


getOpCodeFromTable : Int -> Maybe OpCodeType
getOpCodeFromTable opCodeByte =
    Dict.get opCodeByte opCodeTable
        |> Maybe.map (\metaInfo -> OpCodeType opCodeByte metaInfo)


instructionToString : InstructionType -> String
instructionToString instruction =
    instruction.opCode.information.name


disassemble : Bytes -> String
disassemble data =
    let
        decodedFile =
            decodeFile data

        disassembledFile =
            disassembleToInstructions decodedFile
    in
    String.join "\n" (List.map instructionToString disassembledFile)


view : Model -> Html Msg
view model =
    case model.data of
        Nothing ->
            button [ onClick RomRequested ] [ text "Load ROM" ]

        Just content ->
            p [ style "white-space" "pre" ] [ text (disassemble content) ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
