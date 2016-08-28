'use strict';
/*jslint node: true */

require('app-module-path').addPath(process.env.PWD + '/lib/js');

var hat = require("hatworker");
var config = require("configger");
var request = require("request");



//happyDocument constructor
function happyDocument(happystatus, timestamp, tags, sensorValues) {
    /*jshint validthis:true */
    this.happystatus = happystatus;
    this.timestamp = timestamp;
    this.tags = tags;
    this.sensorValues = sensorValues;
}
exports.happyDocument = happyDocument;

//Sending happydocument to happymeter
happyDocument.prototype.sendToHappymeter = function(callback) {
    var happyHost = config.get('HAPPYMETERHOST');
    var happyApiPath = config.get('HAPPYAPI');
    var happyTag = config.get('HAPPYTAGS');

    var apiPath = happyHost + happyApiPath;
    request.post(apiPath, {
        form: happyDocument
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            console.log('Stored happystatus ' + apiPath);
        } else {
            console.log('Unable to store happystatus' + error);
        }
        callback(response.statusCode);
    });

};

//An object for storing sensor values
function sensorValues(temperature, relativeHumidity, barometricPressure, lightLevel) {
    /*jshint validthis:true */
    this.temperature = temperature;
    this.relativeHumidity = relativeHumidity;
    this.barometricPressure = barometricPressure;
    this.lightLevel = lightLevel;
}
exports.sensorValues = sensorValues;
