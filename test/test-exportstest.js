// test-exportstest.js
// © Harald Rudell 2013

var exportstest = require('../lib/exportstest')

var assert = require('../lib/assertwrapper')

exports['ExportsTest'] = {
	'Exports': function () {

		assert.equal(typeof exportstest, 'object')
		assert.equal(Object.keys(exportstest).length, 1)
		assert.equal(typeof exportstest.exportsTest, 'function')
	},
	'ExportsTest': function () {
		exportstest.exportsTest({}, 0)
	},
	'ExportsTest ModuleType': function () {
		assert.throws(function () {
			exportstest.exportsTest(5, 0)
		}, /incorrect type/)
		assert.throws(function () {
			exportstest.exportsTest(5, 0, {}, 'function')
		}, /incorrect type/)
	},
	'ExportsTest ExportCount': function () {
		assert.throws(function () {
			exportstest.exportsTest({}, 'a')
		}, /positive number/)
		assert.throws(function () {
			exportstest.exportsTest({}, 1)
		}, /Incorrect number/)
	},
	'ExportsTest ExportTypes': function () {
		exportstest.exportsTest({a: function () {}})
		exportstest.exportsTest({a: 5}, 1, {a: 'number'})
		assert.throws(function () {
			exportstest.exportsTest({a: function () {}}, 1, {a: 'number'})
		}, /Incorrect type/)
	},
}