'use strict';
/*jslint node: true */

require('app-module-path').addPath(process.env.PWD + '/lib/js');


var five = require("johnny-five");
var config = require("configger");
var happydoc = require("happydocument");
var sensorlake = require("sensorlake");
var hat = require("hatworker");

var board = new five.Board({
    repl: false,
    debug: false
});

var winston = require('winston');
var logger = new(winston.Logger)({
    transports: [
        new(winston.transports.Console)({
            'timestamp': true
        })
    ]
});

var sensorsConfig = config.get('Sensors');

//Making vars for sensors that we will send globals 
var temperature, relativeHumidity, barometricPressure, lightLevel, lux;

// Some globale vars
var idleHandler, iAmIdle = false;
var motionCounter = 0;

board.on("ready", function() {
    var happy = new happydoc.happyDocument();
    var showRadarOn = false; // Toggle for handling the radar info on the sensehat pixels
    var showRadarOff = false; // Toggle for handling the radar info on the sensehat pixels

    //Some logics to handle the event that the buttons fire on auto one time when the board is init
    var btnAboveFirstFired = false;
    var btnAverageFirstFired = false;
    var btnBelowFirstFired = false;

    logger.info('Board ready');

    hat.showHat("clear");
    iAmIdle = true;
    setIdleTimer(true);

    // Defining sensors
<<<<<<< HEAD

    var motion = new five.Motion({
=======
   var motion = new five.Motion({
>>>>>>> dd497303010b07ef13936aecb9b58db09cfb9a39
        pin: sensorsConfig.Motion.Pin,
        freq: sensorsConfig.SensorSamplingRate
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

    lux = new five.Light({
        controller: "TSL2561"
    });

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
            setIdleTimer(false);
            fillAndSend("above", happy);
        } else {
            btnAboveFirstFired = true;
            logger.info('BtnAbove first fired');
        }
    });

    btnBelow.on("press", function() {
        if (btnBelowFirstFired) {
            setIdleTimer(false);
            fillAndSend("below", happy);
        } else {
            btnBelowFirstFired = true;
            logger.info('BtnBelow first fired');
        }
    });

    btnAverage.on("press", function() {
        if (btnAverageFirstFired) {
            setIdleTimer(false);
            fillAndSend("average", happy);
        } else {
            btnAverageFirstFired = true;
            logger.info('BtnAverage first fired');
        }
    });

    // Handling motion
    motion.on("calibrated", function() {
        logger.info("Motion calibrated");
        motionCounter = 0;
    });

    motion.on("motionstart", function() {
        motionCounter++;
        logger.info("Motion detected (" + motionCounter + ")");
        if (iAmIdle && !showRadarOn) {
            hat.showHat("flag");
            showRadarOn = true;
            showRadarOff = false;
        }
    });

    motion.on("motionend", function() {
        logger.info("Motion end");
        if (!showRadarOff) {
            hat.showHat("clear");
            showRadarOff = !showRadarOff;
            showRadarOn = false;
        }
    });


    //Creating a loop that could push sensor data if system is idle ....
    var sendWhileIdleLoop = setInterval(function() {
        if (iAmIdle) {
            logger.info('Pushing sensors to datalake');
            fillAndSendToSensorLake();
        }
    }, config.get('sendWhileIdleLoopTime'));


});

function setIdleTimer(operation) {
    if (operation) {
        iAmIdle = true;
        idleHandler = setInterval(function() {
            iAmIdle = true;
        }, config.get('IdleTimer'));
    } else if (!operation) {
        clearInterval(idleHandler);
        iAmIdle = false;
    }
}

function fillAndSend(happyStatus, happy) {
    hat.showHat("clear");

    var sensorValues = new happydoc.sensorValues();
    sensorValues.temperature = temperature.celsius;
    sensorValues.relativeHumidity = relativeHumidity.relativeHumidity;
    sensorValues.barometricPressure = barometricPressure.pressure;
    //sensorValues.lightLevel = lightLevel.value;
    sensorValues.lightLevel = lux.lux;
  
  
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
            hat.showHat("stop");
        }
    });
}

function fillAndSendToSensorLake() {
    hat.showHat("clear");

    var sensorData = new sensorlake.sensorData();
    var sensorValues = new sensorlake.sensorValues();
    
    sensorValues.temperature = temperature.celsius;
    sensorValues.relativeHumidity = relativeHumidity.relativeHumidity;
    sensorValues.barometricPressure = barometricPressure.pressure;
    //sensorValues.lightLevel = lightLevel.value;
    sensorValues.lightLevel = lux.lux;
    sensorValues.motions = motionCounter;


    sensorData.sensorValues = sensorValues;

    sensorData.sendToDataLake(function callback(responseCode) {
        if (responseCode === 200) {
            motionCounter = 0;
            logger.info('Successfully sendt sensordata to lake');
            hat.showHat('mail');
            setIdleTimer(true);
        } else {
            logger.info('Failed to send sensordata to lake');
            setIdleTimer(true);
            hat.showHat("stop");
        }
    });
}
