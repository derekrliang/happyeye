'use strict';
/*jslint node: true */

require('app-module-path').addPath(process.env.PWD + '/lib/js');


var five = require("johnny-five");
var config = require("configger");
var happydoc = require("happydocument");
var hat = require("hatworker");

var board = new five.Board({
    repl: false,
    debug: false
});

var sensorsConfig = config.get('Sensors');

board.on("ready", function() {
    var happy = new happydoc.happyDocument();
    var showRadarOn = false; // Toggle for handling the radar info on the sensehat pixels
    var showRadarOff = false; // Toggle for handling the radar info on the sensehat pixels
    var sensors = new happydoc.sensorValues();

    console.log("Board ready");

    // Defining sensors
    // Proximity sensor (Remember pingfirmata)

    var radar = new five.Proximity({
        controller: "HCSR04",
        freq: sensorsConfig.SensorSamplingRate,
        pin: sensorsConfig.Radar.Pin
    });

    var temperature = new five.Thermometer({
        controller: "BME280",
        freq: sensorsConfig.SensorSamplingRate,
        address: 0x76
    });

    var relativeHumidity = new five.Hygrometer({
        controller: "BME280",
        freq: sensorsConfig.SensorSamplingRate,
        address: 0x76
    });

    var barometricPressure = new five.Barometer({
        controller: "BME280",
        freq: sensorsConfig.SensorSamplingRate,
        address: 0x76
    });

    // Not there yet
    //    var lux = new five.Light({
    //         controller: "TSL2561"
    //     });

    // Buttons
    var btnAbove = new five.Button({
        pin: sensorsConfig.ButtonAbove.Pin,
        freq: sensorsConfig.SensorSamplingRate
    });

    var btnBelow = new five.Button({
        pin: sensorsConfig.ButtonBelow.Pin,
        freq: sensorsConfig.SensorSamplingRate
    });

    var btnAverage = new five.Button({
        pin: sensorsConfig.ButtonAverage.Pin,
        freq: sensorsConfig.SensorSamplingRate
    });

    // Photoresisitor for light

    var lightLevel = new five.Sensor({
        pin: sensorsConfig.LightLevel.Pin,
        freq: sensorsConfig.SensorSamplingRate
    });

    // Handling of key events

    btnAbove.on("down", function() {
        fillAndSend("above", happy, sensors);
    });

    btnBelow.on("press", function() {
        fillAndSend("below", happy, sensors);
    });

    btnAverage.on("press", function() {
        fillAndSend("average", happy, sensors);
    });

    // Handling proximity radar


    radar.on("data", function() {
        if ((this.cm < sensorsConfig.Radar.TriggerDist) && (this.cm > 0)) {
            if (!showRadarOn) {
                hat.showHat("stop");
                showRadarOn = true;
                showRadarOff = false;
            }
        } else {
            if (!showRadarOff) {
                hat.showHat("clear");
                showRadarOff = !showRadarOff;
                showRadarOn = false;
            }
        }

    });

    //Gather light level and store in global
    lightLevel.on("data", function() {
        sensors.lightLevel = this.value;
    });

    // lux.on("data", function() {
    //     console.log('Ambient light level ' + this.level);
    // });

    temperature.on("data", function() {
        //console.log(this.celsius + "C");
        sensors.temperature = this.celsius;
    });

    relativeHumidity.on("data", function() {
        //console.log(this.relativeHumidity + "%");
        sensors.relativeHumidity = this.relativeHumidity;
    });

    barometricPressure.on("data", function() {
        //console.log(this.pressure + "kPa");
        sensors.barometricPressure = this.pressure;
    });

});

function fillAndSend(happyStatus, happy, sensors) {
    hat.showHat("clear");

    happy.sensorValues = sensors;

    if (sensors.temperature) { //This will have to be different - we can send with empty sensor values?
        happy.sendToHappymeter(function callback(responseCode) {
            if (responseCode === 200) {
                switch (happyStatus) {
                    case "above":
                        hat.showHat("above");
                        break;
                    case "below":
                        hat.showHat("below");
                        break;
                    case "average":
                        hat.showHat("average");
                        break;
                    default:
                        hat.showHat("clear");
                        break;
                }
            } else {
                hat.show("stop");
            }
        });
    }


}
