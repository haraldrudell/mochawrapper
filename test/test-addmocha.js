// test-addmocha.js

var addmocha = require('../lib/addmocha')
var assert = require('../lib/assertwrapper')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')

var outFolder = path.join(__dirname, 'tmp')

exports['Add Mocha:'] = {
	'before': function () {
		// ensure outFolder exists and is empty
		if (fs.existsSync(outFolder)) fs.readdirSync(outFolder).forEach(function (entry) {
			fs.unlink(path.join(outFolder, entry))
		})
		else fs.mkdirSync(outFolder)
	},
	'GitIgnore': function (done) {
		var gitString = '/node_modules\n/*-cov\n'
		addmocha.doIt(outFolder, checkResult)

		function checkResult(err) {
			if (err) assert.equal(String(err), undefined, err instanceof Error ? err.stack : '-')
			var git = fs.readFileSync(path.join(outFolder, '.gitignore'), 'utf-8')
			assert.equal(git, gitString)

			done()
		}
	},
	'Package.json': function (done) {
		var expectedJson = '{\n'+
			'  "name": "addedbymochawrapper",\n' +
			'  "version": "0.0.0",\n' +
			'  "devDependencies": {\n' +
			'    "mochawrapper": ""\n' +
			'  },\n' +			
			'  "scripts": {\n' +
			'    "test": "mocha --ui exports --reporter spec",\n' +
			'    "monitor": "mocha --ui exports --reporter min --watch",\n' +
			'    "debugtest": "mocha --debug-brk --ui exports --reporter spec",\n' +
			'    "coverage": "mochacoverage"\n' +
			'  }\n' +
			'}'
		addmocha.doIt(outFolder, checkResult)

		function checkResult(err) {
			if (err) assert.equal(String(err), undefined, err instanceof Error ? err.stack : '-')
			var json = fs.readFileSync(path.join(outFolder, 'package.json'), 'utf-8')
//console.log()
//console.log(require('haraldutil').inspectAll(json))
//console.log(require('haraldutil').inspectAll(expectedJson))
			assert.equal(json, expectedJson)
			done()
		}
	},
	'Package-test': function (done) {
		var expectedPtest = '// test-package.js\n' +
			'// use test-package from mochawrapper\n' +
			'// © Harald Rudell 2012\n' +
			'\n' +
			'/*\n' +
			'exports tests to be used with mocha exports interface\n' +
			'exports from mochawrapper/lib/test-package.js\n' +
			'*/\n' +
			'module.exports = require(\'mochawrapper\').packagetests'
		addmocha.doIt(outFolder, checkResult)

		function checkResult(err) {
			if (err) assert.equal(String(err), undefined, err instanceof Error ? err.stack : '-')
			var file = path.join(outFolder, 'test', 'test-package.js')
			var exists = fs.existsSync(file)
			assert.equal(exists, true, 'Does not exist:' + file)
			// this works when testing other projects than mochawrapper itself
			//var ptest = fs.readFileSync(file, 'utf-8')
			//assert.equal(ptest, expectedPtest, 'x')

			done()
		}
	},
	'Lib folder': function () {
		assert.equal(fs.existsSync(path.join(outFolder, 'lib')), true)
	},
}