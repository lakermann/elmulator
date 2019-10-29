module CpuValidator exposing (validate)

import EmulatorState exposing (EmulatorState(..), MachineState)


validate : MachineState -> EmulatorState
validate machineState =
    if
        (machineState.step
            == 100
            && (machineState.cpuState.a
                    /= 0xF8
                    || machineState.cpuState.b
                    /= 0xF1
                    || machineState.cpuState.c
                    /= 0x00
                    || machineState.cpuState.d
                    /= 0x1B
                    || machineState.cpuState.e
                    /= 0x0F
                    || machineState.cpuState.h
                    /= 0x20
                    || machineState.cpuState.l
                    /= 0x0F
                    || machineState.cpuState.pc
                    /= 0x1A32
                    || machineState.cpuState.sp
                    /= 0x23FE
                    || machineState.cpuState.conditionCodes.ac
                    /= False
                    || machineState.cpuState.conditionCodes.cy
                    /= False
                    || machineState.cpuState.conditionCodes.s
                    /= True
                    || machineState.cpuState.conditionCodes.p
                    /= False
                    || machineState.cpuState.conditionCodes.z
                    /= False
               )
        )
            || (machineState.step
                    == 150
                    && (machineState.cpuState.a
                            /= 0x0C
                            || machineState.cpuState.b
                            /= 0xE9
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1B
                            || machineState.cpuState.e
                            /= 0x17
                            || machineState.cpuState.h
                            /= 0x20
                            || machineState.cpuState.l
                            /= 0x17
                            || machineState.cpuState.pc
                            /= 0x1A34
                            || machineState.cpuState.sp
                            /= 0x23FE
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= False
                            || machineState.cpuState.conditionCodes.s
                            /= True
                            || machineState.cpuState.conditionCodes.p
                            /= False
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 175
                    && (machineState.cpuState.a
                            /= 0x30
                            || machineState.cpuState.b
                            /= 0xE5
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1B
                            || machineState.cpuState.e
                            /= 0x1B
                            || machineState.cpuState.h
                            /= 0x20
                            || machineState.cpuState.l
                            /= 0x1C
                            || machineState.cpuState.pc
                            /= 0x1A35
                            || machineState.cpuState.sp
                            /= 0x23FE
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= False
                            || machineState.cpuState.conditionCodes.s
                            /= True
                            || machineState.cpuState.conditionCodes.p
                            /= False
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 1000
                    && (machineState.cpuState.a
                            /= 0x14
                            || machineState.cpuState.b
                            /= 0x5B
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1B
                            || machineState.cpuState.e
                            /= 0xA5
                            || machineState.cpuState.h
                            /= 0x20
                            || machineState.cpuState.l
                            /= 0xA5
                            || machineState.cpuState.pc
                            /= 0x1A32
                            || machineState.cpuState.sp
                            /= 0x23FE
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= False
                            || machineState.cpuState.conditionCodes.s
                            /= False
                            || machineState.cpuState.conditionCodes.p
                            /= False
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 1500
                    && (machineState.cpuState.a
                            /= 0x00
                            || machineState.cpuState.b
                            /= 0x08
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1B
                            || machineState.cpuState.e
                            /= 0xF8
                            || machineState.cpuState.h
                            /= 0x20
                            || machineState.cpuState.l
                            /= 0xF8
                            || machineState.cpuState.pc
                            /= 0x1A34
                            || machineState.cpuState.sp
                            /= 0x23FE
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= False
                            || machineState.cpuState.conditionCodes.s
                            /= False
                            || machineState.cpuState.conditionCodes.p
                            /= True
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 2000
                    && (machineState.cpuState.a
                            /= 0x24
                            || machineState.cpuState.b
                            /= 0x00
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1C
                            || machineState.cpuState.e
                            /= 0x00
                            || machineState.cpuState.h
                            /= 0x24
                            || machineState.cpuState.l
                            /= 0x5A
                            || machineState.cpuState.pc
                            /= 0x1A5F
                            || machineState.cpuState.sp
                            /= 0x23FC
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= True
                            || machineState.cpuState.conditionCodes.s
                            /= True
                            || machineState.cpuState.conditionCodes.p
                            /= True
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 3000
                    && (machineState.cpuState.a
                            /= 0x25
                            || machineState.cpuState.b
                            /= 0x00
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1C
                            || machineState.cpuState.e
                            /= 0x00
                            || machineState.cpuState.h
                            /= 0x25
                            || machineState.cpuState.l
                            /= 0x22
                            || machineState.cpuState.pc
                            /= 0x1A5F
                            || machineState.cpuState.sp
                            /= 0x23FC
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= True
                            || machineState.cpuState.conditionCodes.s
                            /= True
                            || machineState.cpuState.conditionCodes.p
                            /= False
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 6000
                    && (machineState.cpuState.a
                            /= 0x27
                            || machineState.cpuState.b
                            /= 0x00
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1C
                            || machineState.cpuState.e
                            /= 0x00
                            || machineState.cpuState.h
                            /= 0x27
                            || machineState.cpuState.l
                            /= 0x7A
                            || machineState.cpuState.pc
                            /= 0x1A5F
                            || machineState.cpuState.sp
                            /= 0x23FC
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= True
                            || machineState.cpuState.conditionCodes.s
                            /= True
                            || machineState.cpuState.conditionCodes.p
                            /= False
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 9000
                    && (machineState.cpuState.a
                            /= 0x29
                            || machineState.cpuState.b
                            /= 0x00
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1C
                            || machineState.cpuState.e
                            /= 0x00
                            || machineState.cpuState.h
                            /= 0x29
                            || machineState.cpuState.l
                            /= 0xD2
                            || machineState.cpuState.pc
                            /= 0x1A5F
                            || machineState.cpuState.sp
                            /= 0x23FC
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= True
                            || machineState.cpuState.conditionCodes.s
                            /= True
                            || machineState.cpuState.conditionCodes.p
                            /= False
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 12000
                    && (machineState.cpuState.a
                            /= 0x2C
                            || machineState.cpuState.b
                            /= 0x00
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1C
                            || machineState.cpuState.e
                            /= 0x00
                            || machineState.cpuState.h
                            /= 0x2C
                            || machineState.cpuState.l
                            /= 0x2A
                            || machineState.cpuState.pc
                            /= 0x1A5F
                            || machineState.cpuState.sp
                            /= 0x23FC
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= True
                            || machineState.cpuState.conditionCodes.s
                            /= True
                            || machineState.cpuState.conditionCodes.p
                            /= True
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 15000
                    && (machineState.cpuState.a
                            /= 0x2E
                            || machineState.cpuState.b
                            /= 0x00
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1C
                            || machineState.cpuState.e
                            /= 0x00
                            || machineState.cpuState.h
                            /= 0x2E
                            || machineState.cpuState.l
                            /= 0x82
                            || machineState.cpuState.pc
                            /= 0x1A5F
                            || machineState.cpuState.sp
                            /= 0x23FC
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= True
                            || machineState.cpuState.conditionCodes.s
                            /= True
                            || machineState.cpuState.conditionCodes.p
                            /= True
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 30000
                    && (machineState.cpuState.a
                            /= 0x3A
                            || machineState.cpuState.b
                            /= 0x00
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1C
                            || machineState.cpuState.e
                            /= 0x00
                            || machineState.cpuState.h
                            /= 0x3A
                            || machineState.cpuState.l
                            /= 0x3A
                            || machineState.cpuState.pc
                            /= 0x1A5F
                            || machineState.cpuState.sp
                            /= 0x23FC
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= True
                            || machineState.cpuState.conditionCodes.s
                            /= True
                            || machineState.cpuState.conditionCodes.p
                            /= True
                            || machineState.cpuState.conditionCodes.z
                            /= False
                       )
               )
            || (machineState.step
                    == 45000
                    && (machineState.cpuState.a
                            /= 0x3F
                            || machineState.cpuState.b
                            /= 0x00
                            || machineState.cpuState.c
                            /= 0x00
                            || machineState.cpuState.d
                            /= 0x1F
                            || machineState.cpuState.e
                            /= 0xB0
                            || machineState.cpuState.h
                            /= 0x3E
                            || machineState.cpuState.l
                            /= 0x01
                            || machineState.cpuState.pc
                            /= 0x0ADE
                            || machineState.cpuState.sp
                            /= 0x23FE
                            || machineState.cpuState.conditionCodes.ac
                            /= False
                            || machineState.cpuState.conditionCodes.cy
                            /= False
                            || machineState.cpuState.conditionCodes.s
                            /= False
                            || machineState.cpuState.conditionCodes.p
                            /= False
                            || machineState.cpuState.conditionCodes.z
                            /= True
                       )
               )
    then
        Invalid (Just machineState) ("Invalid state, step=" ++ String.fromInt machineState.step)

    else
        Valid machineState
