// exportstest.js
// Test a module object and its exports
// © Harald Rudell 2013

var assert = require('./assertwrapper')

exports.exportsTest = exportsTest

/*
Test a module object
module: the module object as provided by require
exportsCount optional number default 1: expected number of exports
moduleType: optional string: expected type of module, default 'object'
exportTypes: optional object, the exports that are not of 'function' type key: export name, value: string expected export type
*/
function exportsTest(module, exportsCount, exportTypes, moduleType) {
	if (!moduleType) moduleType = 'object'
	assert.equal(typeof module, moduleType, 'Module object of incorrect type')
	if (module) {
		exportsCount = exportsCount != null ? +exportsCount : 1
		if (isNaN(exportsCount) || exportsCount < 0) assert.ok(false, 'Bad exportsCount argument, expected positive number')

		var theExports = Object.keys(module)
		assert.equal(theExports.length, exportsCount, 'Incorrect number of exports, found: ' + theExports)

		if (!exportTypes) exportTypes = {}
		theExports.forEach(function (anExport) {
			var type = exportTypes[anExport] || 'function'
			assert.equal(typeof module[anExport], type, 'Incorrect type of export: ' + anExport)
		})
	}
}