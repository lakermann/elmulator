module OpCodeTable exposing (getOpCodeFromTable)

import Dict exposing (Dict)
import EmulatorState exposing (ByteValue, MachineState, MachineStateDiff(..))
import IO
import MachineInstructions exposing (..)
import OpCode exposing (OpCode, OpCodeData, OpCodeSpec(..))


unimplementedInstructionZero : MachineState -> MachineStateDiff
unimplementedInstructionZero cpuState =
    Failed (Just cpuState) "not implemented yet, no args"


unimplementedInstructionOne : ByteValue -> MachineState -> MachineStateDiff
unimplementedInstructionOne firstArg cpuState =
    Failed (Just cpuState) ("not implemented yet, first arg: " ++ String.fromInt firstArg)


unimplementedInstructionTwo : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
unimplementedInstructionTwo firstArg secondArg cpuState =
    Failed (Just cpuState) ("not implemented yet, first arg: " ++ String.fromInt firstArg ++ ", second arg: " ++ String.fromInt secondArg)


unknownInstruction : MachineState -> MachineStateDiff
unknownInstruction cpuState =
    Failed (Just cpuState) "unknown instruction"


opCodeTable : Dict Int OpCodeData
opCodeTable =
    Dict.fromList
        [ ( 0x00, OpCodeData "NOP" 4 (OneByte MachineInstructions.nop) )
        , ( 0x01, OpCodeData "LXI B,D16" 10 (ThreeBytes MachineInstructions.lxi_b_d16) )
        , ( 0x02, OpCodeData "STAX B" 7 (OneByte MachineInstructions.stax_b) )
        , ( 0x03, OpCodeData "INX B" 5 (OneByte MachineInstructions.inx_b) )
        , ( 0x04, OpCodeData "INR B" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x05, OpCodeData "DCR B" 5 (OneByte MachineInstructions.dcr_b) )
        , ( 0x06, OpCodeData "MVI B, D8" 7 (TwoBytes MachineInstructions.mvi_b_d8) )
        , ( 0x07, OpCodeData "RLC" 4 (OneByte MachineInstructions.rlc) )
        , ( 0x08, OpCodeData "-" 0 (OneByte unknownInstruction) )
        , ( 0x09, OpCodeData "DAD B" 10 (OneByte MachineInstructions.dad_b) )
        , ( 0x0A, OpCodeData "LDAX B" 7 (OneByte MachineInstructions.ldax_b) )
        , ( 0x0B, OpCodeData "DCX B" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x0C, OpCodeData "INR C" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x0D, OpCodeData "DCR C" 5 (OneByte MachineInstructions.dcr_c) )
        , ( 0x0E, OpCodeData "MVI C,D8" 7 (TwoBytes MachineInstructions.mvi_c_d8) )
        , ( 0x0F, OpCodeData "RRC" 4 (OneByte MachineInstructions.rrc) )
        , ( 0x10, OpCodeData "-" 0 (OneByte unknownInstruction) )
        , ( 0x11, OpCodeData "LXI D,D16" 10 (ThreeBytes MachineInstructions.lxi_d_d16) )
        , ( 0x12, OpCodeData "STAX D" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x13, OpCodeData "INX D" 5 (OneByte MachineInstructions.inx_d) )
        , ( 0x14, OpCodeData "INR D" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x15, OpCodeData "DCR D" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x16, OpCodeData "MVI D, D8" 7 (TwoBytes MachineInstructions.mvi_d_d8) )
        , ( 0x17, OpCodeData "RAL" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x18, OpCodeData "-" 0 (OneByte unknownInstruction) )
        , ( 0x19, OpCodeData "DAD D" 10 (OneByte MachineInstructions.dad_d) )
        , ( 0x1A, OpCodeData "LDAX D" 7 (OneByte MachineInstructions.ldax_d) )
        , ( 0x1B, OpCodeData "DCX D" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x1C, OpCodeData "INR E" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x1D, OpCodeData "DCR E" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x1E, OpCodeData "MVI E,D8" 7 (TwoBytes unimplementedInstructionOne) )
        , ( 0x1F, OpCodeData "RAR" 4 (OneByte MachineInstructions.rar) )
        , ( 0x20, OpCodeData "RIM" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x21, OpCodeData "LXI H,D16" 10 (ThreeBytes MachineInstructions.lxi_h_d16) )
        , ( 0x22, OpCodeData "SHLD adr" 16 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0x23, OpCodeData "INX H" 5 (OneByte MachineInstructions.inx_h) )
        , ( 0x24, OpCodeData "INR H" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x25, OpCodeData "DCR H" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x26, OpCodeData "MVI H,D8" 7 (TwoBytes MachineInstructions.mvi_h_d8) )
        , ( 0x27, OpCodeData "DAA" 4 (OneByte MachineInstructions.daa) )
        , ( 0x28, OpCodeData "-" 0 (OneByte unknownInstruction) )
        , ( 0x29, OpCodeData "DAD H" 10 (OneByte MachineInstructions.dad_h) )
        , ( 0x2A, OpCodeData "LHLD adr" 16 (ThreeBytes MachineInstructions.lhld) )
        , ( 0x2B, OpCodeData "DCX H" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x2C, OpCodeData "INR L" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x2D, OpCodeData "DCR L" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x2E, OpCodeData "MVI L, D8" 7 (TwoBytes MachineInstructions.mvi_l_d8) )
        , ( 0x2F, OpCodeData "CMA" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x30, OpCodeData "SIM" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x31, OpCodeData "LXI SP, D16" 10 (ThreeBytes MachineInstructions.lxi_sp_d16) )
        , ( 0x32, OpCodeData "STA adr" 13 (ThreeBytes MachineInstructions.sta) )
        , ( 0x33, OpCodeData "INX SP" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x34, OpCodeData "INR M" 10 (OneByte unimplementedInstructionZero) )
        , ( 0x35, OpCodeData "DCR M" 10 (OneByte MachineInstructions.dcr_m) )
        , ( 0x36, OpCodeData "MVI M,D8" 10 (TwoBytes MachineInstructions.mvi_m_d8) )
        , ( 0x37, OpCodeData "STC" 4 (OneByte MachineInstructions.stc) )
        , ( 0x38, OpCodeData "-" 0 (OneByte unknownInstruction) )
        , ( 0x39, OpCodeData "DAD SP" 10 (OneByte unimplementedInstructionZero) )
        , ( 0x3A, OpCodeData "LDA adr" 13 (ThreeBytes MachineInstructions.lda) )
        , ( 0x3B, OpCodeData "DCX SP" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x3C, OpCodeData "INR A" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x3D, OpCodeData "DCR A" 5 (OneByte MachineInstructions.dcr_a) )
        , ( 0x3E, OpCodeData "MVI A,D8" 7 (TwoBytes MachineInstructions.mvi_a_d8) )
        , ( 0x3F, OpCodeData "CMC" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x40, OpCodeData "MOV B,B" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x41, OpCodeData "MOV B,C" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x42, OpCodeData "MOV B,D" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x43, OpCodeData "MOV B,E" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x44, OpCodeData "MOV B,H" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x45, OpCodeData "MOV B,L" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x46, OpCodeData "MOV B,M" 7 (OneByte MachineInstructions.mov_b_m) )
        , ( 0x47, OpCodeData "MOV B,A" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x48, OpCodeData "MOV C,B" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x49, OpCodeData "MOV C,C" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x4A, OpCodeData "MOV C,D" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x4B, OpCodeData "MOV C,E" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x4C, OpCodeData "MOV C,H" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x4D, OpCodeData "MOV C,L" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x4E, OpCodeData "MOV C,M" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x4F, OpCodeData "MOV C,A" 5 (OneByte MachineInstructions.mov_c_a) )
        , ( 0x50, OpCodeData "MOV D,B" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x51, OpCodeData "MOV D,C" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x52, OpCodeData "MOV D,D" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x53, OpCodeData "MOV D,E" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x54, OpCodeData "MOV D,H" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x55, OpCodeData "MOV D,L" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x56, OpCodeData "MOV D,M" 7 (OneByte MachineInstructions.mov_d_m) )
        , ( 0x57, OpCodeData "MOV D,A" 5 (OneByte MachineInstructions.mov_d_a) )
        , ( 0x58, OpCodeData "MOV E,B" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x59, OpCodeData "MOV E,C" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x5A, OpCodeData "MOV E,D" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x5B, OpCodeData "MOV E,E" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x5C, OpCodeData "MOV E,H" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x5D, OpCodeData "MOV E,L" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x5E, OpCodeData "MOV E,M" 7 (OneByte MachineInstructions.mov_e_m) )
        , ( 0x5F, OpCodeData "MOV E,A" 5 (OneByte MachineInstructions.mov_e_a) )
        , ( 0x60, OpCodeData "MOV H,B" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x61, OpCodeData "MOV H,C" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x62, OpCodeData "MOV H,D" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x63, OpCodeData "MOV H,E" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x64, OpCodeData "MOV H,H" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x65, OpCodeData "MOV H,L" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x66, OpCodeData "MOV H,M" 7 (OneByte MachineInstructions.mov_h_m) )
        , ( 0x67, OpCodeData "MOV H,A" 5 (OneByte MachineInstructions.mov_h_a) )
        , ( 0x68, OpCodeData "MOV L,B" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x69, OpCodeData "MOV L,C" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x6A, OpCodeData "MOV L,D" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x6B, OpCodeData "MOV L,E" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x6C, OpCodeData "MOV L,H" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x6D, OpCodeData "MOV L,L" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x6E, OpCodeData "MOV L,M" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x6F, OpCodeData "MOV L,A" 5 (OneByte MachineInstructions.mov_l_a) )
        , ( 0x70, OpCodeData "MOV M,B" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x71, OpCodeData "MOV M,C" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x72, OpCodeData "MOV M,D" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x73, OpCodeData "MOV M,E" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x74, OpCodeData "MOV M,H" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x75, OpCodeData "MOV M,L" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x76, OpCodeData "HLT" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x77, OpCodeData "MOV M,A" 7 (OneByte MachineInstructions.mov_m_a) )
        , ( 0x78, OpCodeData "MOV A,B" 5 (OneByte MachineInstructions.mov_a_b) )
        , ( 0x79, OpCodeData "MOV A,C" 5 (OneByte MachineInstructions.mov_a_c) )
        , ( 0x7A, OpCodeData "MOV A,D" 5 (OneByte MachineInstructions.mov_a_d) )
        , ( 0x7B, OpCodeData "MOV A,E" 5 (OneByte MachineInstructions.mov_a_e) )
        , ( 0x7C, OpCodeData "MOV A,H" 5 (OneByte MachineInstructions.mov_a_h) )
        , ( 0x7D, OpCodeData "MOV A,L" 5 (OneByte MachineInstructions.mov_a_l) )
        , ( 0x7E, OpCodeData "MOV A,M" 7 (OneByte MachineInstructions.mov_a_m) )
        , ( 0x7F, OpCodeData "MOV A,A" 5 (OneByte unimplementedInstructionZero) )
        , ( 0x80, OpCodeData "ADD B" 4 (OneByte MachineInstructions.add_b) )
        , ( 0x81, OpCodeData "ADD C" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x82, OpCodeData "ADD D" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x83, OpCodeData "ADD E" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x84, OpCodeData "ADD H" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x85, OpCodeData "ADD L" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x86, OpCodeData "ADD M" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x87, OpCodeData "ADD A" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x88, OpCodeData "ADC B" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x89, OpCodeData "ADC C" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x8A, OpCodeData "ADC D" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x8B, OpCodeData "ADC E" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x8C, OpCodeData "ADC H" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x8D, OpCodeData "ADC L" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x8E, OpCodeData "ADC M" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x8F, OpCodeData "ADC A" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x90, OpCodeData "SUB B" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x91, OpCodeData "SUB C" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x92, OpCodeData "SUB D" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x93, OpCodeData "SUB E" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x94, OpCodeData "SUB H" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x95, OpCodeData "SUB L" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x96, OpCodeData "SUB M" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x97, OpCodeData "SUB A" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x98, OpCodeData "SBB B" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x99, OpCodeData "SBB C" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x9A, OpCodeData "SBB D" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x9B, OpCodeData "SBB E" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x9C, OpCodeData "SBB H" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x9D, OpCodeData "SBB L" 4 (OneByte unimplementedInstructionZero) )
        , ( 0x9E, OpCodeData "SBB M" 7 (OneByte unimplementedInstructionZero) )
        , ( 0x9F, OpCodeData "SBB A" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xA0, OpCodeData "ANA B" 4 (OneByte MachineInstructions.ana_b) )
        , ( 0xA1, OpCodeData "ANA C" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xA2, OpCodeData "ANA D" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xA3, OpCodeData "ANA E" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xA4, OpCodeData "ANA H" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xA5, OpCodeData "ANA L" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xA6, OpCodeData "ANA M" 7 (OneByte unimplementedInstructionZero) )
        , ( 0xA7, OpCodeData "ANA A" 4 (OneByte MachineInstructions.ana_a) )
        , ( 0xA8, OpCodeData "XRA B" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xA9, OpCodeData "XRA C" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xAA, OpCodeData "XRA D" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xAB, OpCodeData "XRA E" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xAC, OpCodeData "XRA H" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xAD, OpCodeData "XRA L" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xAE, OpCodeData "XRA M" 7 (OneByte unimplementedInstructionZero) )
        , ( 0xAF, OpCodeData "XRA A" 4 (OneByte MachineInstructions.xra_a) )
        , ( 0xB0, OpCodeData "ORA B" 4 (OneByte MachineInstructions.ora_b) )
        , ( 0xB1, OpCodeData "ORA C" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xB2, OpCodeData "ORA D" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xB3, OpCodeData "ORA E" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xB4, OpCodeData "ORA H" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xB5, OpCodeData "ORA L" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xB6, OpCodeData "ORA M" 7 (OneByte MachineInstructions.ora_m) )
        , ( 0xB7, OpCodeData "ORA A" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xB8, OpCodeData "CMP B" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xB9, OpCodeData "CMP C" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xBA, OpCodeData "CMP D" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xBB, OpCodeData "CMP E" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xBC, OpCodeData "CMP H" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xBD, OpCodeData "CMP L" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xBE, OpCodeData "CMP M" 7 (OneByte unimplementedInstructionZero) )
        , ( 0xBF, OpCodeData "CMP A" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xC0, OpCodeData "RNZ" 11 (OneByte MachineInstructions.rnz) )
        , ( 0xC1, OpCodeData "POP B" 10 (OneByte MachineInstructions.pop_b) )
        , ( 0xC2, OpCodeData "JNZ adr" 10 (ThreeBytes MachineInstructions.jnz) )
        , ( 0xC3, OpCodeData "JMP adr" 10 (ThreeBytes MachineInstructions.jmp) )
        , ( 0xC4, OpCodeData "CNZ adr" 17 (ThreeBytes MachineInstructions.cnz) )
        , ( 0xC5, OpCodeData "PUSH B" 11 (OneByte MachineInstructions.push_b) )
        , ( 0xC6, OpCodeData "ADI D8" 7 (TwoBytes MachineInstructions.adi_d8) )
        , ( 0xC7, OpCodeData "RST 0" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xC8, OpCodeData "RZ" 11 (OneByte MachineInstructions.rz) )
        , ( 0xC9, OpCodeData "RET" 10 (OneByte MachineInstructions.ret) )
        , ( 0xCA, OpCodeData "JZ adr" 10 (ThreeBytes MachineInstructions.jz) )
        , ( 0xCB, OpCodeData "-" 0 (OneByte unknownInstruction) )
        , ( 0xCC, OpCodeData "CZ adr" 10 (ThreeBytes MachineInstructions.cz) )
        , ( 0xCD, OpCodeData "CALL adr" 17 (ThreeBytes MachineInstructions.call) )
        , ( 0xCE, OpCodeData "ACI D8" 7 (TwoBytes unimplementedInstructionOne) )
        , ( 0xCF, OpCodeData "RST 1" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xD0, OpCodeData "RNC" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xD1, OpCodeData "POP D" 10 (OneByte MachineInstructions.pop_d) )
        , ( 0xD2, OpCodeData "JNC adr" 10 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xD3, OpCodeData "OUT D8" 10 (TwoBytes IO.io_out) )
        , ( 0xD4, OpCodeData "CNC adr" 17 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xD5, OpCodeData "PUSH D" 11 (OneByte MachineInstructions.push_d) )
        , ( 0xD6, OpCodeData "SUI D8" 7 (TwoBytes unimplementedInstructionOne) )
        , ( 0xD7, OpCodeData "RST 2" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xD8, OpCodeData "RC" 11 (OneByte MachineInstructions.rc) )
        , ( 0xD9, OpCodeData "-" 0 (OneByte unknownInstruction) )
        , ( 0xDA, OpCodeData "JC adr" 10 (ThreeBytes MachineInstructions.jc) )
        , ( 0xDB, OpCodeData "IN D8" 10 (TwoBytes IO.io_in) )
        , ( 0xDC, OpCodeData "CC adr" 10 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xDD, OpCodeData "-" 0 (OneByte unknownInstruction) )
        , ( 0xDE, OpCodeData "SBI D8" 7 (TwoBytes unimplementedInstructionOne) )
        , ( 0xDF, OpCodeData "RST 3" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xE0, OpCodeData "RPO" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xE1, OpCodeData "POP H" 10 (OneByte MachineInstructions.pop_h) )
        , ( 0xE2, OpCodeData "JPO adr" 10 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xE3, OpCodeData "XTHL" 18 (OneByte unimplementedInstructionZero) )
        , ( 0xE4, OpCodeData "CPO adr" 17 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xE5, OpCodeData "PUSH H" 11 (OneByte MachineInstructions.push_h) )
        , ( 0xE6, OpCodeData "ANI D8" 7 (TwoBytes MachineInstructions.ani) )
        , ( 0xE7, OpCodeData "RST 4" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xE8, OpCodeData "RPE" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xE9, OpCodeData "PCHL" 5 (OneByte unimplementedInstructionZero) )
        , ( 0xEA, OpCodeData "JPE adr" 10 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xEB, OpCodeData "XCHG" 5 (OneByte MachineInstructions.xchg) )
        , ( 0xEC, OpCodeData "CPE adr" 17 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xED, OpCodeData "-" 0 (OneByte unknownInstruction) )
        , ( 0xEE, OpCodeData "XRI D8" 7 (TwoBytes unimplementedInstructionOne) )
        , ( 0xEF, OpCodeData "RST 5" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xF0, OpCodeData "RP" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xF1, OpCodeData "POP PSW" 10 (OneByte MachineInstructions.pop_psw) )
        , ( 0xF2, OpCodeData "JP adr" 10 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xF3, OpCodeData "DI" 4 (OneByte unimplementedInstructionZero) )
        , ( 0xF4, OpCodeData "CP adr" 17 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xF5, OpCodeData "PUSH PSW" 11 (OneByte MachineInstructions.push_psw) )
        , ( 0xF6, OpCodeData "ORI D8" 7 (TwoBytes MachineInstructions.ori_d8) )
        , ( 0xF7, OpCodeData "RST 6" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xF8, OpCodeData "RM" 11 (OneByte unimplementedInstructionZero) )
        , ( 0xF9, OpCodeData "SPHL" 5 (OneByte unimplementedInstructionZero) )
        , ( 0xFA, OpCodeData "JM adr" 10 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xFB, OpCodeData "EI" 4 (OneByte MachineInstructions.ei) )
        , ( 0xFC, OpCodeData "CM adr" 17 (ThreeBytes unimplementedInstructionTwo) )
        , ( 0xFD, OpCodeData "-" 0 (OneByte unknownInstruction) )
        , ( 0xFE, OpCodeData "CPI D8" 7 (TwoBytes MachineInstructions.cpi) )
        , ( 0xFF, OpCodeData "RST 7" 11 (OneByte unimplementedInstructionZero) )
        ]


getOpCodeFromTable : ByteValue -> Maybe OpCode
getOpCodeFromTable opCodeByte =
    Dict.get opCodeByte opCodeTable
        |> Maybe.map (\metaInfo -> OpCode opCodeByte metaInfo)
