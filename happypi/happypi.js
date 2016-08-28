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

//Making vars for sensors that we will send globals 
var temperature, relativeHumidity, barometricPressure, lightLevel;

//
var idleHandler, iAmIdle = false;

board.on("ready", function() {
    var happy = new happydoc.happyDocument();
    var showRadarOn = false; // Toggle for handling the radar info on the sensehat pixels
    var showRadarOff = false; // Toggle for handling the radar info on the sensehat pixels

    //Some logics to handle the event that the buttons fire on auto one time when the board is init
    var btnAboveFirstFired = false;
    var btnAverageFirstFired = false;
    var btnBelowFirstFired = false;

    console.log("Board ready");

    setIdleTimer(true);

    // Defining sensors
    // Proximity sensor (Remember pingfirmata)

    var radar = new five.Proximity({
        controller: "HCSR04",
        freq: sensorsConfig.SensorSamplingRate,
        pin: sensorsConfig.Radar.Pin
    });

    temperature = new five.Thermometer({
        controller: "BME280",
        freq: sensorsConfig.SensorSamplingRate,
        address: 0x76
    });

    relativeHumidity = new five.Hygrometer({
        controller: "BME280",
        freq: sensorsConfig.SensorSamplingRate,
        address: 0x76
    });

    barometricPressure = new five.Barometer({
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

    lightLevel = new five.Sensor({
        pin: sensorsConfig.LightLevel.Pin,
        freq: sensorsConfig.SensorSamplingRate
    });

    // Handling of key events

    btnAbove.on("down", function() {
        if (btnAboveFirstFired) {
            fillAndSend("above", happy);
            setIdleTimer(false);
        } else {
            btnAboveFirstFired = true;
            console.log('BtnAbove first fired');
        }
    });

    btnBelow.on("press", function() {
        if (btnBelowFirstFired) {
            fillAndSend("below", happy);
            setIdleTimer(false);
        } else {
            btnBelowFirstFired = true;
            console.log('BtnBelow first fired');
        }
    });

    btnAverage.on("press", function() {
        if (btnAverageFirstFired) {
            fillAndSend("average", happy);
            setIdleTimer(false);    
        } else {
            btnAverageFirstFired = true;
            console.log('BtnAverage first fired');
        }
    });

    // Handling proximity radar
    radar.on("data", function() {
     if (iAmIdle) {   
        if ((this.cm < sensorsConfig.Radar.TriggerDist) && (this.cm > 0)) {
            if (!showRadarOn) {
                hat.showHat("flag");
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
     }
    });

});

function setIdleTimer(operation) {

    if (operation) {
        idleHandler = setInterval(function() {
           iAmIdle = true;
        },config.get('IdleTimer'))
    } else if (!operation) {
        clearInterval(idleHandler);
        iAmIdle = false;
    }
};



function fillAndSend(happyStatus, happy, sensors) {
    hat.showHat("clear");

    var sensorValues = new happydoc.sensorValues();
    sensorValues.temperature = temperature.celsius;
    sensorValues.relativeHumidity = relativeHumidity.relativeHumidity;
    sensorValues.barometricPressure = barometricPressure.pressure;
    sensorValues.lightLevel = lightLevel.value;

    happy.happystatus = happyStatus;
    happy.sensorValues = sensorValues;

    happy.sendToHappymeter(function callback(responseCode) {
        if (responseCode === 200) {
            switch (happyStatus) {
                case "above":
                    hat.showHat("above");
                    setIdleTimer(true);
                    break;
                case "below":
                    hat.showHat("below");
                    setIdleTimer(true);
                    break;
                case "average":
                    hat.showHat("average");
                    setIdleTimer(true); 
                    break;
                default:
                    hat.showHat("clear");
                    setIdleTimer(true);  
                    break;
            }
        } else {
            hat.show("stop");
        }
    });


}
