'use strict';
/*jslint node: true */

require('app-module-path').addPath(process.env.PWD + '/lib/js');

var hat = require("hatworker");
var config = require("configger");
var request = require("request");

//happyDocument constructor
function happyDocument(happystatus, timestamp, tags, sensorTemp, sensorLight) {
	/*jshint validthis:true */
	this.happystatus = happystatus;
	this.timestamp = timestamp;
	this.tags = tags;
	this.sensorTemp = sensorTemp;
	this.sensorLight = sensorLight;
}
exports.happyDocument = happyDocument;

//Filling happyDocument with key values and triggering the function to read and fill from sensors
happyDocument.prototype.fillWithSensorValues = function(happyStatus, lightLevel, callback) {
	var self = this;
	
	this.happystatus = happyStatus;
	this.timestamp = Date.now();
	this.tags = config.get('HAPPYTAGS');

	this.sensorLight = lightLevel;

	hat.readSensors(function(sensorValues) {
		if (sensorValues) {
			var sensorData = JSON.parse(sensorValues);
			self.sensorTemp = sensorData.temp;
		} else {
			self.sensorTemp = -99;
		}
		callback();
	});

	//Sending happydocument to happymeter
	happyDocument.prototype.sendToHappymeter = function(callback) {
		var happyHost = config.get('HAPPYMETERHOST');
		var happyPath = config.get('HAPPYMETERPATH');
		var happyTag = config.get('HAPPYTAGS');

		var apiPath = happyHost + happyPath + '/' + this.happystatus.toLowerCase() + '/' + happyTag;

		request.get(apiPath, function(error, response, body) {
			if (!error && response.statusCode === 200) {
				console.log('Stored happystatus ' + apiPath);
			} else {
				console.log('Unable to store happystatus' + error);
			}
			callback(response.statusCode);
		});

	};

};