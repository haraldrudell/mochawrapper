// test-mochawrapper.js
// © Harald Rudell 2013

var mochawrapper

var child_process = require('child_process')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')

var assert = require('../lib/assertwrapper')

exports['MochaWrapper'] = {
	'Exports': function () {
		var module = mochawrapper = require('../lib/mochawrapper')
		var exportsCount = 15
		var exportTypes = {packagetests: 'object'}
		var moduleType = 'object'
		require('../lib/exportstest').exportsTest(module, exportsCount, exportTypes, moduleType)
	},
}