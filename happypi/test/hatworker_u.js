'use strict';
/*jslint node: true */
/*jshint expr: true*/

require('app-module-path').addPath(process.env.PWD + '/lib/js');

var chai = require("chai"),
    expect = chai.expect,
    sinon = require("sinon"),
    should = chai.should();

chai.should();

var config = require("configger");

describe('hatworker', function() {
    var hat = require("hatworker");
    //var PythonShell = require('python-shell');

    it('should show a image', function() {

        sinon.spy(hat, 'showHat');

        //sinon.stub(PythonShell);

        hat.showHat('smile');
        expect(hat.showHat.calledOnce).to.be.true;
        expect(hat.showHat.calledWith('smile')).to.be.true;

        hat.showHat('above');
        expect(hat.showHat.calledTwice).to.be.true;
        expect(hat.showHat.calledWith('above')).to.be.true;

    });

    it('should read sensor values', function() {

        sinon.stub(hat, 'readSensors', function(callback) {
            callback('{"temp": 101.1}');
        });

        hat.readSensors(function callback(message) {
            var sensorData = JSON.parse(message);
            expect(sensorData.temp).to.equal(101.1);
        });

        expect(hat.readSensors.calledOnce).to.be.true;


    });

});
