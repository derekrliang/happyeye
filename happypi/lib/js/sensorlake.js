'use strict';
/*jslint node: true */

require('app-module-path').addPath(process.env.PWD + '/lib/js');


// Defining logger
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({'timestamp': true})
    ]
});

var config = require("configger");
var request = require("request");

function sensorData(timestamp, location, sensorValues) {
    /*jshint validthis:true */
    this.timestamp = timestamp;
    this.location = location;
    this.sensorValues = sensorValues;
    logger.info('Defining sensorData document');
}
exports.sensorData = sensorData;

//Sending sensorData to happymeter
sensorData.prototype.sendToDataLake = function(callback) {
    var happyHost = config.get('HAPPYMETERHOST');
    var happyApiPath = config.get('SENSORLAKEAPI');
  
    var apiPath = happyHost + happyApiPath;

    this.timestamp = Date.now();
    this.location = config.get('SENSORLOCATION');

    logger.info('Ready to send sensordata to lake ', this);
    request.post(apiPath, {
        form: this
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            logger.info('Stored sensordata in lake ' + apiPath);
            callback(response.statusCode);
        } else {
            logger.info('Unable to store sensordata in lake at ' + apiPath);
            callback(500);
        }
    });

};

//An object for storing sensor values
function sensorValues(temperature, relativeHumidity, barometricPressure, lightLevel) {
    /*jshint validthis:true */
    this.temperature = temperature;
    this.relativeHumidity = relativeHumidity;
    this.barometricPressure = barometricPressure;
    this.lightLevel = lightLevel;
    logger.info('Defining sensorValues');
}
exports.sensorValues = sensorValues;
