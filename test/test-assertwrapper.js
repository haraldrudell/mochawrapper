// test-assertwrapper.js
// © Harald Rudell 2012

var assert = require('../lib/assertwrapper')
// http://nodejs.org/api/util.html
var util = require('util')
// http://nodejs.org/api/assert.html
var assert0 = require('assert')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

/*
assert exports:
{ [Function: ok]
  AssertionError: 
   { [Function: AssertionError]
     super_: 
      { [Function: Error]
        captureStackTrace: [Function: captureStackTrace],
        stackTraceLimit: 10 } },
  fail: [Function: fail],
  ok: [Circular],
  equal: [Function: equal],
  notEqual: [Function: notEqual],
  deepEqual: [Function: deepEqual],
  notDeepEqual: [Function: notDeepEqual],
  strictEqual: [Function: strictEqual],
  notStrictEqual: [Function: notStrictEqual],
  throws: [Function],
  doesNotThrow: [Function],
  ifError: [Function] }
*/
//console.log(assert)

exports['Assertion messages with expected and actual values:'] = {
	'verify assertwrapper exports': function () {
		assert.equal(Object.keys(assert).length - 1, Object.keys(assert0).length,
			'number of exports different')
	},
	'assert() should be updated': function () {
		//assert0(false)
		//assert0(false, 'message')
		var input = false
		verifyUpdatedMessage(input, function () {
			assert(input, 'message')
		})
	},
	'assert() update can be ignored': function () {
		var exception
		var input = false
		var invert = true
		verifyUpdatedMessage(input, function () {
			assert(input, 'message', false)
		}, invert)
	},
	'assert.ok should be updated': function () {
		var exception
		var input = false
		verifyUpdatedMessage(input, function () {
			assert.ok(input, 'message')
		})
	},
}

function verifyUpdatedMessage(input, f, invert) {
	var exception
	var key = 'actual value:\n' + input
	try {
		f()
	} catch(e) {
		exception = e
	}
	assert(exception, 'assert did not throw exception', false)
	var contains = ~exception.message.indexOf(key)
	var msg = invert ?
		'assert message should not contain:' :
		'assert message should contain:'
	if (invert) contains = !contains
	assert(contains, msg +
		haraldutil.inspectAll(key) + ': ' +
		haraldutil.inspectAll(exception.message),
		false)
}