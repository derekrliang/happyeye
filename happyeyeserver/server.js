var express = require("express");
var cors = require("cors");
var bodyParser = require('body-parser');
var validator = require('node-validator');
var moment = require('moment');

var app = express();

var elastic = require('./elasticsearch');

var port = normalizePort(process.env.PORT || '3000');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Handling request towards /happy
// Post is expecting 'application/x-www-form-urlencoded'

app.post("/api/storehappydocument", function (req, res) {
    var tagsToStore = [];
    var happydocument = JSON.parse(JSON.stringify(req.body));

    console.log('Got server:post /api/storehappydocument ' + req.ip + ' ' + JSON.stringify(req.body));

    //Overriding timestamp 
    if (happydocument.timestamp === null || happydocument.timestamp === undefined) {
        happydocument.timestamp = Date.now()
    } else {
        happydocument.timestamp = Date.now()
    };

    //Define validation check for document
    var check = validator.isObject()
    .withRequired('happystatus', validator.isString({ regex: /above|average|below/ }))
    .withRequired('timestamp', validator.isDate({format: 'x'}))
    .withOptional('tags', validator.isString())
    .withOptional('sensorValues',validator.isObject()
        .withOptional('temperature', validator.isNumber({allowString: true}))
        .withOptional('barometricPressure', validator.isNumber({allowString: true}))
        .withOptional('relativeHumidity', validator.isNumber({allowString: true}))
        .withOptional('lightLevel', validator.isNumber({allowString: true}))
    );

    if (happydocument.tags === null || happydocument.tags === undefined) {
        tagsToStore = processTags(req.body.tags);
        happydocument.tags = tagsToStore;
        console.log('Processing tags  storing ' + happydocument.tags);
    }
    
    validator.run(check, happydocument, function(errorCount, errors) {
     
       if (errorCount <= 0) {
            if (!(elastic.addDocument(happydocument))) {
                console.log('(Failed to store) Server:post /happy ' + req.ip + ' ' + JSON.stringify(happydocument));
                res.status(500).send("Failed to store happy status");
            } else {
                console.log('(Stored) Server:post /happy ' + req.ip + ' ' + JSON.stringify(happydocument));
                res.status(200).send("Happy status stored successfully");
            }
       } else {
         console.log('Document failed validation ' + JSON.stringify(errors));  
         res.status(500).send("Invalid format on document");
       };

    });
   
}
);

// API for deep linking tabs
// URL /api/storemoodandtag/mood/tag
// mood = {above,average,below}
// tag = {anyvalidtag}
app.get("/api/storemoodandtag/*", function (req, res) {
    console.log('Server:get /api/storemoodandtag');

    var urlArr = req.url.split("/");
    var happystatus = (urlArr[3] || '');
    var tag = (urlArr[4] || '');

    console.log('Server:get /api/storemoodandtag ip:' + req.ip + ' happystatus:' + happystatus + ' tag:' + tag);

    //verifying a valid tag
    var tagsToStore = processTags(tag);
    if (tagsToStore.length <= 0) {
        console.log('Sending 400-invalid tag format for :' + tag);
        res.status(400).send("Invalid tag format (" + tag + ')');
        return;
    }

    //verifying a valid mood - happystatus
    if (!((happystatus === 'average') || (happystatus === 'below') || happystatus === 'above')) {
        console.log('Sending 400-invalid happystatus for :' + happystatus);
        res.status(400).send("Invalid happystatus format (" + happystatus + ')');
        return;
    }

    //By now we should able to store the request - let's give it a try :)
    if (!(elastic.addDocument(happystatus, tagsToStore))) {
        console.log('(Failed to store) Server:get /api/storemoodandtag ip:' + req.ip + ' happystatus:' + happystatus + ' tag:' + tag);
        res.status(500).send("Failed to store happy status");
    } else {
        console.log('(Stored) Server:get /api/storemoodandtag ip:' + req.ip + ' happystatus:' + happystatus + ' tag:' + tag);
        res.status(200).send("Happy status stored successfully");
    }
});


// API for getting top 10 tags
app.get("/api/tags/top10", function (req, res) {
    console.log('Server:get /api/tags/top10/ ip:' + req.ip);

    elastic.listTop10Tags(function(tagsList) {
     console.log("/api/tags/top10/ returns " + JSON.stringify(tagsList));
     res.status(200).send(tagsList); 
    });

});


// A bit of error response on most used urls
app.get("/", function (req, res) {
    console.log('Server:get / (501, Not implemented)');
    res.status(501).send('Not implemented');
});

app.post("/", function (req, res) {
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

function processTags(tagString) {

    var minTagLength = 3;
    var tagsToStore = [];

    var lowerTags = tagString.toLowerCase();
    var tagsSplit = lowerTags.split(" ");

    console.log('Processing tags: ' + tagString);
    tagsSplit.forEach(function (arrayItem) {
        var testPatteren = new RegExp("^[a-zA-Z0-9]+$");

        if (testPatteren.test(arrayItem)) {
            if (arrayItem.length >= minTagLength) {
                tagsToStore.push(arrayItem);
            } else {
                console.log('Discarding tag: ' + arrayItem + ' (too short)');
            }
        } else {
            console.log('Discarding tag: ' + arrayItem + ' (illegal chars)');
        }
    });

    console.log('Tags that will be stored: ' + tagsToStore);
    return tagsToStore;

}