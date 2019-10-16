module OpCodeTable exposing (getOpCodeFromTable)

import Dict exposing (Dict)
import MachineInstructions exposing (..)
import MachineState exposing (CpuState, MachineStateDiff(..))
import OpCode exposing (OpCode, OpCodeData, OpCodeSpec(..))


unimplementedInstructionZero : CpuState -> MachineStateDiff
unimplementedInstructionZero cpuState =
    Failed (Just cpuState) "not implemented yet, no args"


unimplementedInstructionOne : Int -> CpuState -> MachineStateDiff
unimplementedInstructionOne firstArg cpuState =
    Failed (Just cpuState) ("not implemented yet, first arg: " ++ String.fromInt firstArg)


unimplementedInstructionTwo : Int -> Int -> CpuState -> MachineStateDiff
unimplementedInstructionTwo firstArg secondArg cpuState =
    Failed (Just cpuState) ("not implemented yet, first arg: " ++ String.fromInt firstArg ++ ", second arg: " ++ String.fromInt secondArg)


opCodeTable : Dict Int OpCodeData
opCodeTable =
    Dict.fromList
        [ ( 0x00, OpCodeData "NOP" (OneByte MachineInstructions.nop) )
        , ( 0x01, OpCodeData "LXI B,D16" (ThreeBytes MachineInstructions.lxi_b_d16) )
        , ( 0x02, OpCodeData "STAX B" (OneByte MachineInstructions.stax_b) )
        , ( 0x03, OpCodeData "INX B" (OneByte MachineInstructions.inx_b) )
        , ( 0x04, OpCodeData "INR B" (OneByte unimplementedInstructionZero) )
        , ( 0x05, OpCodeData "DCR B" (OneByte unimplementedInstructionZero) )
        , ( 0x06, OpCodeData "MVI B, D8" (TwoBytes MachineInstructions.mvi_b_d8) )
        , ( 0x07, OpCodeData "RLC" (OneByte unimplementedInstructionZero) )
        , --(0x08, OpCodeMetaInformation "-" 0),
          ( 0x09, OpCodeData "DAD B" (OneByte unimplementedInstructionZero) )
        , ( 0x0A, OpCodeData "LDAX B" (OneByte unimplementedInstructionZero) )
        , ( 0x0B, OpCodeData "DCX B" (OneByte unimplementedInstructionZero) )
        , ( 0x0C, OpCodeData "INR C" (OneByte unimplementedInstructionZero) )
        , ( 0x0D, OpCodeData "DCR C" (OneByte unimplementedInstructionZero) )
        , ( 0x0E, OpCodeData "MVI C,D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x0F, OpCodeData "RRC" (OneByte unimplementedInstructionZero) )
        , --(0x10, OpCodeMetaInformation "-" 0),
          ( 0x11, OpCodeData "LXI D,D16" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x12, OpCodeData "STAX D" (OneByte unimplementedInstructionZero) )
        , ( 0x13, OpCodeData "INX D" (OneByte unimplementedInstructionZero) )
        , ( 0x14, OpCodeData "INR D" (OneByte unimplementedInstructionZero) )
        , ( 0x15, OpCodeData "DCR D" (OneByte unimplementedInstructionZero) )
        , ( 0x16, OpCodeData "MVI D, D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x17, OpCodeData "RAL" (OneByte unimplementedInstructionZero) )
        , --(0x18, OpCodeMetaInformation "-" 0),
          ( 0x19, OpCodeData "DAD D" (OneByte unimplementedInstructionZero) )
        , ( 0x1A, OpCodeData "LDAX D" (OneByte unimplementedInstructionZero) )
        , ( 0x1B, OpCodeData "DCX D" (OneByte unimplementedInstructionZero) )
        , ( 0x1C, OpCodeData "INR E" (OneByte unimplementedInstructionZero) )
        , ( 0x1D, OpCodeData "DCR E" (OneByte unimplementedInstructionZero) )
        , ( 0x1E, OpCodeData "MVI E,D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x1F, OpCodeData "RAR" (OneByte unimplementedInstructionZero) )
        , ( 0x20, OpCodeData "RIM" (OneByte unimplementedInstructionZero) )
        , ( 0x21, OpCodeData "LXI H,D16" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x22, OpCodeData "SHLD adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x23, OpCodeData "INX H" (OneByte unimplementedInstructionZero) )
        , ( 0x24, OpCodeData "INR H" (OneByte unimplementedInstructionZero) )
        , ( 0x25, OpCodeData "DCR H" (OneByte unimplementedInstructionZero) )
        , ( 0x26, OpCodeData "MVI H,D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x27, OpCodeData "DAA" (OneByte unimplementedInstructionZero) )
        , --(0x28, OpCodeMetaInformation "-" 0),
          ( 0x29, OpCodeData "DAD H" (OneByte unimplementedInstructionZero) )
        , ( 0x2A, OpCodeData "LHLD adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x2B, OpCodeData "DCX H" (OneByte unimplementedInstructionZero) )
        , ( 0x2C, OpCodeData "INR L" (OneByte unimplementedInstructionZero) )
        , ( 0x2D, OpCodeData "DCR L" (OneByte unimplementedInstructionZero) )
        , ( 0x2E, OpCodeData "MVI L, D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x2F, OpCodeData "CMA" (OneByte unimplementedInstructionZero) )
        , ( 0x30, OpCodeData "SIM" (OneByte unimplementedInstructionZero) )
        , ( 0x31, OpCodeData "LXI SP, D16" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x32, OpCodeData "STA adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x33, OpCodeData "INX SP" (OneByte unimplementedInstructionZero) )
        , ( 0x34, OpCodeData "INR M" (OneByte unimplementedInstructionZero) )
        , ( 0x35, OpCodeData "DCR M" (OneByte unimplementedInstructionZero) )
        , ( 0x36, OpCodeData "MVI M,D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x37, OpCodeData "STC" (OneByte unimplementedInstructionZero) )
        , --(0x38, OpCodeMetaInformation "-" 0),
          ( 0x39, OpCodeData "DAD SP" (OneByte unimplementedInstructionZero) )
        , ( 0x3A, OpCodeData "LDA adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x3B, OpCodeData "DCX SP" (OneByte unimplementedInstructionZero) )
        , ( 0x3C, OpCodeData "INR A" (OneByte unimplementedInstructionZero) )
        , ( 0x3D, OpCodeData "DCR A" (OneByte unimplementedInstructionZero) )
        , ( 0x3E, OpCodeData "MVI A,D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0x3F, OpCodeData "CMC" (OneByte unimplementedInstructionZero) )
        , ( 0x40, OpCodeData "MOV B,B" (OneByte unimplementedInstructionZero) )
        , ( 0x41, OpCodeData "MOV B,C" (OneByte unimplementedInstructionZero) )
        , ( 0x42, OpCodeData "MOV B,D" (OneByte unimplementedInstructionZero) )
        , ( 0x43, OpCodeData "MOV B,E" (OneByte unimplementedInstructionZero) )
        , ( 0x44, OpCodeData "MOV B,H" (OneByte unimplementedInstructionZero) )
        , ( 0x45, OpCodeData "MOV B,L" (OneByte unimplementedInstructionZero) )
        , ( 0x46, OpCodeData "MOV B,M" (OneByte unimplementedInstructionZero) )
        , ( 0x47, OpCodeData "MOV B,A" (OneByte unimplementedInstructionZero) )
        , ( 0x48, OpCodeData "MOV C,B" (OneByte unimplementedInstructionZero) )
        , ( 0x49, OpCodeData "MOV C,C" (OneByte unimplementedInstructionZero) )
        , ( 0x4A, OpCodeData "MOV C,D" (OneByte unimplementedInstructionZero) )
        , ( 0x4B, OpCodeData "MOV C,E" (OneByte unimplementedInstructionZero) )
        , ( 0x4C, OpCodeData "MOV C,H" (OneByte unimplementedInstructionZero) )
        , ( 0x4D, OpCodeData "MOV C,L" (OneByte unimplementedInstructionZero) )
        , ( 0x4E, OpCodeData "MOV C,M" (OneByte unimplementedInstructionZero) )
        , ( 0x4F, OpCodeData "MOV C,A" (OneByte unimplementedInstructionZero) )
        , ( 0x50, OpCodeData "MOV D,B" (OneByte unimplementedInstructionZero) )
        , ( 0x51, OpCodeData "MOV D,C" (OneByte unimplementedInstructionZero) )
        , ( 0x52, OpCodeData "MOV D,D" (OneByte unimplementedInstructionZero) )
        , ( 0x53, OpCodeData "MOV D,E" (OneByte unimplementedInstructionZero) )
        , ( 0x54, OpCodeData "MOV D,H" (OneByte unimplementedInstructionZero) )
        , ( 0x55, OpCodeData "MOV D,L" (OneByte unimplementedInstructionZero) )
        , ( 0x56, OpCodeData "MOV D,M" (OneByte unimplementedInstructionZero) )
        , ( 0x57, OpCodeData "MOV D,A" (OneByte unimplementedInstructionZero) )
        , ( 0x58, OpCodeData "MOV E,B" (OneByte unimplementedInstructionZero) )
        , ( 0x59, OpCodeData "MOV E,C" (OneByte unimplementedInstructionZero) )
        , ( 0x5A, OpCodeData "MOV E,D" (OneByte unimplementedInstructionZero) )
        , ( 0x5B, OpCodeData "MOV E,E" (OneByte unimplementedInstructionZero) )
        , ( 0x5C, OpCodeData "MOV E,H" (OneByte unimplementedInstructionZero) )
        , ( 0x5D, OpCodeData "MOV E,L" (OneByte unimplementedInstructionZero) )
        , ( 0x5E, OpCodeData "MOV E,M" (OneByte unimplementedInstructionZero) )
        , ( 0x5F, OpCodeData "MOV E,A" (OneByte unimplementedInstructionZero) )
        , ( 0x60, OpCodeData "MOV H,B" (OneByte unimplementedInstructionZero) )
        , ( 0x61, OpCodeData "MOV H,C" (OneByte unimplementedInstructionZero) )
        , ( 0x62, OpCodeData "MOV H,D" (OneByte unimplementedInstructionZero) )
        , ( 0x63, OpCodeData "MOV H,E" (OneByte unimplementedInstructionZero) )
        , ( 0x64, OpCodeData "MOV H,H" (OneByte unimplementedInstructionZero) )
        , ( 0x65, OpCodeData "MOV H,L" (OneByte unimplementedInstructionZero) )
        , ( 0x66, OpCodeData "MOV H,M" (OneByte unimplementedInstructionZero) )
        , ( 0x67, OpCodeData "MOV H,A" (OneByte unimplementedInstructionZero) )
        , ( 0x68, OpCodeData "MOV L,B" (OneByte unimplementedInstructionZero) )
        , ( 0x69, OpCodeData "MOV L,C" (OneByte unimplementedInstructionZero) )
        , ( 0x6A, OpCodeData "MOV L,D" (OneByte unimplementedInstructionZero) )
        , ( 0x6B, OpCodeData "MOV L,E" (OneByte unimplementedInstructionZero) )
        , ( 0x6C, OpCodeData "MOV L,H" (OneByte unimplementedInstructionZero) )
        , ( 0x6D, OpCodeData "MOV L,L" (OneByte unimplementedInstructionZero) )
        , ( 0x6E, OpCodeData "MOV L,M" (OneByte unimplementedInstructionZero) )
        , ( 0x6F, OpCodeData "MOV L,A" (OneByte unimplementedInstructionZero) )
        , ( 0x70, OpCodeData "MOV M,B" (OneByte unimplementedInstructionZero) )
        , ( 0x71, OpCodeData "MOV M,C" (OneByte unimplementedInstructionZero) )
        , ( 0x72, OpCodeData "MOV M,D" (OneByte unimplementedInstructionZero) )
        , ( 0x73, OpCodeData "MOV M,E" (OneByte unimplementedInstructionZero) )
        , ( 0x74, OpCodeData "MOV M,H" (OneByte unimplementedInstructionZero) )
        , ( 0x75, OpCodeData "MOV M,L" (OneByte unimplementedInstructionZero) )
        , ( 0x76, OpCodeData "HLT" (OneByte unimplementedInstructionZero) )
        , ( 0x77, OpCodeData "MOV M,A" (OneByte unimplementedInstructionZero) )
        , ( 0x78, OpCodeData "MOV A,B" (OneByte unimplementedInstructionZero) )
        , ( 0x79, OpCodeData "MOV A,C" (OneByte unimplementedInstructionZero) )
        , ( 0x7A, OpCodeData "MOV A,D" (OneByte unimplementedInstructionZero) )
        , ( 0x7B, OpCodeData "MOV A,E" (OneByte unimplementedInstructionZero) )
        , ( 0x7C, OpCodeData "MOV A,H" (OneByte unimplementedInstructionZero) )
        , ( 0x7D, OpCodeData "MOV A,L" (OneByte unimplementedInstructionZero) )
        , ( 0x7E, OpCodeData "MOV A,M" (OneByte unimplementedInstructionZero) )
        , ( 0x7F, OpCodeData "MOV A,A" (OneByte unimplementedInstructionZero) )
        , ( 0x80, OpCodeData "ADD B" (OneByte unimplementedInstructionZero) )
        , ( 0x81, OpCodeData "ADD C" (OneByte unimplementedInstructionZero) )
        , ( 0x82, OpCodeData "ADD D" (OneByte unimplementedInstructionZero) )
        , ( 0x83, OpCodeData "ADD E" (OneByte unimplementedInstructionZero) )
        , ( 0x84, OpCodeData "ADD H" (OneByte unimplementedInstructionZero) )
        , ( 0x85, OpCodeData "ADD L" (OneByte unimplementedInstructionZero) )
        , ( 0x86, OpCodeData "ADD M" (OneByte unimplementedInstructionZero) )
        , ( 0x87, OpCodeData "ADD A" (OneByte unimplementedInstructionZero) )
        , ( 0x88, OpCodeData "ADC B" (OneByte unimplementedInstructionZero) )
        , ( 0x89, OpCodeData "ADC C" (OneByte unimplementedInstructionZero) )
        , ( 0x8A, OpCodeData "ADC D" (OneByte unimplementedInstructionZero) )
        , ( 0x8B, OpCodeData "ADC E" (OneByte unimplementedInstructionZero) )
        , ( 0x8C, OpCodeData "ADC H" (OneByte unimplementedInstructionZero) )
        , ( 0x8D, OpCodeData "ADC L" (OneByte unimplementedInstructionZero) )
        , ( 0x8E, OpCodeData "ADC M" (OneByte unimplementedInstructionZero) )
        , ( 0x8F, OpCodeData "ADC A" (OneByte unimplementedInstructionZero) )
        , ( 0x90, OpCodeData "SUB B" (OneByte unimplementedInstructionZero) )
        , ( 0x91, OpCodeData "SUB C" (OneByte unimplementedInstructionZero) )
        , ( 0x92, OpCodeData "SUB D" (OneByte unimplementedInstructionZero) )
        , ( 0x93, OpCodeData "SUB E" (OneByte unimplementedInstructionZero) )
        , ( 0x94, OpCodeData "SUB H" (OneByte unimplementedInstructionZero) )
        , ( 0x95, OpCodeData "SUB L" (OneByte unimplementedInstructionZero) )
        , ( 0x96, OpCodeData "SUB M" (OneByte unimplementedInstructionZero) )
        , ( 0x97, OpCodeData "SUB A" (OneByte unimplementedInstructionZero) )
        , ( 0x98, OpCodeData "SBB B" (OneByte unimplementedInstructionZero) )
        , ( 0x99, OpCodeData "SBB C" (OneByte unimplementedInstructionZero) )
        , ( 0x9A, OpCodeData "SBB D" (OneByte unimplementedInstructionZero) )
        , ( 0x9B, OpCodeData "SBB E" (OneByte unimplementedInstructionZero) )
        , ( 0x9C, OpCodeData "SBB H" (OneByte unimplementedInstructionZero) )
        , ( 0x9D, OpCodeData "SBB L" (OneByte unimplementedInstructionZero) )
        , ( 0x9E, OpCodeData "SBB M" (OneByte unimplementedInstructionZero) )
        , ( 0x9F, OpCodeData "SBB A" (OneByte unimplementedInstructionZero) )
        , ( 0xA0, OpCodeData "ANA B" (OneByte unimplementedInstructionZero) )
        , ( 0xA1, OpCodeData "ANA C" (OneByte unimplementedInstructionZero) )
        , ( 0xA2, OpCodeData "ANA D" (OneByte unimplementedInstructionZero) )
        , ( 0xA3, OpCodeData "ANA E" (OneByte unimplementedInstructionZero) )
        , ( 0xA4, OpCodeData "ANA H" (OneByte unimplementedInstructionZero) )
        , ( 0xA5, OpCodeData "ANA L" (OneByte unimplementedInstructionZero) )
        , ( 0xA6, OpCodeData "ANA M" (OneByte unimplementedInstructionZero) )
        , ( 0xA7, OpCodeData "ANA A" (OneByte unimplementedInstructionZero) )
        , ( 0xA8, OpCodeData "XRA B" (OneByte unimplementedInstructionZero) )
        , ( 0xA9, OpCodeData "XRA C" (OneByte unimplementedInstructionZero) )
        , ( 0xAA, OpCodeData "XRA D" (OneByte unimplementedInstructionZero) )
        , ( 0xAB, OpCodeData "XRA E" (OneByte unimplementedInstructionZero) )
        , ( 0xAC, OpCodeData "XRA H" (OneByte unimplementedInstructionZero) )
        , ( 0xAD, OpCodeData "XRA L" (OneByte unimplementedInstructionZero) )
        , ( 0xAE, OpCodeData "XRA M" (OneByte unimplementedInstructionZero) )
        , ( 0xAF, OpCodeData "XRA A" (OneByte unimplementedInstructionZero) )
        , ( 0xB0, OpCodeData "ORA B" (OneByte unimplementedInstructionZero) )
        , ( 0xB1, OpCodeData "ORA C" (OneByte unimplementedInstructionZero) )
        , ( 0xB2, OpCodeData "ORA D" (OneByte unimplementedInstructionZero) )
        , ( 0xB3, OpCodeData "ORA E" (OneByte unimplementedInstructionZero) )
        , ( 0xB4, OpCodeData "ORA H" (OneByte unimplementedInstructionZero) )
        , ( 0xB5, OpCodeData "ORA L" (OneByte unimplementedInstructionZero) )
        , ( 0xB6, OpCodeData "ORA M" (OneByte unimplementedInstructionZero) )
        , ( 0xB7, OpCodeData "ORA A" (OneByte unimplementedInstructionZero) )
        , ( 0xB8, OpCodeData "CMP B" (OneByte unimplementedInstructionZero) )
        , ( 0xB9, OpCodeData "CMP C" (OneByte unimplementedInstructionZero) )
        , ( 0xBA, OpCodeData "CMP D" (OneByte unimplementedInstructionZero) )
        , ( 0xBB, OpCodeData "CMP E" (OneByte unimplementedInstructionZero) )
        , ( 0xBC, OpCodeData "CMP H" (OneByte unimplementedInstructionZero) )
        , ( 0xBD, OpCodeData "CMP L" (OneByte unimplementedInstructionZero) )
        , ( 0xBE, OpCodeData "CMP M" (OneByte unimplementedInstructionZero) )
        , ( 0xBF, OpCodeData "CMP A" (OneByte unimplementedInstructionZero) )
        , ( 0xC0, OpCodeData "RNZ" (OneByte unimplementedInstructionZero) )
        , ( 0xC1, OpCodeData "POP B" (OneByte unimplementedInstructionZero) )
        , ( 0xC2, OpCodeData "JNZ adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xC3, OpCodeData "JMP adr" (ThreeBytes MachineInstructions.jmp) )
        , ( 0xC4, OpCodeData "CNZ adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xC5, OpCodeData "PUSH B" (OneByte MachineInstructions.push_b) )
        , ( 0xC6, OpCodeData "ADI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xC7, OpCodeData "RST 0" (OneByte unimplementedInstructionZero) )
        , ( 0xC8, OpCodeData "RZ" (OneByte unimplementedInstructionZero) )
        , ( 0xC9, OpCodeData "RET" (OneByte unimplementedInstructionZero) )
        , ( 0xCA, OpCodeData "JZ adr" (ThreeBytes unimplementedInstructionTwo) )
        , --(0xcb, OpCodeMetaInformation "-" 0),
          ( 0xCC, OpCodeData "CZ adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xCD, OpCodeData "CALL adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xCE, OpCodeData "ACI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xCF, OpCodeData "RST 1" (OneByte unimplementedInstructionZero) )
        , ( 0xD0, OpCodeData "RNC" (OneByte unimplementedInstructionZero) )
        , ( 0xD1, OpCodeData "POP D" (OneByte unimplementedInstructionZero) )
        , ( 0xD2, OpCodeData "JNC adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xD3, OpCodeData "OUT D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xD4, OpCodeData "CNC adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xD5, OpCodeData "PUSH D" (OneByte unimplementedInstructionZero) )
        , ( 0xD6, OpCodeData "SUI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xD7, OpCodeData "RST 2" (OneByte unimplementedInstructionZero) )
        , ( 0xD8, OpCodeData "RC" (OneByte unimplementedInstructionZero) )
        , --(0xd9, OpCodeMetaInformation "-" 0),
          ( 0xDA, OpCodeData "JC adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xDB, OpCodeData "IN D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xDC, OpCodeData "CC adr" (ThreeBytes unimplementedInstructionTwo) )
        , --(0xdd, OpCodeMetaInformation "-" 0),
          ( 0xDE, OpCodeData "SBI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xDF, OpCodeData "RST 3" (OneByte unimplementedInstructionZero) )
        , ( 0xE0, OpCodeData "RPO" (OneByte unimplementedInstructionZero) )
        , ( 0xE1, OpCodeData "POP H" (OneByte unimplementedInstructionZero) )
        , ( 0xE2, OpCodeData "JPO adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xE3, OpCodeData "XTHL" (OneByte unimplementedInstructionZero) )
        , ( 0xE4, OpCodeData "CPO adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xE5, OpCodeData "PUSH H" (OneByte unimplementedInstructionZero) )
        , ( 0xE6, OpCodeData "ANI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xE7, OpCodeData "RST 4" (OneByte unimplementedInstructionZero) )
        , ( 0xE8, OpCodeData "RPE" (OneByte unimplementedInstructionZero) )
        , ( 0xE9, OpCodeData "PCHL" (OneByte unimplementedInstructionZero) )
        , ( 0xEA, OpCodeData "JPE adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xEB, OpCodeData "XCHG" (OneByte unimplementedInstructionZero) )
        , ( 0xEC, OpCodeData "CPE adr" (ThreeBytes unimplementedInstructionTwo) )
        , --(0xed, OpCodeMetaInformation "-" 0),
          ( 0xEE, OpCodeData "XRI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xEF, OpCodeData "RST 5" (OneByte unimplementedInstructionZero) )
        , ( 0xF0, OpCodeData "RP" (OneByte unimplementedInstructionZero) )
        , ( 0xF1, OpCodeData "POP PSW" (OneByte unimplementedInstructionZero) )
        , ( 0xF2, OpCodeData "JP adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xF3, OpCodeData "DI" (OneByte unimplementedInstructionZero) )
        , ( 0xF4, OpCodeData "CP adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xF5, OpCodeData "PUSH PSW" (OneByte MachineInstructions.push_psw) )
        , ( 0xF6, OpCodeData "ORI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xF7, OpCodeData "RST 6" (OneByte unimplementedInstructionZero) )
        , ( 0xF8, OpCodeData "RM" (OneByte unimplementedInstructionZero) )
        , ( 0xF9, OpCodeData "SPHL" (OneByte unimplementedInstructionZero) )
        , ( 0xFA, OpCodeData "JM adr" (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xFB, OpCodeData "EI" (OneByte unimplementedInstructionZero) )
        , ( 0xFC, OpCodeData "CM adr" (ThreeBytes unimplementedInstructionTwo) )
        , --(0xfd, OpCodeMetaInformation "-" 0),
          ( 0xFE, OpCodeData "CPI D8" (TwoBytes unimplementedInstructionOne) )
        , ( 0xFF, OpCodeData "RST 7" (OneByte unimplementedInstructionZero) )
        ]


getOpCodeFromTable : Int -> Maybe OpCode
getOpCodeFromTable opCodeByte =
    Dict.get opCodeByte opCodeTable
        |> Maybe.map (\metaInfo -> OpCode opCodeByte metaInfo)
