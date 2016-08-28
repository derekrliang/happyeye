'use strict';
/*jslint node: true */
/*jshint expr: true*/

require('app-module-path').addPath(process.env.PWD + '/lib/js');


var chai = require("chai"),
    expect = chai.expect,
    should = chai.should();

chai.should();

describe('configger', function() {
    var conf = require("configger");

    it('should read key config', function() {
        var sensors = conf.get('Sensors');

        expect(sensors).to.have.property('SensorSamplingRate');
        expect(sensors.SensorSamplingRate).to.be.a('number');

        expect(sensors).to.have.property('ButtonAbove');
        expect(sensors.ButtonAbove).to.have.property('Pin');
        expect(sensors.ButtonAbove.Pin).to.be.a('number');

        expect(sensors).to.have.property('ButtonBelow');
        expect(sensors.ButtonBelow).to.have.property('Pin');
        expect(sensors.ButtonBelow.Pin).to.be.a('number');

        expect(sensors).to.have.property('ButtonAverage');
        expect(sensors.ButtonAverage).to.have.property('Pin');
        expect(sensors.ButtonAverage.Pin).to.be.a('number');

        expect(conf.get('HAPPYMETERHOST')).not.to.be.empty;
        expect(conf.get('HAPPYAPI')).not.to.be.empty;
        expect(conf.get('HAPPYTAGS')).not.to.be.empty;

    });

});
