'use strict';
/*jslint node: true */

var configger = require('nconf');

// Loading from commandline, environment and then file - with presedence!

configger.argv();
configger.env();
configger.file({file: './config/config.json'});

module.exports = configger;