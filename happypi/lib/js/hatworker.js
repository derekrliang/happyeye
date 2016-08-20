'use strict';
/*jslint node: true */

var PythonShell = require('python-shell');

function showHat(image) {

  switch (image) {
    case "smile":
      var pyshellSmile = new PythonShell('./lib/sense-hat-showSmile.py');
      break;
    case "stop":
      var pyshellStop = new PythonShell('./lib/sense-hat-showStop.py');
      break;
    case "clear":
      var pyshellClear = new PythonShell('./lib/sense-hat-clear.py');
      break;
    default:
  }
}
exports.showHat = showHat;

function readSensors(callback) {
   var pyshell = new PythonShell('./lib/py/sense-hat-sensor-values.py');

   pyshell.on('message', function (message) {
     callback(message);
   });

   pyshell.end(function (err) {
     if (err) {
       callback('{"temp": "-99"}');
     } else {
       callback('{"error": "false"}');
     }
   });

 }
 exports.readSensors = readSensors;
