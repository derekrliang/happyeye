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
    logger.info('Defining happydocument');
}
exports.happyDocument = happyDocument;

//Sending happydocument to happymeter
happyDocument.prototype.sendToHappymeter = function(callback) {
    var happyHost = config.get('HAPPYMETERHOST');
    var happyApiPath = config.get('HAPPYAPI');
    var happyTag = config.get('HAPPYTAGS');

    var apiPath = happyHost + happyApiPath;

    this.tags = happyTag;
    this.timestamp = Date.now();

    logger.info('Ready to send happydocument', this)
    request.post(apiPath, {
        form: this
    }, function(error, response, body) {
        if (!error && response.statusCode === 200) {
            logger.info('Stored happystatus ' + apiPath);
            callback(response.statusCode);
        } else {
            logger.info('Unable to store happystatus at ' + apiPath);
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
