'use strict';
/*jslint node: true */

var PythonShell = require('python-shell');

function showHat(image) {

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
        case "clear":
            var pyshellClear = new PythonShell('./lib/py/sense-hat-clear.py');
            break;
        default:
    }
}
exports.showHat = showHat;

function readSensors(callback) {
    var pyshell = new PythonShell('./lib/py/sense-hat-sensor-values.py');

    pyshell.on('message', function(message) {
        callback(message);
    });

}
exports.readSensors = readSensors;
