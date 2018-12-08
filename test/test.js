var chai = require('chai');
var sinon = require("sinon");
var sinonChai = require("sinon-chai");
chai.use(sinonChai);
var expect = chai.expect;
var should = chai.should();
var assert = chai.assert;
var animals = { pets: [ 'dog', 'cat', 'mouse' ] };
var foo = 'bar';

describe('The code Test', function() {
	beforeEach(function(){
		// optional preparation for each test
	});
	afterEach(function(){
		// optional cleanup after each testsinon.restore();
	});
	it('should test something', function(){
		var something = 1;
		// here we "expect" some condition to declare our test
		// in this case, we expect the variable to exist
		// more on the assertion syntax a little later
		expect(something).to.exist;
	});
	it('should test something_else', function(){
		var something_else = false;
		// now we test a different variable against its value
		// and expect that value to equal false
		expect(something_else).to.equal(false);
	});
	it('should test foo', function(){
		expect(foo).to.be.a('string').and.equal('bar');
	});
	it('should test animals', function(){
		expect(animals).to.have.property('pets').with.length(3);
	});
	it('should test animals again', function(){
		animals.should.have.property('pets').with.length(3);
	});
	it('should test foo a second time', function(){
		assert.equal(foo, 'bar', 'foo equal bar');
	});
});

var sum = function(a, b) {
	return a + b;
}

describe('Sum', function() {
	afterEach(function(){
		// optional cleanup after each testsinon.restore();
		sinon.restore();
	});
	var sum;

	it('should call sum', function() {
		sum = sinon.spy();

		sum(1,2);
		expect(sum).to.be.calledWith(1,2);
		expect(sum.firstCall.args[0]).to.equal(1);
	});
	// it('should return 2', function() {
	// 	sum = sinon.stub(function(){
	// 		return 2;
	// 	});

	// 	sum(1,2);
	// });
});