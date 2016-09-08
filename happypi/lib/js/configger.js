'use strict';
/*jslint node: true */

var configger = require('nconf');

// Defining logger
var winston = require('winston');
var logger = new (winston.Logger)({
    transports: [
        new (winston.transports.Console)({'timestamp': true})
    ]
});

// Loading from commandline, environment and then file - with presedence!

configger.argv();
configger.env();
configger.file({
    file: './config/config.json'
});

logger.info('Config loaded');
module.exports = configger;
