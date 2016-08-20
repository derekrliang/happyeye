from sense_hat import SenseHat
import time

sense = SenseHat()
sense.set_rotation(180)
var = 1

X = [255, 0, 0]  # Red
O = [255, 255, 255]  # White

question_mark = [
O, O, O, O, O, O, O, O,
O, X, X, O, O, X, X, O,
O, X, X, O, O, X, X, O,
O, O, O, O, O, O, O, O,
O, O, O, O, O, O, O, O,
O, X, O, O, O, O, X, O,
O, O, X, X, X, X, O, O,
O, O, O, X, X, O, O, O
]


while (1 == 1) :
    print("%s Temperature" % sense.temp)
    print("%s Temp - humidity sensor" % sense.get_temperature_from_humidity())
    print("%s Temp - pressure sensor" % sense.get_temperature_from_pressure())
    print("%s Pressure: in Millibars" % sense.get_pressure())
    print("%s Humidity" % sense.get_humidity())

    north = sense.get_compass()
    print("%s Degrees to north" % north)

    raw = sense.get_accelerometer_raw()
    print("Acc intensity in Gs x: {x}, y: {y}, z: {z}".format(**raw))

    m = '%.1f' % sense.temp
    sense.show_message(m, text_colour=[255, 0, 0])
    print("*********")
    sense.set_pixels(question_mark)
    time.sleep(1)
    
