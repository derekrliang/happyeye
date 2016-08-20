from sense_hat import SenseHat

import time
import sys

sense = SenseHat()
sense.set_rotation(180)

for v in sys.argv[1:]:
    sense.show_message(v, text_colour=[255, 0, 0])
    
