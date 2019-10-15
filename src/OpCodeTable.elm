module OpCodeTable exposing (getOpCodeFromTable)

import MachineState exposing (CpuState, MachineStateDiff(..))
import Dict exposing (Dict)
import OpCode exposing (OpCode, OpCodeType(..), OpCodeMetaData)

unimplementedInstructionZero : CpuState -> MachineStateDiff
unimplementedInstructionZero cpuState =
    Failed (Just cpuState) "not implemented yet, no args"
    
unimplementedInstructionOne : Int -> CpuState -> MachineStateDiff
unimplementedInstructionOne firstArg cpuState =
    Failed (Just cpuState) ("not implemented yet, first arg: " ++ (String.fromInt firstArg))

unimplementedInstructionTwo : Int -> Int -> CpuState -> MachineStateDiff
unimplementedInstructionTwo firstArg secondArg cpuState =
    Failed (Just cpuState) ("not implemented yet, first arg: " ++ (String.fromInt firstArg) ++ ", second arg: " ++ (String.fromInt secondArg) )

opCodeTable : Dict Int OpCodeMetaData
opCodeTable =
    Dict.fromList
        [ ( 0x00, OpCodeMetaData "NOP" (OneByte unimplementedInstructionZero) )
        , ( 0x01, OpCodeMetaData "LXI B,D16" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x02, OpCodeMetaData "STAX B" (OneByte unimplementedInstructionZero) )
        , ( 0x03, OpCodeMetaData "INX B" (OneByte unimplementedInstructionZero) )
        , ( 0x04, OpCodeMetaData "INR B" (OneByte unimplementedInstructionZero) )
        , ( 0x05, OpCodeMetaData "DCR B" (OneByte unimplementedInstructionZero) )
        , ( 0x06, OpCodeMetaData "MVI B, D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x07, OpCodeMetaData "RLC" (OneByte unimplementedInstructionZero) )
        , --(0x08, OpCodeMetaInformation "-" 0),
          ( 0x09, OpCodeMetaData "DAD B" (OneByte unimplementedInstructionZero) )
        , ( 0x0A, OpCodeMetaData "LDAX B" (OneByte unimplementedInstructionZero) )
        , ( 0x0B, OpCodeMetaData "DCX B" (OneByte unimplementedInstructionZero) )
        , ( 0x0C, OpCodeMetaData "INR C" (OneByte unimplementedInstructionZero) )
        , ( 0x0D, OpCodeMetaData "DCR C" (OneByte unimplementedInstructionZero) )
        , ( 0x0E, OpCodeMetaData "MVI C,D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x0F, OpCodeMetaData "RRC" (OneByte unimplementedInstructionZero) )
        , --(0x10, OpCodeMetaInformation "-" 0),
          ( 0x11, OpCodeMetaData "LXI D,D16" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x12, OpCodeMetaData "STAX D" (OneByte unimplementedInstructionZero) )
        , ( 0x13, OpCodeMetaData "INX D" (OneByte unimplementedInstructionZero) )
        , ( 0x14, OpCodeMetaData "INR D" (OneByte unimplementedInstructionZero) )
        , ( 0x15, OpCodeMetaData "DCR D" (OneByte unimplementedInstructionZero) )
        , ( 0x16, OpCodeMetaData "MVI D, D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x17, OpCodeMetaData "RAL" (OneByte unimplementedInstructionZero) )
        , --(0x18, OpCodeMetaInformation "-" 0),
          ( 0x19, OpCodeMetaData "DAD D" (OneByte unimplementedInstructionZero) )
        , ( 0x1A, OpCodeMetaData "LDAX D" (OneByte unimplementedInstructionZero) )
        , ( 0x1B, OpCodeMetaData "DCX D" (OneByte unimplementedInstructionZero) )
        , ( 0x1C, OpCodeMetaData "INR E" (OneByte unimplementedInstructionZero) )
        , ( 0x1D, OpCodeMetaData "DCR E" (OneByte unimplementedInstructionZero) )
        , ( 0x1E, OpCodeMetaData "MVI E,D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x1F, OpCodeMetaData "RAR" (OneByte unimplementedInstructionZero) )
        , ( 0x20, OpCodeMetaData "RIM" (OneByte unimplementedInstructionZero) )
        , ( 0x21, OpCodeMetaData "LXI H,D16" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x22, OpCodeMetaData "SHLD adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x23, OpCodeMetaData "INX H" (OneByte unimplementedInstructionZero) )
        , ( 0x24, OpCodeMetaData "INR H" (OneByte unimplementedInstructionZero) )
        , ( 0x25, OpCodeMetaData "DCR H" (OneByte unimplementedInstructionZero) )
        , ( 0x26, OpCodeMetaData "MVI H,D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x27, OpCodeMetaData "DAA" (OneByte unimplementedInstructionZero) )
        , --(0x28, OpCodeMetaInformation "-" 0),
          ( 0x29, OpCodeMetaData "DAD H" (OneByte unimplementedInstructionZero) )
        , ( 0x2A, OpCodeMetaData "LHLD adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x2B, OpCodeMetaData "DCX H" (OneByte unimplementedInstructionZero) )
        , ( 0x2C, OpCodeMetaData "INR L" (OneByte unimplementedInstructionZero) )
        , ( 0x2D, OpCodeMetaData "DCR L" (OneByte unimplementedInstructionZero) )
        , ( 0x2E, OpCodeMetaData "MVI L, D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x2F, OpCodeMetaData "CMA" (OneByte unimplementedInstructionZero) )
        , ( 0x30, OpCodeMetaData "SIM" (OneByte unimplementedInstructionZero) )
        , ( 0x31, OpCodeMetaData "LXI SP, D16" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x32, OpCodeMetaData "STA adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x33, OpCodeMetaData "INX SP" (OneByte unimplementedInstructionZero) )
        , ( 0x34, OpCodeMetaData "INR M" (OneByte unimplementedInstructionZero) )
        , ( 0x35, OpCodeMetaData "DCR M" (OneByte unimplementedInstructionZero) )
        , ( 0x36, OpCodeMetaData "MVI M,D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x37, OpCodeMetaData "STC" (OneByte unimplementedInstructionZero) )
        , --(0x38, OpCodeMetaInformation "-" 0),
          ( 0x39, OpCodeMetaData "DAD SP" (OneByte unimplementedInstructionZero) )
        , ( 0x3A, OpCodeMetaData "LDA adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x3B, OpCodeMetaData "DCX SP" (OneByte unimplementedInstructionZero) )
        , ( 0x3C, OpCodeMetaData "INR A" (OneByte unimplementedInstructionZero) )
        , ( 0x3D, OpCodeMetaData "DCR A" (OneByte unimplementedInstructionZero) )
        , ( 0x3E, OpCodeMetaData "MVI A,D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x3F, OpCodeMetaData "CMC" (OneByte unimplementedInstructionZero) )
        , ( 0x40, OpCodeMetaData "MOV B,B" (OneByte unimplementedInstructionZero) )
        , ( 0x41, OpCodeMetaData "MOV B,C" (OneByte unimplementedInstructionZero) )
        , ( 0x42, OpCodeMetaData "MOV B,D" (OneByte unimplementedInstructionZero) )
        , ( 0x43, OpCodeMetaData "MOV B,E" (OneByte unimplementedInstructionZero) )
        , ( 0x44, OpCodeMetaData "MOV B,H" (OneByte unimplementedInstructionZero) )
        , ( 0x45, OpCodeMetaData "MOV B,L" (OneByte unimplementedInstructionZero) )
        , ( 0x46, OpCodeMetaData "MOV B,M" (OneByte unimplementedInstructionZero) )
        , ( 0x47, OpCodeMetaData "MOV B,A" (OneByte unimplementedInstructionZero) )
        , ( 0x48, OpCodeMetaData "MOV C,B" (OneByte unimplementedInstructionZero) )
        , ( 0x49, OpCodeMetaData "MOV C,C" (OneByte unimplementedInstructionZero) )
        , ( 0x4A, OpCodeMetaData "MOV C,D" (OneByte unimplementedInstructionZero) )
        , ( 0x4B, OpCodeMetaData "MOV C,E" (OneByte unimplementedInstructionZero) )
        , ( 0x4C, OpCodeMetaData "MOV C,H" (OneByte unimplementedInstructionZero) )
        , ( 0x4D, OpCodeMetaData "MOV C,L" (OneByte unimplementedInstructionZero) )
        , ( 0x4E, OpCodeMetaData "MOV C,M" (OneByte unimplementedInstructionZero) )
        , ( 0x4F, OpCodeMetaData "MOV C,A" (OneByte unimplementedInstructionZero) )
        , ( 0x50, OpCodeMetaData "MOV D,B" (OneByte unimplementedInstructionZero) )
        , ( 0x51, OpCodeMetaData "MOV D,C" (OneByte unimplementedInstructionZero) )
        , ( 0x52, OpCodeMetaData "MOV D,D" (OneByte unimplementedInstructionZero) )
        , ( 0x53, OpCodeMetaData "MOV D,E" (OneByte unimplementedInstructionZero) )
        , ( 0x54, OpCodeMetaData "MOV D,H" (OneByte unimplementedInstructionZero) )
        , ( 0x55, OpCodeMetaData "MOV D,L" (OneByte unimplementedInstructionZero) )
        , ( 0x56, OpCodeMetaData "MOV D,M" (OneByte unimplementedInstructionZero) )
        , ( 0x57, OpCodeMetaData "MOV D,A" (OneByte unimplementedInstructionZero) )
        , ( 0x58, OpCodeMetaData "MOV E,B" (OneByte unimplementedInstructionZero) )
        , ( 0x59, OpCodeMetaData "MOV E,C" (OneByte unimplementedInstructionZero) )
        , ( 0x5A, OpCodeMetaData "MOV E,D" (OneByte unimplementedInstructionZero) )
        , ( 0x5B, OpCodeMetaData "MOV E,E" (OneByte unimplementedInstructionZero) )
        , ( 0x5C, OpCodeMetaData "MOV E,H" (OneByte unimplementedInstructionZero) )
        , ( 0x5D, OpCodeMetaData "MOV E,L" (OneByte unimplementedInstructionZero) )
        , ( 0x5E, OpCodeMetaData "MOV E,M" (OneByte unimplementedInstructionZero) )
        , ( 0x5F, OpCodeMetaData "MOV E,A" (OneByte unimplementedInstructionZero) )
        , ( 0x60, OpCodeMetaData "MOV H,B" (OneByte unimplementedInstructionZero) )
        , ( 0x61, OpCodeMetaData "MOV H,C" (OneByte unimplementedInstructionZero) )
        , ( 0x62, OpCodeMetaData "MOV H,D" (OneByte unimplementedInstructionZero) )
        , ( 0x63, OpCodeMetaData "MOV H,E" (OneByte unimplementedInstructionZero) )
        , ( 0x64, OpCodeMetaData "MOV H,H" (OneByte unimplementedInstructionZero) )
        , ( 0x65, OpCodeMetaData "MOV H,L" (OneByte unimplementedInstructionZero) )
        , ( 0x66, OpCodeMetaData "MOV H,M" (OneByte unimplementedInstructionZero) )
        , ( 0x67, OpCodeMetaData "MOV H,A" (OneByte unimplementedInstructionZero) )
        , ( 0x68, OpCodeMetaData "MOV L,B" (OneByte unimplementedInstructionZero) )
        , ( 0x69, OpCodeMetaData "MOV L,C" (OneByte unimplementedInstructionZero) )
        , ( 0x6A, OpCodeMetaData "MOV L,D" (OneByte unimplementedInstructionZero) )
        , ( 0x6B, OpCodeMetaData "MOV L,E" (OneByte unimplementedInstructionZero) )
        , ( 0x6C, OpCodeMetaData "MOV L,H" (OneByte unimplementedInstructionZero) )
        , ( 0x6D, OpCodeMetaData "MOV L,L" (OneByte unimplementedInstructionZero) )
        , ( 0x6E, OpCodeMetaData "MOV L,M" (OneByte unimplementedInstructionZero) )
        , ( 0x6F, OpCodeMetaData "MOV L,A" (OneByte unimplementedInstructionZero) )
        , ( 0x70, OpCodeMetaData "MOV M,B" (OneByte unimplementedInstructionZero) )
        , ( 0x71, OpCodeMetaData "MOV M,C" (OneByte unimplementedInstructionZero) )
        , ( 0x72, OpCodeMetaData "MOV M,D" (OneByte unimplementedInstructionZero) )
        , ( 0x73, OpCodeMetaData "MOV M,E" (OneByte unimplementedInstructionZero) )
        , ( 0x74, OpCodeMetaData "MOV M,H" (OneByte unimplementedInstructionZero) )
        , ( 0x75, OpCodeMetaData "MOV M,L" (OneByte unimplementedInstructionZero) )
        , ( 0x76, OpCodeMetaData "HLT" (OneByte unimplementedInstructionZero) )
        , ( 0x77, OpCodeMetaData "MOV M,A" (OneByte unimplementedInstructionZero) )
        , ( 0x78, OpCodeMetaData "MOV A,B" (OneByte unimplementedInstructionZero) )
        , ( 0x79, OpCodeMetaData "MOV A,C" (OneByte unimplementedInstructionZero) )
        , ( 0x7A, OpCodeMetaData "MOV A,D" (OneByte unimplementedInstructionZero) )
        , ( 0x7B, OpCodeMetaData "MOV A,E" (OneByte unimplementedInstructionZero) )
        , ( 0x7C, OpCodeMetaData "MOV A,H" (OneByte unimplementedInstructionZero) )
        , ( 0x7D, OpCodeMetaData "MOV A,L" (OneByte unimplementedInstructionZero) )
        , ( 0x7E, OpCodeMetaData "MOV A,M" (OneByte unimplementedInstructionZero) )
        , ( 0x7F, OpCodeMetaData "MOV A,A" (OneByte unimplementedInstructionZero) )
        , ( 0x80, OpCodeMetaData "ADD B" (OneByte unimplementedInstructionZero) )
        , ( 0x81, OpCodeMetaData "ADD C" (OneByte unimplementedInstructionZero) )
        , ( 0x82, OpCodeMetaData "ADD D" (OneByte unimplementedInstructionZero) )
        , ( 0x83, OpCodeMetaData "ADD E" (OneByte unimplementedInstructionZero) )
        , ( 0x84, OpCodeMetaData "ADD H" (OneByte unimplementedInstructionZero) )
        , ( 0x85, OpCodeMetaData "ADD L" (OneByte unimplementedInstructionZero) )
        , ( 0x86, OpCodeMetaData "ADD M" (OneByte unimplementedInstructionZero) )
        , ( 0x87, OpCodeMetaData "ADD A" (OneByte unimplementedInstructionZero) )
        , ( 0x88, OpCodeMetaData "ADC B" (OneByte unimplementedInstructionZero) )
        , ( 0x89, OpCodeMetaData "ADC C" (OneByte unimplementedInstructionZero) )
        , ( 0x8A, OpCodeMetaData "ADC D" (OneByte unimplementedInstructionZero) )
        , ( 0x8B, OpCodeMetaData "ADC E" (OneByte unimplementedInstructionZero) )
        , ( 0x8C, OpCodeMetaData "ADC H" (OneByte unimplementedInstructionZero) )
        , ( 0x8D, OpCodeMetaData "ADC L" (OneByte unimplementedInstructionZero) )
        , ( 0x8E, OpCodeMetaData "ADC M" (OneByte unimplementedInstructionZero) )
        , ( 0x8F, OpCodeMetaData "ADC A" (OneByte unimplementedInstructionZero) )
        , ( 0x90, OpCodeMetaData "SUB B" (OneByte unimplementedInstructionZero) )
        , ( 0x91, OpCodeMetaData "SUB C" (OneByte unimplementedInstructionZero) )
        , ( 0x92, OpCodeMetaData "SUB D" (OneByte unimplementedInstructionZero) )
        , ( 0x93, OpCodeMetaData "SUB E" (OneByte unimplementedInstructionZero) )
        , ( 0x94, OpCodeMetaData "SUB H" (OneByte unimplementedInstructionZero) )
        , ( 0x95, OpCodeMetaData "SUB L" (OneByte unimplementedInstructionZero) )
        , ( 0x96, OpCodeMetaData "SUB M" (OneByte unimplementedInstructionZero) )
        , ( 0x97, OpCodeMetaData "SUB A" (OneByte unimplementedInstructionZero) )
        , ( 0x98, OpCodeMetaData "SBB B" (OneByte unimplementedInstructionZero) )
        , ( 0x99, OpCodeMetaData "SBB C" (OneByte unimplementedInstructionZero) )
        , ( 0x9A, OpCodeMetaData "SBB D" (OneByte unimplementedInstructionZero) )
        , ( 0x9B, OpCodeMetaData "SBB E" (OneByte unimplementedInstructionZero) )
        , ( 0x9C, OpCodeMetaData "SBB H" (OneByte unimplementedInstructionZero) )
        , ( 0x9D, OpCodeMetaData "SBB L" (OneByte unimplementedInstructionZero) )
        , ( 0x9E, OpCodeMetaData "SBB M" (OneByte unimplementedInstructionZero) )
        , ( 0x9F, OpCodeMetaData "SBB A" (OneByte unimplementedInstructionZero) )
        , ( 0xA0, OpCodeMetaData "ANA B" (OneByte unimplementedInstructionZero) )
        , ( 0xA1, OpCodeMetaData "ANA C" (OneByte unimplementedInstructionZero) )
        , ( 0xA2, OpCodeMetaData "ANA D" (OneByte unimplementedInstructionZero) )
        , ( 0xA3, OpCodeMetaData "ANA E" (OneByte unimplementedInstructionZero) )
        , ( 0xA4, OpCodeMetaData "ANA H" (OneByte unimplementedInstructionZero) )
        , ( 0xA5, OpCodeMetaData "ANA L" (OneByte unimplementedInstructionZero) )
        , ( 0xA6, OpCodeMetaData "ANA M" (OneByte unimplementedInstructionZero) )
        , ( 0xA7, OpCodeMetaData "ANA A" (OneByte unimplementedInstructionZero) )
        , ( 0xA8, OpCodeMetaData "XRA B" (OneByte unimplementedInstructionZero) )
        , ( 0xA9, OpCodeMetaData "XRA C" (OneByte unimplementedInstructionZero) )
        , ( 0xAA, OpCodeMetaData "XRA D" (OneByte unimplementedInstructionZero) )
        , ( 0xAB, OpCodeMetaData "XRA E" (OneByte unimplementedInstructionZero) )
        , ( 0xAC, OpCodeMetaData "XRA H" (OneByte unimplementedInstructionZero) )
        , ( 0xAD, OpCodeMetaData "XRA L" (OneByte unimplementedInstructionZero) )
        , ( 0xAE, OpCodeMetaData "XRA M" (OneByte unimplementedInstructionZero) )
        , ( 0xAF, OpCodeMetaData "XRA A" (OneByte unimplementedInstructionZero) )
        , ( 0xB0, OpCodeMetaData "ORA B" (OneByte unimplementedInstructionZero) )
        , ( 0xB1, OpCodeMetaData "ORA C" (OneByte unimplementedInstructionZero) )
        , ( 0xB2, OpCodeMetaData "ORA D" (OneByte unimplementedInstructionZero) )
        , ( 0xB3, OpCodeMetaData "ORA E" (OneByte unimplementedInstructionZero) )
        , ( 0xB4, OpCodeMetaData "ORA H" (OneByte unimplementedInstructionZero) )
        , ( 0xB5, OpCodeMetaData "ORA L" (OneByte unimplementedInstructionZero) )
        , ( 0xB6, OpCodeMetaData "ORA M" (OneByte unimplementedInstructionZero) )
        , ( 0xB7, OpCodeMetaData "ORA A" (OneByte unimplementedInstructionZero) )
        , ( 0xB8, OpCodeMetaData "CMP B" (OneByte unimplementedInstructionZero) )
        , ( 0xB9, OpCodeMetaData "CMP C" (OneByte unimplementedInstructionZero) )
        , ( 0xBA, OpCodeMetaData "CMP D" (OneByte unimplementedInstructionZero) )
        , ( 0xBB, OpCodeMetaData "CMP E" (OneByte unimplementedInstructionZero) )
        , ( 0xBC, OpCodeMetaData "CMP H" (OneByte unimplementedInstructionZero) )
        , ( 0xBD, OpCodeMetaData "CMP L" (OneByte unimplementedInstructionZero) )
        , ( 0xBE, OpCodeMetaData "CMP M" (OneByte unimplementedInstructionZero) )
        , ( 0xBF, OpCodeMetaData "CMP A" (OneByte unimplementedInstructionZero) )
        , ( 0xC0, OpCodeMetaData "RNZ" (OneByte unimplementedInstructionZero) )
        , ( 0xC1, OpCodeMetaData "POP B" (OneByte unimplementedInstructionZero) )
        , ( 0xC2, OpCodeMetaData "JNZ adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xC3, OpCodeMetaData "JMP adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xC4, OpCodeMetaData "CNZ adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xC5, OpCodeMetaData "PUSH B" (OneByte unimplementedInstructionZero) )
        , ( 0xC6, OpCodeMetaData "ADI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xC7, OpCodeMetaData "RST 0" (OneByte unimplementedInstructionZero) )
        , ( 0xC8, OpCodeMetaData "RZ" (OneByte unimplementedInstructionZero) )
        , ( 0xC9, OpCodeMetaData "RET" (OneByte unimplementedInstructionZero) )
        , ( 0xCA, OpCodeMetaData "JZ adr" (ThreeBytes unimplementedInstructionTwo) )
        , --(0xcb, OpCodeMetaInformation "-" 0),
          ( 0xCC, OpCodeMetaData "CZ adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xCD, OpCodeMetaData "CALL adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xCE, OpCodeMetaData "ACI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xCF, OpCodeMetaData "RST 1" (OneByte unimplementedInstructionZero) )
        , ( 0xD0, OpCodeMetaData "RNC" (OneByte unimplementedInstructionZero) )
        , ( 0xD1, OpCodeMetaData "POP D" (OneByte unimplementedInstructionZero) )
        , ( 0xD2, OpCodeMetaData "JNC adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xD3, OpCodeMetaData "OUT D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xD4, OpCodeMetaData "CNC adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xD5, OpCodeMetaData "PUSH D" (OneByte unimplementedInstructionZero) )
        , ( 0xD6, OpCodeMetaData "SUI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xD7, OpCodeMetaData "RST 2" (OneByte unimplementedInstructionZero) )
        , ( 0xD8, OpCodeMetaData "RC" (OneByte unimplementedInstructionZero) )
        , --(0xd9, OpCodeMetaInformation "-" 0),
          ( 0xDA, OpCodeMetaData "JC adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xDB, OpCodeMetaData "IN D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xDC, OpCodeMetaData "CC adr" (ThreeBytes unimplementedInstructionTwo) )
        , --(0xdd, OpCodeMetaInformation "-" 0),
          ( 0xDE, OpCodeMetaData "SBI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xDF, OpCodeMetaData "RST 3" (OneByte unimplementedInstructionZero) )
        , ( 0xE0, OpCodeMetaData "RPO" (OneByte unimplementedInstructionZero) )
        , ( 0xE1, OpCodeMetaData "POP H" (OneByte unimplementedInstructionZero) )
        , ( 0xE2, OpCodeMetaData "JPO adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xE3, OpCodeMetaData "XTHL" (OneByte unimplementedInstructionZero) )
        , ( 0xE4, OpCodeMetaData "CPO adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xE5, OpCodeMetaData "PUSH H" (OneByte unimplementedInstructionZero) )
        , ( 0xE6, OpCodeMetaData "ANI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xE7, OpCodeMetaData "RST 4" (OneByte unimplementedInstructionZero) )
        , ( 0xE8, OpCodeMetaData "RPE" (OneByte unimplementedInstructionZero) )
        , ( 0xE9, OpCodeMetaData "PCHL" (OneByte unimplementedInstructionZero) )
        , ( 0xEA, OpCodeMetaData "JPE adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xEB, OpCodeMetaData "XCHG" (OneByte unimplementedInstructionZero) )
        , ( 0xEC, OpCodeMetaData "CPE adr" (ThreeBytes unimplementedInstructionTwo) )
        , --(0xed, OpCodeMetaInformation "-" 0),
          ( 0xEE, OpCodeMetaData "XRI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xEF, OpCodeMetaData "RST 5" (OneByte unimplementedInstructionZero) )
        , ( 0xF0, OpCodeMetaData "RP" (OneByte unimplementedInstructionZero) )
        , ( 0xF1, OpCodeMetaData "POP PSW" (OneByte unimplementedInstructionZero) )
        , ( 0xF2, OpCodeMetaData "JP adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xF3, OpCodeMetaData "DI" (OneByte unimplementedInstructionZero) )
        , ( 0xF4, OpCodeMetaData "CP adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xF5, OpCodeMetaData "PUSH PSW" (OneByte unimplementedInstructionZero) )
        , ( 0xF6, OpCodeMetaData "ORI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xF7, OpCodeMetaData "RST 6" (OneByte unimplementedInstructionZero) )
        , ( 0xF8, OpCodeMetaData "RM" (OneByte unimplementedInstructionZero) )
        , ( 0xF9, OpCodeMetaData "SPHL" (OneByte unimplementedInstructionZero) )
        , ( 0xFA, OpCodeMetaData "JM adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xFB, OpCodeMetaData "EI" (OneByte unimplementedInstructionZero) )
        , ( 0xFC, OpCodeMetaData "CM adr" (ThreeBytes unimplementedInstructionTwo) )
        , --(0xfd, OpCodeMetaInformation "-" 0),
          ( 0xFE, OpCodeMetaData "CPI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xFF, OpCodeMetaData "RST 7" (OneByte unimplementedInstructionZero) )
        ]


getOpCodeFromTable : Int -> Maybe OpCode
getOpCodeFromTable opCodeByte =
    Dict.get opCodeByte opCodeTable
        |> Maybe.map (\metaInfo -> OpCode opCodeByte metaInfo)
