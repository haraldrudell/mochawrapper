// addmocha.js
// commission a project for mochawrapper
// © Harald Rudell 2012

// https://github.com/haraldrudell/greatjson
var greatjson = require('greatjson')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')

var gitIgnoreName = '.gitignore'
var gitStrings = ['/node_modules', '/*-cov']

var packageJsonName = 'package.json'
var packageJsonData = {
	devDependencies: {
		'mochawrapper': '',
	},
	scripts: {
		test: 'mocha --ui exports --reporter spec',
		monitor: 'mocha --ui exports --reporter min --watch',
		debugtest: 'mocha --debug-brk --ui exports --reporter spec',
		coverage: 'mochacoverage',
	},
}
var packageJsonMust = {
	name: 'addedbymochawrapper',
	version: '0.0.0',
}

var libName = 'lib'

var testFolderName = 'test'
var testPackageName = '../package-test/test-package.js'

/*
Comission a project for mochawrapper

We know the mochawrapper module is installed with its dependencies
*/
exports.run = function addMocha() {
	var func = arguments.callee.name
	doIt(process.cwd(), end)

	function end(err) {
		if (!err) console.log(func, 'complete')
		else {
			console.error(func, 'failed:', err.toString())
			process.exit(1)
		}
	}
}

exports.doIt = doIt
function doIt(outputFolder, cb) {
	var endCount = 4

	gitIgnore(end)
	packageJson(end)
	packageTest(end)
	addLib(end)

	function end(err) {
		if (!err) {
			if (--endCount == 0) cb()
		} else {
			endCount = 0
			cb(err)
		}
	}

	// make sure .gitignore contains what it should
	function gitIgnore(cb) {
		var file = path.resolve(outputFolder, gitIgnoreName)
		fs.exists(file, existResult)

		function existResult(exists) {
			if (exists) fs.readFile(file, 'utf-8', writeFile)
			else writeFile()
		}

		function writeFile(err, stringData) {
			if (!err) {
				if (typeof stringData != 'string') stringData = ''
				gitStrings.forEach(function (string) {
					var gitData = string + '\n'
					if (!~stringData.indexOf(gitData)) {
						if (stringData.length && stringData[stringData.length - 1] != '\n') stringData += '\n'
						stringData += gitData
					}
				})
				fs.writeFile(file, stringData, cb)
			} else cb(err)
		}
	}
	// prepare package.json for run-script commands
	function packageJson(cb) {
		var file = path.resolve(outputFolder, packageJsonName)
		fs.exists(file, existResult)

		function existResult(exists) {
			if (exists) fs.readFile(file, 'utf-8', writeFile)
			else writeFile()
		}

		function writeFile(err, stringData) {
			if (!err) {
				if (stringData) {
					var object = greatjson.parse(stringData)
					if (object instanceof Error) {
						err = Error('File:\'' + file + '\' has improper json:' + object.toString())
						cb(err)
					} else if (typeof object != 'object') object = Object(object)
				} else object = {}
				if (!err) {
					for (var key in packageJsonMust) {
						var fileValues = object[key]
						if (!fileValues) object[key] = packageJsonMust[key]
					}
					for (var key in packageJsonData) {
						var fileValues = object[key]
						if (!fileValues) object[key] = fileValues = {}
						var values = packageJsonData[key]
						for (var valueName in values) {
							fileValues[valueName] = values[valueName]
						}
					}
					fs.writeFile(file, JSON.stringify(object, null, 2), cb)
				}
			} else cb(err)
		}
	}

	function packageTest(cb) {
		var ended
		var testFolder = path.resolve(outputFolder, testFolderName)
		fs.exists(testFolder, existResult)

		function existResult(exists) {
			if (!exists) fs.mkdir(testFolder, 0776, copyFile)
			else copyFile()
		}

		function copyFile(err) {
			if (!err) {
				var file1 = path.resolve(__dirname, testPackageName)
				var readStream = fs.createReadStream(file1)
				readStream.on('end', end)
				readStream.on('error', end)
				var file2 = path.join(testFolder, path.basename(file1))
				var writeStream = fs.createWriteStream(file2)
				writeStream.on('error', end)
				readStream.pipe(writeStream)
			} else cb(err)
		}

		function end(err) {
			if (!ended) {
				ended = true
				cb(err)
			}
		}
	}

	function addLib(cb) {
		var libFolder = path.resolve(outputFolder, libName)
		fs.exists(libFolder, existResult)

		function existResult(exists) {
			if (!exists) fs.mkdir(libFolder, 0776, cb)
			else cb()
		}
	}
}