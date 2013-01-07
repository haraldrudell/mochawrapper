// test-tracecutter.js
// © Harald Rudell 2013

var tracecutter

var assert = require('../lib/assertwrapper')

exports['MochaWrapper'] = {
	'Exports': function () {
		var module = tracecutter = require('../lib/tracecutter')
		var exportsCount = 1
		var exportTypes = {packagetests: 'object'}
		var moduleType = 'object'
		require('../lib/exportstest').exportsTest(module, exportsCount, exportTypes, moduleType)
	},
}