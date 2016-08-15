var five = require("johnny-five");
var hat = require("./hatworker");
var config = require("./configger");
   
var board = new five.Board({
   repl: false,
    debug: false
});

var sensorsConfig = config.get('Sensors'); 
var lastLightLevel = 0;

function happyDocument(happystatus,timestamp,tags,sensorTemp,sensorLight) {
 this.happystatus = happystatus;
 this.timestamp = timestamp;
 this.tags = tags;
 this.sensorTemp = sensorTemp;
 this.sensorLight = sensorLight;
}

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

  lightLevel = new five.Sensor({
    pin: sensorsConfig.LightLevel.Pin,
    freq: sensorsConfig.SensorSamplingRate
   });

// Handling of key events

  btnAbove.on("down", function() {
    createHappyDocument("Above", hat);   
  });

   btnBelow.on("press", function() {
    createHappyDocument("Below", hat); 
  });

  btnAverage.on("press", function() {
    createHappyDocument("Average", hat); 
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


function createHappyDocument(happyStatus,hatworker) {
  var happy = new happyDocument;

  happy.happystatus = happyStatus;
  happy.timestamp = Date.now();
  happy.tags = config.get('HAPPYTAGS');

  hatworker.readSensors(function callback(sensorValues) {
    if (sensorValues) {
      var sensorData = JSON.parse(sensorValues);
    }

    happy.sensorTemp = sensorData.temp;
    happy.sensorLight = lastLightLevel;

    hatworker.showHat("smile");
    console.log(happy);
  });
}

