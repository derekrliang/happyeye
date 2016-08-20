from sense_hat import SenseHat
import time

sense = SenseHat()
sense.set_rotation(180)
var = 1

X = [255, 0, 0]  # Red
O = [255, 255, 255]  # White

question_mark = [
O, X, X, X, X, X, X, O,
O, X, O, O, O, O, X, X,
X, O, O, O, O, X, O, X,
X, O, O, O, X, O, O, X,
X, O, O, X, O, O, O, X,
X, O, X, O, O, O, O, X,
X, X, O, O, O, O, O, X,
O, X, X, X, X, X, X, O
]


sense.set_pixels(question_mark)
time.sleep(1)
