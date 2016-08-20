'use strict';
/*jslint node: true */

require('app-module-path').addPath(process.env.PWD + '/lib/js');

var hat = require("hatworker");
var config = require("configger");

//happyDocument constructor
function happyDocument (happystatus,timestamp,tags,sensorTemp,sensorLight) {
 /*jshint validthis:true */
 this.happystatus = happystatus;
 this.timestamp = timestamp;
 this.tags = tags;
 this.sensorTemp = sensorTemp;
 this.sensorLight = sensorLight;
}
exports.happyDocument = happyDocument; 

//Filling happyDocument with key values and triggering the function to read and fill from sensors
happyDocument.prototype.fillWithSensorValues = function (happyStatus, lightLevel) {

  this.happystatus = happyStatus;
  this.timestamp = Date.now();
  this.tags = config.get('HAPPYTAGS');

  this.sensorLight = lightLevel;

  hat.readSensors(happyDocument.hatValues);

};

//Filling with sensorvalues from senseHat. Primary callback for hatworker
happyDocument.prototype.hatValues = function (sensorValues) {
  if (sensorValues) {
    var sensorData = JSON.parse(sensorValues);
    this.sensorTemp = sensorData.temp;
  } else {
    this.sensorTemp = -99;
  }
};


