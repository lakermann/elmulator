module PswTests exposing (..)

import Cpu
import Expect
import MachineState exposing (ConditionCodes)
import Psw
import Test exposing (..)


all : Test
all =
    describe "Psw"
        [ describe "createPsw"
            [ test "default (init)" <|
                \() ->
                    let
                        conditionCodes =
                            Cpu.initConditionCodes
                    in
                    conditionCodes
                        |> Psw.createPSW
                        |> Expect.equal 2
            , test "Flag S" <|
                \() ->
                    let
                        conditionCodes =
                            Cpu.initConditionCodes
                    in
                    { conditionCodes | s = True }
                        |> Psw.createPSW
                        |> Expect.equal 130
            , test "Flag Z" <|
                \() ->
                    let
                        conditionCodes =
                            Cpu.initConditionCodes
                    in
                    { conditionCodes | z = True }
                        |> Psw.createPSW
                        |> Expect.equal 66
            , test "Flag AC" <|
                \() ->
                    let
                        conditionCodes =
                            Cpu.initConditionCodes
                    in
                    { conditionCodes | ac = True }
                        |> Psw.createPSW
                        |> Expect.equal 18
            , test "Flag P" <|
                \() ->
                    let
                        conditionCodes =
                            Cpu.initConditionCodes
                    in
                    { conditionCodes | p = True }
                        |> Psw.createPSW
                        |> Expect.equal 6
            , test "Flag CY" <|
                \() ->
                    let
                        conditionCodes =
                            Cpu.initConditionCodes
                    in
                    { conditionCodes | cy = True }
                        |> Psw.createPSW
                        |> Expect.equal 3
            , test "Flag [S, Z, AC, P, CY]" <|
                \() ->
                    let
                        conditionCodes =
                            Cpu.initConditionCodes
                    in
                    { conditionCodes | s = True, z = True, ac = True, p = True, cy = True }
                        |> Psw.createPSW
                        |> Expect.equal 215
            ]
        ]
