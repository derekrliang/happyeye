'use strict';
/*jslint node: true */
/*jshint expr: true*/

require('app-module-path').addPath(process.env.PWD + '/lib/js');

var chai = require("chai"),
   expect = chai.expect,
   sinon = require("sinon"),
   should = chai.should();

chai.should();

var config = require("hatworker");

describe('hatworker', function() {
    var hat = require("hatworker");
   
    it('should show a image', function() {
      
      sinon.spy(hat,'showHat');
      
      hat.showHat('smile');

      expect(hat.showHat.calledOnce).to.be.true;
      expect(hat.showHat.calledWith('smile')).to.be.true;

    });

   it.skip('should read sensor values', function() {
     
    var callback = sinon.spy(function (message) {
       var sensorData = JSON.parse(message);

       expect(sensorData).to.have.property('temp');
     });
    
     sinon.spy(hat,'readSensors');
     
     hat.readSensors(callback);

     expect(hat.readSensors.calledOnce).to.be.true;
     expect(hat.readSensors.calledOn(callback)).to.be.true;
     expect(callback.calledOnce).to.be.true;

    });

});



