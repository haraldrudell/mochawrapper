// assertwrapper.js
// provides expected and actual values even if an assert message is provided
// © Harald Rudell 2012

var tracecutter = require('./tracecutter')
// http://nodejs.org/api/assert.html
var assert = require('assert')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

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
	var argArray = Array.prototype.slice.call(args)
	if (argArray.length > 2 && argArray.pop() === false) return f.apply(this, args)
	else try {
		result = f.apply(this, args)
	} catch (e) {
		if (e instanceof Error && // the exception value is an Error
			e.name == 'AssertionError') { // it is an assertion Error
			// an AssertionError has properties: name, message, actual, expected and operator

			e.message = assertMessage(
				e.actual,
				e.expected,
				e.message || '',
				e.operator)

			// and abbreviate the stack trace!
			tracecutter.cutTheTrace(e)
		}
		throw e
	}

	return result
}

/*
produce an assert message
- no truncation
- uniquely identifiable values
- both actual and expected printed on a new line
- actual and expected always included
otherwise similar to assert message
*/
function assertMessage(actual, expected, heading, operator) {
	var result = []
	if (heading) result.push('Failing test:', heading, ' ')
	result.push(
		'actual value:\n',
		haraldutil.inspectDeep(actual),
		'\nexpected value:\n',
		haraldutil.inspectDeep(expected),
		'\noperation:',
		operator || '=='
	)
	return result.join('')
}