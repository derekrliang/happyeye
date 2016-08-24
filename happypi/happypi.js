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
var lastLightLevel = 0;

board.on("ready", function() {
  var happy = new happydoc.happyDocument();
  var showRadarOn = false; // Toggle for handling the radar info on the sensehat pixels
  var showRadarOff = false; // Toggle for handling the radar info on the sensehat pixels


  console.log("Board ready");

  // Defining sensors
  // Proximity sensor (Remember pingfirmata)

  var radar = new five.Proximity({
    controller: "HCSR04",
    freq: sensorsConfig.SensorSamplingRate,
    pin: sensorsConfig.Radar.Pin
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

  var lightLevel = new five.Sensor({
    pin: sensorsConfig.LightLevel.Pin,
    freq: sensorsConfig.SensorSamplingRate
  });

  // Handling of key events

  btnAbove.on("down", function() {
    fillAndSend("above", happy, lastLightLevel);
  });

  btnBelow.on("press", function() {
    fillAndSend("below", happy, lastLightLevel);
  });

  btnAverage.on("press", function() {
    fillAndSend("average", happy, lastLightLevel);
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
    lastLightLevel = +this.value;
  });

});

function fillAndSend(happyStatus, happy, lastLightLevel) {
  hat.showHat("clear");
  happy.fillWithSensorValues(happyStatus, lastLightLevel, function callback() {

    if (happy.sensorTemp) {
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

  });
}