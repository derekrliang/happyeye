var PythonShell = require('python-shell');

function showHat(image) {
  
  switch(image){
      case "smile":
        var pyshell = new PythonShell('./lib/sense-hat-showSmile.py');
      case "stop":
        var pyshell = new PythonShell('./lib/sense-hat-showStop.py'); 
      case "clear":
        var pyshell = new PythonShell('./lib/sense-hat-clear.py');
       default:         
  }
  

 };

 exports.showHat = showHat;

function readSensors(callback) {
   
   var pyshell = new PythonShell('./lib/sense-hat-sensor-values.py');
   
   pyshell.on('message',function(message){
    callback(message);
   });
 };


exports.readSensors = readSensors;
