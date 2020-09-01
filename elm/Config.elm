module Config exposing (..)


interrupt_every : Int
interrupt_every =
    round (33333.0 / speed)


clock : Float
clock =
    2000


steps_per_clock : Int
steps_per_clock =
    100000


speed : Float
speed =
    2000.0 / (toFloat steps_per_clock / clock)
