// test-mochacoverage.js
// © Harald Rudell 2013

/*
to run jscoverage on the package itself:

set current directory to the mochawrapper directory
node test/selfcoverage/mochacoverage.js
*/
var mochacoverage = require('../lib/mochacoverage')

// https://github.com/visionmedia/mocha
var mocha = require('mocha2')
var child_process = require('child_process')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')
var jade = require('jade')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var assert = require('../lib/assertwrapper')

var cl = console.log
var sp = child_process.spawn
es = fs.existsSync
rf = fs.readFileSync
mo = mochacoverage.testMoch()
var or = require.extensions['.js']
var mr = mocha.Runner
cm = jade.compile
cws = fs.createWriteStream
bt = haraldutil.browseTo

exports['MochaCoverage'] = {
	'Exports': function () {
		assert.equal(typeof mochacoverage, 'object')
		assert.equal(Object.keys(mochacoverage).length, 2)
		assert.equal(typeof mochacoverage.run, 'function')
		assert.equal(typeof mochacoverage.testMoch, 'function')
	},
	'Run': function () {
		var aSpawn = []
		var eSpawn = [['jscoverage', ['--no-highlight',
			path.join(__dirname, '..', '--ui'),
			path.join(__dirname, '..', '--ui-cov'),
		]]]
		var aOn = {}
		var eOn = ['exit']
		var aOut = {}
		var eOut = ['data', 'end']
		var aErr = {}
		var eErr = ['data', 'end']
		var runnerComplete

		child_process.spawn = mockSpawn
		fs.existsSync = function () {return true}
		mochacoverage.testMoch(mockMochaConstructor)
		mockMochaConstructor.Runner = mockRunnerConstructor
		console.log = function () {}
		mochacoverage.run()
		console.log = cl

		assert.ok(aSpawn.length)
		assert.deepEqual(Object.keys(aOn).sort(), eOn.sort())
		for (var e in aOn) assert.equal(typeof aOn[e], 'function')
		assert.deepEqual(Object.keys(aOut).sort(), eOut.sort())
		for (var e in aOut) assert.equal(typeof aOut[e], 'function')
		assert.deepEqual(Object.keys(aErr).sort(), eErr.sort())
		for (var e in aErr) assert.equal(typeof aErr[e], 'function')

		// append some data - ie. jsCoverage is printing
		aOut.data('Hello')

		// fake that jsCoverage is exiting
		aOut.end()
		aErr.end() // stderr
		console.log = function () {}
		aOn.exit(0) // process exit
		console.log = cl

		assert.equal(typeof runnerComplete, 'function')

		var aComplete = 0
		fs.readFileSync = mockReadFileSync
		jade.compile = function () {return function () {}}
		fs.createWriteStream = function () {return {write: function () {}}}
		haraldutil.browseTo = function () {return {on: function (){aComplete++}}}
		console.log = function () {}
debugger
		runnerComplete()
		console.log = cl

		assert.ok(aComplete)

		function mockReadFileSync(file) {
			var endIn = 'coverage.jade'
			if (typeof file == 'string' && file.slice(-endIn.length) === endIn) {
				return {}
			} else rf.apply(this, Array.prototype.slice.apply(arguments))

		}
		function mockRunnerConstructor() {
			this.run = function (fn) {runnerComplete = fn}
		}
		function mockSpawn(cmd, args) {
			aSpawn.push([cmd, args])
			return {
				on: function (e, f) {
					aOn[e] = f
					return this
				},
				stdout: {
					on: function (e, f) {
						aOut[e] = f
						return this
					},
				},
				stderr: {
					on: function (e, f) {
						aErr[e] = f
						return this
					},
				},
			}
		}
		function mockMochaConstructor(opts) {
			this.loadFiles = function () {}
			this._reporter = function () {}
			this.options = {}
		}
	},
	'after': function () {
		var cl = console.log
		child_process.spawn = sp
		fs.existsSync = es
		mochacoverage.testMoch(mo)
		require.extensions['.js'] = or
		mocha.Runner = mr
		fs.readFileSync = rf
		jade.compile = cm
		fs.createWriteStream = cws
		haraldutil.browseTo = bt
	},
}