module Disassembler exposing (main)

import Browser
import Bytes exposing (Bytes)
import Bytes.Decode as Decode
import File exposing (File)
import File.Select as Select
import Html exposing (Html, button, p, text)
import Html.Attributes exposing (style)
import Html.Events exposing (onClick)
import Task



-- MAIN


main : Program () Model Msg
main =
    Browser.element
        { init = init
        , view = view
        , update = update
        , subscriptions = subscriptions
        }



-- MODEL


type alias Model =
    { data : Maybe Bytes
    }


init : () -> ( Model, Cmd Msg )
init _ =
    ( Model Nothing, Cmd.none )



-- UPDATE


type Msg
    = RomRequested
    | RomSelected File
    | RomLoaded Bytes


update : Msg -> Model -> ( Model, Cmd Msg )
update msg model =
    case msg of
        RomRequested ->
            ( model
            , Select.file [ "application/any" ] RomSelected
            )

        RomSelected file ->
            ( model
            , Task.perform RomLoaded (File.toBytes file)
            )

        RomLoaded content ->
            ( { model | data = Just content }
            , Cmd.none
            )



-- VIEW


type alias OpCodeType =
    { hexCode : Int
    , name : String
    , numberOfArguments : Int
    }


type InstructionType
    = ZeroArgInstruction
        { opCode : OpCodeType
        }
    | OneArgInstruction
        { opCode : OpCodeType
        , firstArg : Int
        }
    | TwoArgInstruction
        { opCode : OpCodeType
        , firstArg : Int
        , secondArg : Int
        }


type alias Instruction =
    { address : Int
    , instruction : InstructionType
    }


type alias DisassembledProgram =
    List Instruction


decodeFile : Bytes -> List Int
decodeFile rawData =
    let
        listDecoder =
            bytesListDecoder Decode.unsignedInt8 (Bytes.width rawData)
    in
    Maybe.withDefault [] (Decode.decode listDecoder rawData)


bytesListDecoder : Decode.Decoder a -> Int -> Decode.Decoder (List a)
bytesListDecoder decoder len =
    Decode.loop ( len, [] ) (listStep decoder)


listStep : Decode.Decoder a -> ( Int, List a ) -> Decode.Decoder (Decode.Step ( Int, List a ) (List a))
listStep decoder ( n, xs ) =
    if n <= 0 then
        Decode.succeed (Decode.Done xs)

    else
        Decode.map (\x -> Decode.Loop ( n - 1, xs ++ [x] )) decoder

hexToString : Int -> String
hexToString num =
    String.fromList <|
        if num < 0 then
            '-' :: unsafePositiveToDigits [] (negate num)

        else
            unsafePositiveToDigits [] num


{-| ONLY EVER CALL THIS WITH POSITIVE INTEGERS!
-}
unsafePositiveToDigits : List Char -> Int -> List Char
unsafePositiveToDigits digits num =
    if num < 16 then
        unsafeToDigit num :: digits

    else
        unsafePositiveToDigits (unsafeToDigit (modBy 16 num) :: digits) (num // 16)


{-| ONLY EVER CALL THIS WITH INTEGERS BETWEEN 0 and 15!
-}
unsafeToDigit : Int -> Char
unsafeToDigit num =
    case num of
        0 ->
            '0'

        1 ->
            '1'

        2 ->
            '2'

        3 ->
            '3'

        4 ->
            '4'

        5 ->
            '5'

        6 ->
            '6'

        7 ->
            '7'

        8 ->
            '8'

        9 ->
            '9'

        10 ->
            'a'

        11 ->
            'b'

        12 ->
            'c'

        13 ->
            'd'

        14 ->
            'e'

        15 ->
            'f'

        _ ->
            -- if this ever gets called with a number over 15, it will never
            -- terminate! If that happens, debug further by uncommenting this:
            --
            -- Debug.todo ("Tried to convert " ++ toString num ++ " to hexadecimal.")
            unsafeToDigit num


disassemble : Bytes -> String
disassemble data =
    let
        decodedValues =
            decodeFile data
    in
    String.join "\n" (List.map hexToString decodedValues)


view : Model -> Html Msg
view model =
    case model.data of
        Nothing ->
            button [ onClick RomRequested ] [ text "Load ROM" ]

        Just content ->
            p [ style "white-space" "pre" ] [ text (disassemble content) ]



-- SUBSCRIPTIONS


subscriptions : Model -> Sub Msg
subscriptions _ =
    Sub.none
