// assertwrapper.js
// provides expected and actual values even if an assert message is provided
// © Harald Rudell 2012

// http://nodejs.org/api/assert.html
var assert = require('assert')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

/*
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

// the exported object is an alias for assert.ok
module.exports = exports = ok

// overrride appropriate functions
exports.fail = function() {
	doTest(assert.fail, arguments)
}
exports.equal = function() {
	doTest(assert.equal, arguments)
}
exports.notEqual = function() {
	doTest(assert.notEqual, arguments)
}
exports.deepEqual = function() {
	doTest(assert.deepEqual, arguments)
}
exports.strictEqual = function() {
	doTest(assert.strictEqual, arguments)
}
exports.notStrictEqual = function() {
	doTest(assert.notStrictEqual, arguments)
}
exports.ok = ok
exports.equal = function() {
	doTest(assert.equal, arguments)
}

function ok() {
	doTest(assert.ok, arguments)
}

// delegate to assert exports that we do not override
for (var p in assert) if (!exports[p]) exports[p] = assert[p]

/*
execute an assertion test
always print actual and expected, even if text is provided
print actual and expected on separate lines

f: an assert.x function
*/
function doTest(f, args) {
	var result

	// if the last argument is identical to false, do not modify message
	if (Array.prototype.slice.call(args).pop() === false) return f.apply(this, args)
	else try {
		result = f.apply(this, args)
	} catch (e) {
		if (e instanceof Error && // the exception value is an Error
			e.name == 'AssertionError' && // it is an assertion Error
			e.message) { // and message has been provided
			// an AssertionError has properties: name, message, actual, expected and operator

			// if we don't have the values in message, put them there
			if (e.message.indexOf(e.actual) == -1) {
				e.message = assertMessage(
					e.actual,
					e.expected,
					e.message,
					e.operator)
			}
		}
		throw e
	}

	return result
}

// code adapted from (node source folder)/lib/assert.js
function assertMessage(actual, expected, heading, operator) {
	var result = []
	if (heading) result.push('Failing test:', heading, ' ')
	result.push(
		'actual value:\n',
		truncate(haraldutil.inspectAll(actual), 128),
		'\nexpected value:\n',
		truncate(haraldutil.inspectAll(expected), 128),
		'\noperation:',
		operator || '=='
	)
	return result.join('')

	function replacer(key, value) {
		if (value === undefined) return '' + value
		if (typeof value === 'number' && (isNaN(value) || !isFinite(value))) return value.toString()
		if (typeof value === 'function' || value instanceof RegExp) return value.toString()
		return value
	}
	function truncate(s, n) {
		if (typeof s == 'string')  return s.length < n ? s : s.slice(0, n)
		return s
	}
}