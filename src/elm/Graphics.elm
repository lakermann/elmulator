module Graphics exposing (..)

import Array exposing (Array)
import Bitwise
import Canvas exposing (Renderable, rect, shapes)
import Canvas.Settings exposing (fill)
import Color
import EmulatorState exposing (ByteValue)


type PixelColor
    = Black
    | White


type Pixel
    = Pixel Int Int PixelColor


type alias Screen =
    List Pixel


renderScreen : Screen -> List Renderable
renderScreen screen =
    List.map renderPixel screen


renderPixel : Pixel -> Renderable
renderPixel pixel =
    let
        (Pixel y x pixelColor) =
            pixel

        color =
            case pixelColor of
                Black ->
                    Color.black

                White ->
                    Color.white

        position =
            ( toFloat x, toFloat y )

        width =
            1

        height =
            1
    in
    shapes [ fill color ]
        [ rect position width height ]


toPixels : Array ByteValue -> List Pixel
toPixels bytes =
    let
        memoryRowIndices =
            List.range 0 224
    in
    List.map (createPixelRow bytes) memoryRowIndices
        |> List.foldl (++) []


createPixelRow : Array ByteValue -> Int -> List Pixel
createPixelRow bytes memoryRowIndex =
    let
        memoryColumnIndices =
            List.map (\x -> x * 8) (List.range 0 32)
    in
    List.map (createSinglePixel bytes memoryRowIndex) memoryColumnIndices
        |> List.foldl (++) []


createSinglePixel : Array ByteValue -> Int -> Int -> List Pixel
createSinglePixel bytes memoryRowIndex memoryColumnIndex =
    let
        pixelIndex =
            calculateMemoryPixelIndex memoryRowIndex memoryColumnIndex

        byte =
            Array.get pixelIndex bytes

        ( displayRowIndex, displayColumnIndex ) =
            calculateDisplayIndices memoryRowIndex memoryColumnIndex
    in
    case byte of
        Just value ->
            oneByteToPixel displayRowIndex displayColumnIndex value

        Nothing ->
            []


calculateMemoryPixelIndex : Int -> Int -> Int
calculateMemoryPixelIndex memoryRowIndex memoryColumnIndex =
    memoryRowIndex * (256 // 8) + (memoryColumnIndex // 8)


calculateDisplayIndices : Int -> Int -> ( Int, Int )
calculateDisplayIndices memoryRowIndex memoryColumnIndex =
    let
        x =
            255 - memoryColumnIndex

        y =
            memoryRowIndex
    in
    ( x, y )


oneByteToPixel : Int -> Int -> ByteValue -> List Pixel
oneByteToPixel displayRowIndex displayColumnIndex byte =
    let
        offsets =
            List.range 0 7
    in
    List.map (positionToPixel displayRowIndex displayColumnIndex byte) offsets


positionToPixel : Int -> Int -> ByteValue -> Int -> Pixel
positionToPixel displayRowIndex displayColumnIndex byte offset =
    let
        mask =
            Bitwise.shiftLeftBy offset 0x01

        maskedByte =
            Bitwise.and mask byte

        isSet =
            maskedByte /= 0

        shiftedRowIndex =
            displayRowIndex - offset

        color =
            if isSet then
                White

            else
                Black
    in
    Pixel shiftedRowIndex displayColumnIndex color
