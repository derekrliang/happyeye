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

describe('happydocument', function() {
  var happydoc = require("happydocument");
  
 
    it('should create a happy document with correct properties', function() {
      var happy = new happydoc.happyDocument();
      
      expect(happy).to.have.property('happystatus');   
      expect(happy).to.have.property('timestamp');   
      expect(happy).to.have.property('tags');
      expect(happy).to.have.property('sensorTemp');
      expect(happy).to.have.property('sensorLight');      
    });

   it('should fill a happy document with sensor values', function() {
      //var hat = require("hatworker");
      var happy = new happydoc.happyDocument();

      sinon.stub(happy.fillWithSensorValues.prototype,'hat.readSensors()', function(callback) {
        happy.hatValues('{"temp": 101.1}');
      });

      sinon.spy(happy.fillWithSensorValues);

      happy.fillWithSensorValues('Above',200.1);

      expect(happy.fillWithSensorValues.calledOnce).to.be.true;
    
     /* 
      expect(hat.readSensors).to.be.called;
      expect(hat.showHat).to.be.called;
      expect(hat.hatValues).to.be.called;

      
      expect(happy.happystatus).to.be.equal('Above');
      expect(happy.timestamp).not.to.be.empty;
      expect(happy.tags).to.be.equal(config.get('HAPPYTAGS'));
      expect(happy.sensorTemp).to.be.equal(101.1);
      expect(happy.sensorLight).to.be.equal(200.1);

      hat.readSensors.restore();
      */

    });

  it.skip('should send a happy document', function() {
      
    });

});



