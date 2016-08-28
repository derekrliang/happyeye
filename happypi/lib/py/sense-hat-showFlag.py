from sense_hat import SenseHat
import time

sense = SenseHat()
sense.set_rotation(180)
var = 1

R = [255, 0, 0]  # Red
W = [255, 255, 255]  # White
B = [0, 0, 255]  # Blue

flag = [
R, R, W, B, B, W, R, R,
R, R, W, B, B, W, R, R,
W, W, W, B, B, W, W, W,
B, B, B, B, B, B, B, B,
B, B, B, B, B, B, B, B,
W, W, W, B, B, W, W, W,
R, R, W, B, B, W, R, R,
R, R, W, B, B, W, R, R
]

sense.set_pixels(flag)
#time.sleep(1)
