module CpuDiag exposing (..)

import BitOperations exposing (getAddressLE)
import EmulatorState exposing (ByteValue, MachineState, MachineStateDiff(..), Memory)
import MachineInstructions exposing (call, getC, getD, getE, getMemory, getPC, setPC)
import Memory



-- Used to patch loaded cpudiag.bin


patchDecodedFile : List ByteValue -> List ByteValue
patchDecodedFile decodedFile =
    let
        start =
            List.take 111 decodedFile

        endOne =
            List.drop 112 decodedFile

        withDAA =
            List.concat
                [ [ 0xC3, 0x00, 0x01 ], List.repeat 253 0, start, [ 0x07 ], endOne ]
    in
    List.concat [ List.take 0x059C withDAA, [ 0xC3, 0xC2, 0x05 ], List.drop 0x059F withDAA ]


call_debug : ByteValue -> ByteValue -> MachineState -> MachineStateDiff
call_debug firstArg secondArg machineState =
    let
        address =
            getAddressLE firstArg secondArg
    in
    if address == 5 then
        if getC machineState == 9 then
            let
                offset =
                    getAddressLE (getE machineState) (getD machineState)

                printResult =
                    print "" offset (getMemory machineState)
            in
            if printResult == 0 then
                Failed (Just machineState) "FAILED"

            else
                Events
                    [ setPC (getPC machineState + printResult) ]

        else
            Events [ setPC (getPC machineState + 3) ]

    else if address == 0 then
        Events (Debug.log "finished" [ setPC (getPC machineState + 3) ])

    else
        call firstArg secondArg machineState


print : String -> Int -> Memory -> Int
print string offset memory =
    let
        memoryAccess =
            Memory.readMemory (offset + 3) memory
    in
    case memoryAccess of
        Memory.Valid byteValue ->
            let
                newChar =
                    Char.fromCode byteValue

                newString =
                    String.fromChar newChar
            in
            if string == " CPU HAS FAILED! ERROR EXIT=" then
                Debug.log (String.concat [ string, newString ]) 0

            else if newChar == '$' then
                Debug.log (String.concat [ string, newString ]) 3

            else
                print (String.concat [ string, newString ]) (offset + 1) memory

        Memory.Invalid _ ->
            0
