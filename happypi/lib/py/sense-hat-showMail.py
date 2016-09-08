from sense_hat import SenseHat
import time

sense = SenseHat()
sense.set_rotation(180)
var = 1

X = [0, 0, 200]  # blue
O = [255, 255, 255]  # White

mail = [
O, O, O, O, O, O, O, O,
O, O, X, X, X, X, O, O,
O, O, X, X, X, X, O, O,
O, X, O, O, O, O, X, O,
O, X, X, O, O, X, X, O,
O, X, X, X, X, X, X, O,
O, X, X, X, X, X, X, O,
O, O, O, O, O, O, O, O
]


sense.set_pixels(mail)
#time.sleep(1)