module LogicFlagsTest exposing (..)

import Expect
import LogicFlags exposing (flags_ZSP)
import MachineInstructions exposing (logic_flags_a, setFlagAC, setFlagCY, setFlagP, setFlagS, setFlagZ)
import Test exposing (Test, describe, test)


all : Test
all =
    describe "LogicFlags"
        [ describe "logic_flags_a"
            [ test "for newA=0" <|
                \() ->
                    let
                        newA =
                            0

                        expectedMachineStateDiffEvents =
                            [ setFlagCY False
                            , setFlagAC False
                            , setFlagZ True
                            , setFlagS False
                            , setFlagP True
                            ]
                    in
                    Expect.equal (logic_flags_a newA) expectedMachineStateDiffEvents
            , test "for newA=255" <|
                \() ->
                    let
                        newA =
                            255

                        expectedMachineStateDiffEvents =
                            [ setFlagCY False
                            , setFlagAC False
                            , setFlagZ False
                            , setFlagS True
                            , setFlagP False
                            ]
                    in
                    Expect.equal (logic_flags_a newA) expectedMachineStateDiffEvents
            , test "for newA=256" <|
                \() ->
                    let
                        newA =
                            256

                        expectedMachineStateDiffEvents =
                            [ setFlagCY False
                            , setFlagAC False
                            , setFlagZ False
                            , setFlagS False
                            , setFlagP True
                            ]
                    in
                    Expect.equal (logic_flags_a newA) expectedMachineStateDiffEvents
            ]
        , describe "flags_ZSP"
            [ test "0" <|
                \() ->
                    let
                        value =
                            0

                        expectedEvents =
                            [ setFlagZ True
                            , setFlagS False
                            , setFlagP True
                            ]
                    in
                    Expect.equal expectedEvents (flags_ZSP value)
            , test "2" <|
                \() ->
                    let
                        value =
                            2

                        expectedEvents =
                            [ setFlagZ False
                            , setFlagS False
                            , setFlagP True
                            ]
                    in
                    Expect.equal expectedEvents (flags_ZSP value)
            , test "133" <|
                \() ->
                    let
                        value =
                            133

                        expectedEvents =
                            [ setFlagZ False
                            , setFlagS True
                            , setFlagP False
                            ]
                    in
                    Expect.equal expectedEvents (flags_ZSP value)
            ]
        ]
