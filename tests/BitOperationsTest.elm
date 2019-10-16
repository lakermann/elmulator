module BitOperationsTest exposing (..)

import BitOperations
import Expect
import Test exposing (..)

all : Test
all =
    describe "BitOperations"
        [ describe "getAddressLE"
            [ test "..." <|
                \() ->
                let
                    low = 0xc3
                    high = 0x18
                in
                Expect.equal (0x18c3) (BitOperations.getAddressLE low high)
            ]
        ]