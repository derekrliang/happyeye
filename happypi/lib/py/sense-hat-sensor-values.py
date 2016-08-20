from sense_hat import SenseHat

import time
import sys, json

sense = SenseHat()

#
#for v in sys.argv[1:]:
#    sense.show_message(v, text_colour=[255, 0, 0])#
#
 
#for line in sys.stdin:

sensor_values = '{ "temp" : "' + str(sense.temp) + '"}' 

print json.dumps(json.loads(sensor_values))
    
