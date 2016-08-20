'use strict';
/*jslint node: true */

require('app-module-path').addPath(process.env.PWD + '/lib/js');


var five = require("johnny-five");
var config = require("./lib/js/configger");
var happydoc = require("./lib/js/happydocument");
var hat = require("hatworker");
   
var board = new five.Board({
   repl: false,
   debug: false
});

var sensorsConfig = config.get('Sensors'); 
var lastLightLevel = 0;

board.on("ready", function() {

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
      freq: sensorsConfig.SensorSamplingRate});

  var btnBelow = new five.Button({
      pin: sensorsConfig.ButtonBelow.Pin,
      freq: sensorsConfig.SensorSamplingRate});

  var btnAverage = new five.Button({
      pin: sensorsConfig.ButtonAverage.Pin,
      freq: sensorsConfig.SensorSamplingRate});

// Photoresisitor for light

  var lightLevel = new five.Sensor({
    pin: sensorsConfig.LightLevel.Pin,
    freq: sensorsConfig.SensorSamplingRate
   });

// Handling of key events

  btnAbove.on("down", function() {
    happydoc.fillWithSensorValues("Above", lightLevel);
    //Send happy document?   
  });

   btnBelow.on("press", function() {
    happydoc.fillWithSensorValues("Below", lightLevel); 
  });

  btnAverage.on("press", function() {
    happydoc.fillWithSensorValues("Average", lightLevel); 
  });

 // Handling proximity radar

  radar.on("data", function() {
    if (this.cm < sensorsConfig.Radar.TriggerDist) {
     hat.showHat("stop");
    } else {
     hat.showHat("clear");
    }
  });


 //Gather light level and store in global
  lightLevel.on("data", function() {
   lastLightLevel = + this.value;
  });

});
