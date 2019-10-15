module OpCode exposing (MachineState(..), OpCode, OpCodeLength(..), OpCodeMetaData, getOpCodeFromTable, getOpCodeLength)

import CpuState exposing (CpuState, MachineStateDiff(..), MachineStateDiffEvent(..))
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
    , impl : CpuState -> MachineStateDiff
    }


type alias OpCode =
    { hexCode : Int
    , information : OpCodeMetaData
    }


type MachineState
    = Valid CpuState
    | Invalid (Maybe CpuState) String


unimplementedInstruction : CpuState -> MachineStateDiff
unimplementedInstruction cpuState =
    Failed (Just cpuState) "not implemented yet"


opCodeTable : Dict Int OpCodeMetaData
opCodeTable =
    Dict.fromList
        [ ( 0x00, OpCodeMetaData "NOP" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x01, OpCodeMetaData "LXI B,D16" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x02, OpCodeMetaData "STAX B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x03, OpCodeMetaData "INX B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x04, OpCodeMetaData "INR B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x05, OpCodeMetaData "DCR B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x06, OpCodeMetaData "MVI B, D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x07, OpCodeMetaData "RLC" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , --(0x08, OpCodeMetaInformation "-" 0),
          ( 0x09, OpCodeMetaData "DAD B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x0A, OpCodeMetaData "LDAX B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x0B, OpCodeMetaData "DCX B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x0C, OpCodeMetaData "INR C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x0D, OpCodeMetaData "DCR C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x0E, OpCodeMetaData "MVI C,D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x0F, OpCodeMetaData "RRC" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , --(0x10, OpCodeMetaInformation "-" 0),
          ( 0x11, OpCodeMetaData "LXI D,D16" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x12, OpCodeMetaData "STAX D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x13, OpCodeMetaData "INX D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x14, OpCodeMetaData "INR D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x15, OpCodeMetaData "DCR D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x16, OpCodeMetaData "MVI D, D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x17, OpCodeMetaData "RAL" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , --(0x18, OpCodeMetaInformation "-" 0),
          ( 0x19, OpCodeMetaData "DAD D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x1A, OpCodeMetaData "LDAX D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x1B, OpCodeMetaData "DCX D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x1C, OpCodeMetaData "INR E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x1D, OpCodeMetaData "DCR E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x1E, OpCodeMetaData "MVI E,D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x1F, OpCodeMetaData "RAR" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x20, OpCodeMetaData "RIM" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x21, OpCodeMetaData "LXI H,D16" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x22, OpCodeMetaData "SHLD adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x23, OpCodeMetaData "INX H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x24, OpCodeMetaData "INR H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x25, OpCodeMetaData "DCR H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x26, OpCodeMetaData "MVI H,D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x27, OpCodeMetaData "DAA" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , --(0x28, OpCodeMetaInformation "-" 0),
          ( 0x29, OpCodeMetaData "DAD H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x2A, OpCodeMetaData "LHLD adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x2B, OpCodeMetaData "DCX H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x2C, OpCodeMetaData "INR L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x2D, OpCodeMetaData "DCR L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x2E, OpCodeMetaData "MVI L, D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x2F, OpCodeMetaData "CMA" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x30, OpCodeMetaData "SIM" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x31, OpCodeMetaData "LXI SP, D16" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x32, OpCodeMetaData "STA adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x33, OpCodeMetaData "INX SP" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x34, OpCodeMetaData "INR M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x35, OpCodeMetaData "DCR M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x36, OpCodeMetaData "MVI M,D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x37, OpCodeMetaData "STC" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , --(0x38, OpCodeMetaInformation "-" 0),
          ( 0x39, OpCodeMetaData "DAD SP" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x3A, OpCodeMetaData "LDA adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x3B, OpCodeMetaData "DCX SP" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x3C, OpCodeMetaData "INR A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x3D, OpCodeMetaData "DCR A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x3E, OpCodeMetaData "MVI A,D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x3F, OpCodeMetaData "CMC" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x40, OpCodeMetaData "MOV B,B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x41, OpCodeMetaData "MOV B,C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x42, OpCodeMetaData "MOV B,D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x43, OpCodeMetaData "MOV B,E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x44, OpCodeMetaData "MOV B,H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x45, OpCodeMetaData "MOV B,L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x46, OpCodeMetaData "MOV B,M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x47, OpCodeMetaData "MOV B,A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x48, OpCodeMetaData "MOV C,B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x49, OpCodeMetaData "MOV C,C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x4A, OpCodeMetaData "MOV C,D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x4B, OpCodeMetaData "MOV C,E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x4C, OpCodeMetaData "MOV C,H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x4D, OpCodeMetaData "MOV C,L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x4E, OpCodeMetaData "MOV C,M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x4F, OpCodeMetaData "MOV C,A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x50, OpCodeMetaData "MOV D,B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x51, OpCodeMetaData "MOV D,C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x52, OpCodeMetaData "MOV D,D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x53, OpCodeMetaData "MOV D,E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x54, OpCodeMetaData "MOV D,H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x55, OpCodeMetaData "MOV D,L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x56, OpCodeMetaData "MOV D,M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x57, OpCodeMetaData "MOV D,A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x58, OpCodeMetaData "MOV E,B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x59, OpCodeMetaData "MOV E,C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x5A, OpCodeMetaData "MOV E,D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x5B, OpCodeMetaData "MOV E,E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x5C, OpCodeMetaData "MOV E,H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x5D, OpCodeMetaData "MOV E,L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x5E, OpCodeMetaData "MOV E,M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x5F, OpCodeMetaData "MOV E,A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x60, OpCodeMetaData "MOV H,B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x61, OpCodeMetaData "MOV H,C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x62, OpCodeMetaData "MOV H,D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x63, OpCodeMetaData "MOV H,E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x64, OpCodeMetaData "MOV H,H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x65, OpCodeMetaData "MOV H,L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x66, OpCodeMetaData "MOV H,M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x67, OpCodeMetaData "MOV H,A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x68, OpCodeMetaData "MOV L,B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x69, OpCodeMetaData "MOV L,C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x6A, OpCodeMetaData "MOV L,D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x6B, OpCodeMetaData "MOV L,E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x6C, OpCodeMetaData "MOV L,H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x6D, OpCodeMetaData "MOV L,L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x6E, OpCodeMetaData "MOV L,M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x6F, OpCodeMetaData "MOV L,A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x70, OpCodeMetaData "MOV M,B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x71, OpCodeMetaData "MOV M,C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x72, OpCodeMetaData "MOV M,D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x73, OpCodeMetaData "MOV M,E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x74, OpCodeMetaData "MOV M,H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x75, OpCodeMetaData "MOV M,L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x76, OpCodeMetaData "HLT" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x77, OpCodeMetaData "MOV M,A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x78, OpCodeMetaData "MOV A,B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x79, OpCodeMetaData "MOV A,C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x7A, OpCodeMetaData "MOV A,D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x7B, OpCodeMetaData "MOV A,E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x7C, OpCodeMetaData "MOV A,H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x7D, OpCodeMetaData "MOV A,L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x7E, OpCodeMetaData "MOV A,M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x7F, OpCodeMetaData "MOV A,A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x80, OpCodeMetaData "ADD B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x81, OpCodeMetaData "ADD C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x82, OpCodeMetaData "ADD D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x83, OpCodeMetaData "ADD E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x84, OpCodeMetaData "ADD H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x85, OpCodeMetaData "ADD L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x86, OpCodeMetaData "ADD M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x87, OpCodeMetaData "ADD A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x88, OpCodeMetaData "ADC B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x89, OpCodeMetaData "ADC C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x8A, OpCodeMetaData "ADC D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x8B, OpCodeMetaData "ADC E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x8C, OpCodeMetaData "ADC H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x8D, OpCodeMetaData "ADC L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x8E, OpCodeMetaData "ADC M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x8F, OpCodeMetaData "ADC A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x90, OpCodeMetaData "SUB B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x91, OpCodeMetaData "SUB C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x92, OpCodeMetaData "SUB D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x93, OpCodeMetaData "SUB E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x94, OpCodeMetaData "SUB H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x95, OpCodeMetaData "SUB L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x96, OpCodeMetaData "SUB M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x97, OpCodeMetaData "SUB A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x98, OpCodeMetaData "SBB B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x99, OpCodeMetaData "SBB C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x9A, OpCodeMetaData "SBB D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x9B, OpCodeMetaData "SBB E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x9C, OpCodeMetaData "SBB H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x9D, OpCodeMetaData "SBB L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x9E, OpCodeMetaData "SBB M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0x9F, OpCodeMetaData "SBB A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xA0, OpCodeMetaData "ANA B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xA1, OpCodeMetaData "ANA C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xA2, OpCodeMetaData "ANA D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xA3, OpCodeMetaData "ANA E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xA4, OpCodeMetaData "ANA H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xA5, OpCodeMetaData "ANA L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xA6, OpCodeMetaData "ANA M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xA7, OpCodeMetaData "ANA A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xA8, OpCodeMetaData "XRA B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xA9, OpCodeMetaData "XRA C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xAA, OpCodeMetaData "XRA D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xAB, OpCodeMetaData "XRA E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xAC, OpCodeMetaData "XRA H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xAD, OpCodeMetaData "XRA L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xAE, OpCodeMetaData "XRA M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xAF, OpCodeMetaData "XRA A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xB0, OpCodeMetaData "ORA B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xB1, OpCodeMetaData "ORA C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xB2, OpCodeMetaData "ORA D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xB3, OpCodeMetaData "ORA E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xB4, OpCodeMetaData "ORA H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xB5, OpCodeMetaData "ORA L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xB6, OpCodeMetaData "ORA M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xB7, OpCodeMetaData "ORA A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xB8, OpCodeMetaData "CMP B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xB9, OpCodeMetaData "CMP C" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xBA, OpCodeMetaData "CMP D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xBB, OpCodeMetaData "CMP E" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xBC, OpCodeMetaData "CMP H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xBD, OpCodeMetaData "CMP L" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xBE, OpCodeMetaData "CMP M" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xBF, OpCodeMetaData "CMP A" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xC0, OpCodeMetaData "RNZ" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xC1, OpCodeMetaData "POP B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xC2, OpCodeMetaData "JNZ adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xC3, OpCodeMetaData "JMP adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xC4, OpCodeMetaData "CNZ adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xC5, OpCodeMetaData "PUSH B" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xC6, OpCodeMetaData "ADI D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xC7, OpCodeMetaData "RST 0" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xC8, OpCodeMetaData "RZ" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xC9, OpCodeMetaData "RET" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xCA, OpCodeMetaData "JZ adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , --(0xcb, OpCodeMetaInformation "-" 0),
          ( 0xCC, OpCodeMetaData "CZ adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xCD, OpCodeMetaData "CALL adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xCE, OpCodeMetaData "ACI D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xCF, OpCodeMetaData "RST 1" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xD0, OpCodeMetaData "RNC" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xD1, OpCodeMetaData "POP D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xD2, OpCodeMetaData "JNC adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xD3, OpCodeMetaData "OUT D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xD4, OpCodeMetaData "CNC adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xD5, OpCodeMetaData "PUSH D" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xD6, OpCodeMetaData "SUI D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xD7, OpCodeMetaData "RST 2" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xD8, OpCodeMetaData "RC" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , --(0xd9, OpCodeMetaInformation "-" 0),
          ( 0xDA, OpCodeMetaData "JC adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xDB, OpCodeMetaData "IN D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xDC, OpCodeMetaData "CC adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , --(0xdd, OpCodeMetaInformation "-" 0),
          ( 0xDE, OpCodeMetaData "SBI D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xDF, OpCodeMetaData "RST 3" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xE0, OpCodeMetaData "RPO" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xE1, OpCodeMetaData "POP H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xE2, OpCodeMetaData "JPO adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xE3, OpCodeMetaData "XTHL" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xE4, OpCodeMetaData "CPO adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xE5, OpCodeMetaData "PUSH H" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xE6, OpCodeMetaData "ANI D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xE7, OpCodeMetaData "RST 4" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xE8, OpCodeMetaData "RPE" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xE9, OpCodeMetaData "PCHL" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xEA, OpCodeMetaData "JPE adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xEB, OpCodeMetaData "XCHG" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xEC, OpCodeMetaData "CPE adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , --(0xed, OpCodeMetaInformation "-" 0),
          ( 0xEE, OpCodeMetaData "XRI D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xEF, OpCodeMetaData "RST 5" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xF0, OpCodeMetaData "RP" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xF1, OpCodeMetaData "POP PSW" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xF2, OpCodeMetaData "JP adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xF3, OpCodeMetaData "DI" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xF4, OpCodeMetaData "CP adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xF5, OpCodeMetaData "PUSH PSW" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xF6, OpCodeMetaData "ORI D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xF7, OpCodeMetaData "RST 6" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xF8, OpCodeMetaData "RM" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xF9, OpCodeMetaData "SPHL" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xFA, OpCodeMetaData "JM adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xFB, OpCodeMetaData "EI" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xFC, OpCodeMetaData "CM adr" ThreeBytes (\cpuState -> unimplementedInstruction cpuState) )
        , --(0xfd, OpCodeMetaInformation "-" 0),
          ( 0xFE, OpCodeMetaData "CPI D8" TwoBytes (\cpuState -> unimplementedInstruction cpuState) )
        , ( 0xFF, OpCodeMetaData "RST 7" OneByte (\cpuState -> unimplementedInstruction cpuState) )
        ]


getOpCodeFromTable : Int -> Maybe OpCode
getOpCodeFromTable opCodeByte =
    Dict.get opCodeByte opCodeTable
        |> Maybe.map (\metaInfo -> OpCode opCodeByte metaInfo)
