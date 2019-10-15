module OpCode exposing (OpCode, OpCodeLength(..), OpCodeMetaData, getOpCodeFromTable, getOpCodeLength)

import Dict exposing (Dict)


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


type alias OpCodeMetaData =
    { name : String
    , length : OpCodeLength
    }


type alias OpCode =
    { hexCode : Int
    , information : OpCodeMetaData
    }


opCodeTable : Dict Int OpCodeMetaData
opCodeTable =
    Dict.fromList
        [ ( 0x00, OpCodeMetaData "NOP" OneByte )
        , ( 0x01, OpCodeMetaData "LXI B,D16" ThreeBytes )
        , ( 0x02, OpCodeMetaData "STAX B" OneByte )
        , ( 0x03, OpCodeMetaData "INX B" OneByte )
        , ( 0x04, OpCodeMetaData "INR B" OneByte )
        , ( 0x05, OpCodeMetaData "DCR B" OneByte )
        , ( 0x06, OpCodeMetaData "MVI B, D8" TwoBytes )
        , ( 0x07, OpCodeMetaData "RLC" OneByte )
        , --(0x08, OpCodeMetaInformation "-" 0),
          ( 0x09, OpCodeMetaData "DAD B" OneByte )
        , ( 0x0A, OpCodeMetaData "LDAX B" OneByte )
        , ( 0x0B, OpCodeMetaData "DCX B" OneByte )
        , ( 0x0C, OpCodeMetaData "INR C" OneByte )
        , ( 0x0D, OpCodeMetaData "DCR C" OneByte )
        , ( 0x0E, OpCodeMetaData "MVI C,D8" TwoBytes )
        , ( 0x0F, OpCodeMetaData "RRC" OneByte )
        , --(0x10, OpCodeMetaInformation "-" 0),
          ( 0x11, OpCodeMetaData "LXI D,D16" ThreeBytes )
        , ( 0x12, OpCodeMetaData "STAX D" OneByte )
        , ( 0x13, OpCodeMetaData "INX D" OneByte )
        , ( 0x14, OpCodeMetaData "INR D" OneByte )
        , ( 0x15, OpCodeMetaData "DCR D" OneByte )
        , ( 0x16, OpCodeMetaData "MVI D, D8" TwoBytes )
        , ( 0x17, OpCodeMetaData "RAL" OneByte )
        , --(0x18, OpCodeMetaInformation "-" 0),
          ( 0x19, OpCodeMetaData "DAD D" OneByte )
        , ( 0x1A, OpCodeMetaData "LDAX D" OneByte )
        , ( 0x1B, OpCodeMetaData "DCX D" OneByte )
        , ( 0x1C, OpCodeMetaData "INR E" OneByte )
        , ( 0x1D, OpCodeMetaData "DCR E" OneByte )
        , ( 0x1E, OpCodeMetaData "MVI E,D8" TwoBytes )
        , ( 0x1F, OpCodeMetaData "RAR" OneByte )
        , ( 0x20, OpCodeMetaData "RIM" OneByte )
        , ( 0x21, OpCodeMetaData "LXI H,D16" ThreeBytes )
        , ( 0x22, OpCodeMetaData "SHLD adr" ThreeBytes )
        , ( 0x23, OpCodeMetaData "INX H" OneByte )
        , ( 0x24, OpCodeMetaData "INR H" OneByte )
        , ( 0x25, OpCodeMetaData "DCR H" OneByte )
        , ( 0x26, OpCodeMetaData "MVI H,D8" TwoBytes )
        , ( 0x27, OpCodeMetaData "DAA" OneByte )
        , --(0x28, OpCodeMetaInformation "-" 0),
          ( 0x29, OpCodeMetaData "DAD H" OneByte )
        , ( 0x2A, OpCodeMetaData "LHLD adr" ThreeBytes )
        , ( 0x2B, OpCodeMetaData "DCX H" OneByte )
        , ( 0x2C, OpCodeMetaData "INR L" OneByte )
        , ( 0x2D, OpCodeMetaData "DCR L" OneByte )
        , ( 0x2E, OpCodeMetaData "MVI L, D8" TwoBytes )
        , ( 0x2F, OpCodeMetaData "CMA" OneByte )
        , ( 0x30, OpCodeMetaData "SIM" OneByte )
        , ( 0x31, OpCodeMetaData "LXI SP, D16" ThreeBytes )
        , ( 0x32, OpCodeMetaData "STA adr" ThreeBytes )
        , ( 0x33, OpCodeMetaData "INX SP" OneByte )
        , ( 0x34, OpCodeMetaData "INR M" OneByte )
        , ( 0x35, OpCodeMetaData "DCR M" OneByte )
        , ( 0x36, OpCodeMetaData "MVI M,D8" TwoBytes )
        , ( 0x37, OpCodeMetaData "STC" OneByte )
        , --(0x38, OpCodeMetaInformation "-" 0),
          ( 0x39, OpCodeMetaData "DAD SP" OneByte )
        , ( 0x3A, OpCodeMetaData "LDA adr" ThreeBytes )
        , ( 0x3B, OpCodeMetaData "DCX SP" OneByte )
        , ( 0x3C, OpCodeMetaData "INR A" OneByte )
        , ( 0x3D, OpCodeMetaData "DCR A" OneByte )
        , ( 0x3E, OpCodeMetaData "MVI A,D8" TwoBytes )
        , ( 0x3F, OpCodeMetaData "CMC" OneByte )
        , ( 0x40, OpCodeMetaData "MOV B,B" OneByte )
        , ( 0x41, OpCodeMetaData "MOV B,C" OneByte )
        , ( 0x42, OpCodeMetaData "MOV B,D" OneByte )
        , ( 0x43, OpCodeMetaData "MOV B,E" OneByte )
        , ( 0x44, OpCodeMetaData "MOV B,H" OneByte )
        , ( 0x45, OpCodeMetaData "MOV B,L" OneByte )
        , ( 0x46, OpCodeMetaData "MOV B,M" OneByte )
        , ( 0x47, OpCodeMetaData "MOV B,A" OneByte )
        , ( 0x48, OpCodeMetaData "MOV C,B" OneByte )
        , ( 0x49, OpCodeMetaData "MOV C,C" OneByte )
        , ( 0x4A, OpCodeMetaData "MOV C,D" OneByte )
        , ( 0x4B, OpCodeMetaData "MOV C,E" OneByte )
        , ( 0x4C, OpCodeMetaData "MOV C,H" OneByte )
        , ( 0x4D, OpCodeMetaData "MOV C,L" OneByte )
        , ( 0x4E, OpCodeMetaData "MOV C,M" OneByte )
        , ( 0x4F, OpCodeMetaData "MOV C,A" OneByte )
        , ( 0x50, OpCodeMetaData "MOV D,B" OneByte )
        , ( 0x51, OpCodeMetaData "MOV D,C" OneByte )
        , ( 0x52, OpCodeMetaData "MOV D,D" OneByte )
        , ( 0x53, OpCodeMetaData "MOV D,E" OneByte )
        , ( 0x54, OpCodeMetaData "MOV D,H" OneByte )
        , ( 0x55, OpCodeMetaData "MOV D,L" OneByte )
        , ( 0x56, OpCodeMetaData "MOV D,M" OneByte )
        , ( 0x57, OpCodeMetaData "MOV D,A" OneByte )
        , ( 0x58, OpCodeMetaData "MOV E,B" OneByte )
        , ( 0x59, OpCodeMetaData "MOV E,C" OneByte )
        , ( 0x5A, OpCodeMetaData "MOV E,D" OneByte )
        , ( 0x5B, OpCodeMetaData "MOV E,E" OneByte )
        , ( 0x5C, OpCodeMetaData "MOV E,H" OneByte )
        , ( 0x5D, OpCodeMetaData "MOV E,L" OneByte )
        , ( 0x5E, OpCodeMetaData "MOV E,M" OneByte )
        , ( 0x5F, OpCodeMetaData "MOV E,A" OneByte )
        , ( 0x60, OpCodeMetaData "MOV H,B" OneByte )
        , ( 0x61, OpCodeMetaData "MOV H,C" OneByte )
        , ( 0x62, OpCodeMetaData "MOV H,D" OneByte )
        , ( 0x63, OpCodeMetaData "MOV H,E" OneByte )
        , ( 0x64, OpCodeMetaData "MOV H,H" OneByte )
        , ( 0x65, OpCodeMetaData "MOV H,L" OneByte )
        , ( 0x66, OpCodeMetaData "MOV H,M" OneByte )
        , ( 0x67, OpCodeMetaData "MOV H,A" OneByte )
        , ( 0x68, OpCodeMetaData "MOV L,B" OneByte )
        , ( 0x69, OpCodeMetaData "MOV L,C" OneByte )
        , ( 0x6A, OpCodeMetaData "MOV L,D" OneByte )
        , ( 0x6B, OpCodeMetaData "MOV L,E" OneByte )
        , ( 0x6C, OpCodeMetaData "MOV L,H" OneByte )
        , ( 0x6D, OpCodeMetaData "MOV L,L" OneByte )
        , ( 0x6E, OpCodeMetaData "MOV L,M" OneByte )
        , ( 0x6F, OpCodeMetaData "MOV L,A" OneByte )
        , ( 0x70, OpCodeMetaData "MOV M,B" OneByte )
        , ( 0x71, OpCodeMetaData "MOV M,C" OneByte )
        , ( 0x72, OpCodeMetaData "MOV M,D" OneByte )
        , ( 0x73, OpCodeMetaData "MOV M,E" OneByte )
        , ( 0x74, OpCodeMetaData "MOV M,H" OneByte )
        , ( 0x75, OpCodeMetaData "MOV M,L" OneByte )
        , ( 0x76, OpCodeMetaData "HLT" OneByte )
        , ( 0x77, OpCodeMetaData "MOV M,A" OneByte )
        , ( 0x78, OpCodeMetaData "MOV A,B" OneByte )
        , ( 0x79, OpCodeMetaData "MOV A,C" OneByte )
        , ( 0x7A, OpCodeMetaData "MOV A,D" OneByte )
        , ( 0x7B, OpCodeMetaData "MOV A,E" OneByte )
        , ( 0x7C, OpCodeMetaData "MOV A,H" OneByte )
        , ( 0x7D, OpCodeMetaData "MOV A,L" OneByte )
        , ( 0x7E, OpCodeMetaData "MOV A,M" OneByte )
        , ( 0x7F, OpCodeMetaData "MOV A,A" OneByte )
        , ( 0x80, OpCodeMetaData "ADD B" OneByte )
        , ( 0x81, OpCodeMetaData "ADD C" OneByte )
        , ( 0x82, OpCodeMetaData "ADD D" OneByte )
        , ( 0x83, OpCodeMetaData "ADD E" OneByte )
        , ( 0x84, OpCodeMetaData "ADD H" OneByte )
        , ( 0x85, OpCodeMetaData "ADD L" OneByte )
        , ( 0x86, OpCodeMetaData "ADD M" OneByte )
        , ( 0x87, OpCodeMetaData "ADD A" OneByte )
        , ( 0x88, OpCodeMetaData "ADC B" OneByte )
        , ( 0x89, OpCodeMetaData "ADC C" OneByte )
        , ( 0x8A, OpCodeMetaData "ADC D" OneByte )
        , ( 0x8B, OpCodeMetaData "ADC E" OneByte )
        , ( 0x8C, OpCodeMetaData "ADC H" OneByte )
        , ( 0x8D, OpCodeMetaData "ADC L" OneByte )
        , ( 0x8E, OpCodeMetaData "ADC M" OneByte )
        , ( 0x8F, OpCodeMetaData "ADC A" OneByte )
        , ( 0x90, OpCodeMetaData "SUB B" OneByte )
        , ( 0x91, OpCodeMetaData "SUB C" OneByte )
        , ( 0x92, OpCodeMetaData "SUB D" OneByte )
        , ( 0x93, OpCodeMetaData "SUB E" OneByte )
        , ( 0x94, OpCodeMetaData "SUB H" OneByte )
        , ( 0x95, OpCodeMetaData "SUB L" OneByte )
        , ( 0x96, OpCodeMetaData "SUB M" OneByte )
        , ( 0x97, OpCodeMetaData "SUB A" OneByte )
        , ( 0x98, OpCodeMetaData "SBB B" OneByte )
        , ( 0x99, OpCodeMetaData "SBB C" OneByte )
        , ( 0x9A, OpCodeMetaData "SBB D" OneByte )
        , ( 0x9B, OpCodeMetaData "SBB E" OneByte )
        , ( 0x9C, OpCodeMetaData "SBB H" OneByte )
        , ( 0x9D, OpCodeMetaData "SBB L" OneByte )
        , ( 0x9E, OpCodeMetaData "SBB M" OneByte )
        , ( 0x9F, OpCodeMetaData "SBB A" OneByte )
        , ( 0xA0, OpCodeMetaData "ANA B" OneByte )
        , ( 0xA1, OpCodeMetaData "ANA C" OneByte )
        , ( 0xA2, OpCodeMetaData "ANA D" OneByte )
        , ( 0xA3, OpCodeMetaData "ANA E" OneByte )
        , ( 0xA4, OpCodeMetaData "ANA H" OneByte )
        , ( 0xA5, OpCodeMetaData "ANA L" OneByte )
        , ( 0xA6, OpCodeMetaData "ANA M" OneByte )
        , ( 0xA7, OpCodeMetaData "ANA A" OneByte )
        , ( 0xA8, OpCodeMetaData "XRA B" OneByte )
        , ( 0xA9, OpCodeMetaData "XRA C" OneByte )
        , ( 0xAA, OpCodeMetaData "XRA D" OneByte )
        , ( 0xAB, OpCodeMetaData "XRA E" OneByte )
        , ( 0xAC, OpCodeMetaData "XRA H" OneByte )
        , ( 0xAD, OpCodeMetaData "XRA L" OneByte )
        , ( 0xAE, OpCodeMetaData "XRA M" OneByte )
        , ( 0xAF, OpCodeMetaData "XRA A" OneByte )
        , ( 0xB0, OpCodeMetaData "ORA B" OneByte )
        , ( 0xB1, OpCodeMetaData "ORA C" OneByte )
        , ( 0xB2, OpCodeMetaData "ORA D" OneByte )
        , ( 0xB3, OpCodeMetaData "ORA E" OneByte )
        , ( 0xB4, OpCodeMetaData "ORA H" OneByte )
        , ( 0xB5, OpCodeMetaData "ORA L" OneByte )
        , ( 0xB6, OpCodeMetaData "ORA M" OneByte )
        , ( 0xB7, OpCodeMetaData "ORA A" OneByte )
        , ( 0xB8, OpCodeMetaData "CMP B" OneByte )
        , ( 0xB9, OpCodeMetaData "CMP C" OneByte )
        , ( 0xBA, OpCodeMetaData "CMP D" OneByte )
        , ( 0xBB, OpCodeMetaData "CMP E" OneByte )
        , ( 0xBC, OpCodeMetaData "CMP H" OneByte )
        , ( 0xBD, OpCodeMetaData "CMP L" OneByte )
        , ( 0xBE, OpCodeMetaData "CMP M" OneByte )
        , ( 0xBF, OpCodeMetaData "CMP A" OneByte )
        , ( 0xC0, OpCodeMetaData "RNZ" OneByte )
        , ( 0xC1, OpCodeMetaData "POP B" OneByte )
        , ( 0xC2, OpCodeMetaData "JNZ adr" ThreeBytes )
        , ( 0xC3, OpCodeMetaData "JMP adr" ThreeBytes )
        , ( 0xC4, OpCodeMetaData "CNZ adr" ThreeBytes )
        , ( 0xC5, OpCodeMetaData "PUSH B" OneByte )
        , ( 0xC6, OpCodeMetaData "ADI D8" TwoBytes )
        , ( 0xC7, OpCodeMetaData "RST 0" OneByte )
        , ( 0xC8, OpCodeMetaData "RZ" OneByte )
        , ( 0xC9, OpCodeMetaData "RET" OneByte )
        , ( 0xCA, OpCodeMetaData "JZ adr" ThreeBytes )
        , --(0xcb, OpCodeMetaInformation "-" 0),
          ( 0xCC, OpCodeMetaData "CZ adr" ThreeBytes )
        , ( 0xCD, OpCodeMetaData "CALL adr" ThreeBytes )
        , ( 0xCE, OpCodeMetaData "ACI D8" TwoBytes )
        , ( 0xCF, OpCodeMetaData "RST 1" OneByte )
        , ( 0xD0, OpCodeMetaData "RNC" OneByte )
        , ( 0xD1, OpCodeMetaData "POP D" OneByte )
        , ( 0xD2, OpCodeMetaData "JNC adr" ThreeBytes )
        , ( 0xD3, OpCodeMetaData "OUT D8" TwoBytes )
        , ( 0xD4, OpCodeMetaData "CNC adr" ThreeBytes )
        , ( 0xD5, OpCodeMetaData "PUSH D" OneByte )
        , ( 0xD6, OpCodeMetaData "SUI D8" TwoBytes )
        , ( 0xD7, OpCodeMetaData "RST 2" OneByte )
        , ( 0xD8, OpCodeMetaData "RC" OneByte )
        , --(0xd9, OpCodeMetaInformation "-" 0),
          ( 0xDA, OpCodeMetaData "JC adr" ThreeBytes )
        , ( 0xDB, OpCodeMetaData "IN D8" TwoBytes )
        , ( 0xDC, OpCodeMetaData "CC adr" ThreeBytes )
        , --(0xdd, OpCodeMetaInformation "-" 0),
          ( 0xDE, OpCodeMetaData "SBI D8" TwoBytes )
        , ( 0xDF, OpCodeMetaData "RST 3" OneByte )
        , ( 0xE0, OpCodeMetaData "RPO" OneByte )
        , ( 0xE1, OpCodeMetaData "POP H" OneByte )
        , ( 0xE2, OpCodeMetaData "JPO adr" ThreeBytes )
        , ( 0xE3, OpCodeMetaData "XTHL" OneByte )
        , ( 0xE4, OpCodeMetaData "CPO adr" ThreeBytes )
        , ( 0xE5, OpCodeMetaData "PUSH H" OneByte )
        , ( 0xE6, OpCodeMetaData "ANI D8" TwoBytes )
        , ( 0xE7, OpCodeMetaData "RST 4" OneByte )
        , ( 0xE8, OpCodeMetaData "RPE" OneByte )
        , ( 0xE9, OpCodeMetaData "PCHL" OneByte )
        , ( 0xEA, OpCodeMetaData "JPE adr" ThreeBytes )
        , ( 0xEB, OpCodeMetaData "XCHG" OneByte )
        , ( 0xEC, OpCodeMetaData "CPE adr" ThreeBytes )
        , --(0xed, OpCodeMetaInformation "-" 0),
          ( 0xEE, OpCodeMetaData "XRI D8" TwoBytes )
        , ( 0xEF, OpCodeMetaData "RST 5" OneByte )
        , ( 0xF0, OpCodeMetaData "RP" OneByte )
        , ( 0xF1, OpCodeMetaData "POP PSW" OneByte )
        , ( 0xF2, OpCodeMetaData "JP adr" ThreeBytes )
        , ( 0xF3, OpCodeMetaData "DI" OneByte )
        , ( 0xF4, OpCodeMetaData "CP adr" ThreeBytes )
        , ( 0xF5, OpCodeMetaData "PUSH PSW" OneByte )
        , ( 0xF6, OpCodeMetaData "ORI D8" TwoBytes )
        , ( 0xF7, OpCodeMetaData "RST 6" OneByte )
        , ( 0xF8, OpCodeMetaData "RM" OneByte )
        , ( 0xF9, OpCodeMetaData "SPHL" OneByte )
        , ( 0xFA, OpCodeMetaData "JM adr" ThreeBytes )
        , ( 0xFB, OpCodeMetaData "EI" OneByte )
        , ( 0xFC, OpCodeMetaData "CM adr" ThreeBytes )
        , --(0xfd, OpCodeMetaInformation "-" 0),
          ( 0xFE, OpCodeMetaData "CPI D8" TwoBytes )
        , ( 0xFF, OpCodeMetaData "RST 7" OneByte )
        ]


getOpCodeFromTable : Int -> Maybe OpCode
getOpCodeFromTable opCodeByte =
    Dict.get opCodeByte opCodeTable
        |> Maybe.map (\metaInfo -> OpCode opCodeByte metaInfo)
