var PythonShell = require('python-shell');
 

var pyshell = new PythonShell('sense-hat-sensor-values.py');

var documentA;

// sends a message to the Python script via stdin
pyshell.send('hello');

pyshell.on('message', function (message) {
  // received a message sent from the Python script (a simple "print" statement)
  documentA = JSON.parse(message);
  //console.log(document.temp);

    var options = {
    //  mode: 'text',
    //  pythonPath: 'path/to/python',
    //  pythonOptions: ['-u'],
    //  scriptPath: 'path/to/my/scripts',
    args: [documentA.temp]
    };


    PythonShell.run('sense-hat-showmessage.py', options, function (err) {
    if (err) throw err;
    console.log('finished');
    });



});

// end the input stream and allow the process to exit
pyshell.end(function (err) {
  if (err) throw err;
  //console.log('finished');
});





