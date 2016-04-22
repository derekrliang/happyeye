var express = require("express");
var bodyParser = require('body-parser');
var app = express();

var elastic = require('./elasticsearch');

var port = normalizePort(process.env.PORT || '3000');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

app.use(function(req, res, next) {
  res.header("Access-Control-Allow-Origin", "*");
  res.header("Access-Control-Allow-Headers", "Origin, X-Requested-With, Content-Type, Accept");
  next();
});

//Handling request towards /happy
// Post is expecting 'application/x-www-form-urlencoded'

app.post("/happy", function(req, res) {
    console.log('Server:post /happy ' + req.ip + ' ' + JSON.stringify(req.body));

    /*do some rudamentary checking - could be moved to elastic module next
     explore the express-validator module?
     expected format is 
            {happystatus: 'average'|'below'|'above'}  
    */

    if (!(req.body.happystatus)) {
        console.log('(400, Invalid format) Server:post /happy ' + req.ip + ' ' + JSON.stringify(req.body));
        res.status(400).send("Invalid format");
    } else {
        if (!((req.body.happystatus === 'average') || (req.body.happystatus === 'below') || (req.body.happystatus === 'above'))) {
            console.log('(400, Invalid format) Server:post /happy ' + req.ip + ' ' + JSON.stringify(req.body));
            res.status(400).send("Invalid format");
        } else {
            if (!(elastic.addDocument(req.body.happystatus))) {
                console.log('(Failed to store) Server:post /happy ' + req.ip + ' ' + JSON.stringify(req.body));
                res.status(500).send("Failed to store happy status");
            } else {
                console.log('(Stored) Server:post /happy ' + req.ip + ' ' + JSON.stringify(req.body));
                res.status(200).send("Happy status stored successfully");
            }
        }
    }

}
);


app.get("/happy", function(req, res) {
    console.log('Server:get /happy ' + req.ip + ' ' + JSON.stringify(req.query.happystatus));
   
  /* Refactor with post - above */  
  if (!(req.query.happystatus)) {
        console.log('(400, Invalid format) Server:get /happy ' + req.ip + ' ' + JSON.stringify(req.query));
        res.status(400).send("Invalid format");
    } else {
        if (!((req.query.happystatus === 'average') || (req.query.happystatus === 'below') || (req.query.happystatus === 'above'))) {
            console.log('(400, Invalid format) Server:post /get ' + req.ip + ' ' + JSON.stringify(req.query));
            res.status(400).send("Invalid format");
        } else {
            if (!(elastic.addDocument(req.query.happystatus))) {
                console.log('(Failed to store) Server:get /happy ' + req.ip + ' ' + JSON.stringify(req.query));
                res.status(500).send("Failed to store happy status");
            } else {
                console.log('(Stored) Server:get /happy ' + req.ip + ' ' + JSON.stringify(req.query));
                res.status(200).send("Happy status stored successfully");
            }
        }
    }      
});


// A bit of error response on most used urls
app.get("/", function(req, res) {
    console.log('Server:get / (501, Not implemented)');
    res.status(501).send('Not implemented');
});

app.post("/", function(req, res) {
    console.log('Server:post / (501, Not implemented)');
    res.status(501).send('Not implemented');
});

app.listen(port);

console.log("Server is ready and listening on port " + port);


/* Normalize a port into a number, string, or false */

function normalizePort(val) {
    var port = parseInt(val, 10);

    if (isNaN(port)) {
        // named pipe
        return val;
    }

    if (port >= 0) {
        // port number
        return port;
    }

    return false;
}
