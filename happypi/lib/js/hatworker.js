'use strict';
/*jslint node: true */

// Defining logger
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({'timestamp': true})
    ]
});

var PythonShell = require('python-shell');

function showHat(image) {
    logger.info('Hatworker: Show hat image :' + image);
    switch (image) {
        case "smile":
            var pyshellSmile = new PythonShell('./lib/py/sense-hat-showSmile.py');
            break;
        case "above":
            var pyshellAbove = new PythonShell('./lib/py/sense-hat-showSmile.py');
            break;
        case "average":
            var pyshellAverage = new PythonShell('./lib/py/sense-hat-showAverage.py');
            break;
        case "below":
            var pyshellBelow = new PythonShell('./lib/py/sense-hat-showBelow.py');
            break;
        case "stop":
            var pyshellStop = new PythonShell('./lib/py/sense-hat-showStop.py');
            break;
        case "flag":
            var pyshellFlag = new PythonShell('./lib/py/sense-hat-showFlag.py');
            break;
        case "mail":
            var pyshellmail = new PythonShell('./lib/py/sense-hat-showMail.py');
            break;   
        case "rainbow":
            var pyshellrainbow = new PythonShell('./lib/py/sense-hat-showRainbow.py');
            break;        
        case "clear":
            var pyshellClear = new PythonShell('./lib/py/sense-hat-clear.py');
            break;
        default:
    }
}
exports.showHat = showHat;

function readSensors(callback) {
    var pyshell = new PythonShell('./lib/py/sense-hat-sensor-values.py');

    logger.info('Hatworker: Reading sensors from SenseHat');
    pyshell.on('message', function(message) {
        callback(message);
    });

}
exports.readSensors = readSensors;

function showMessage(message) {

     logger.info('Hatworker: Show message ' + message);
     var pyshell = new PythonShell('./lib/py/sense-hat-showmessage.py', {args: [message]}); 
}
exports.showMessage = showMessage;