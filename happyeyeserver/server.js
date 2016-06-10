var express = require("express");
var cors = require("cors");
var bodyParser = require('body-parser');
var app = express();

var elastic = require('./elasticsearch');

var port = normalizePort(process.env.PORT || '3000');

app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));
app.use(cors());

//Handling request towards /happy
// Post is expecting 'application/x-www-form-urlencoded'

app.post("/happy", function (req, res) {
    var tagsToStore = [];

    console.log('Server:post /happy ' + req.ip + ' ' + JSON.stringify(req.body));

    if (!(req.body.happystatus)) {
        console.log('(400, Invalid format) Server:post /happy ' + req.ip + ' ' + JSON.stringify(req.body));
        res.status(400).send("Invalid format");
    } else {
        if (!((req.body.happystatus === 'average') || (req.body.happystatus === 'below') || (req.body.happystatus === 'above'))) {
            console.log('(400, Invalid format) Server:post /happy ' + req.ip + ' ' + JSON.stringify(req.body));
            res.status(400).send("Invalid format");
        } else {

            if (req.body.tags) {
                tagsToStore = processTags(req.body.tags);
            }

            if (!(elastic.addDocument(req.body.happystatus, tagsToStore))) {
                console.log('(Failed to store) Server:post /happy ' + req.ip + ' ' + JSON.stringify(req.body));
                res.status(500).send("Failed to store happy status");
            } else {
                console.log('(Stored) Server:post /happy ' + req.ip + ' ' + req.body.happystatus + ' : ' + tagsToStore);
                res.status(200).send("Happy status stored successfully");
            }
        }
    }

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