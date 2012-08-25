// test-package.js
// verify package consistency
// © Harald Rudell 2012
// 2012-08-21: using mocha

// https://github.com/haraldrudell/greatjson
var greatjson = require('greatjson')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// http://nodejs.org/api/path.html
var path = require('path')
// https://github.com/mishoo/UglifyJS/
var uglify = require('uglify-js')
// http://nodejs.org/api/util.html
var util = require('util')
// http://nodejs.org/api/assert.html
var test = require('assert')

// this function moved to a new module - make legacy node work
if (!fs.existsSync) fs.existsSync = path.existsSync

// assuming no symlinks, here is the deployFolder
var pos = __dirname.indexOf('/node_modules')
var thisFileDeployFolder = ~pos ? __dirname.substring(0, pos) : path.join(__dirname, '..')
var deployFolder = thisFileDeployFolder

var invokedDeployFolder

packageJsonKeys = ['name', 'description', 'author', 'version', 'keywords', 'contributors', 'repository', 'devDependencies', 'dependencies', 'repository', 'scripts']



// these defaults can be overriden by a file ./test-package.json
var defaults = {
	// list of paths, relative to the deployFolder that will not be searched
	// you could have 'app.js', or 'public'
	ignore: [
		'test',
		'node_modules',
	],

	// extensions that maps to fileTypeMap
	extensions: {
		'js': 'javascript',
		'json': 'json',
	}
}

// maps filetypes to functions verifying syntax
var fileTypeMap = {
	'javascript': verifyJavaScriptSyntax,
	'json': verifyJsonSyntax,
}

exports['Package Consistency:'] = {
	'DummyTest': function (done, testFolder) {
		if (done) done()
		else {		
			deployFolder = invokedDeployFolder = path.join(testFolder, '..')
console.log('deployFolder:', deployFolder)
		}
	},
	'Proper JavaScript and json syntax': function (done) {
console.log('running:', deployFolder)
		var cbCounter = 0

		// get possible custom settings from file
		var defaults = getDefaults()

		// look for syntax errors in all .js files
		var counts = {}
		var t = new Date
		scanFolder(deployFolder)

		function end(err) {

			if (err) throw err
			if (--cbCounter == 0) {
				// print file counts
				var s = []
				Object.keys(fileTypeMap).forEach(function (countKey) {
					s.push(countKey + ':' + counts[countKey])
				})
				console.log('Files checked for syntax:', s.join(', '), 'in', (((new Date) - t) / 1e3).toFixed(1),'s')

				done()
			}
		}

		function scanFolder(folder) {
			//console.log(arguments.callee.name, folder)
			cbCounter++
			fs.readdir(folder, function (err, entries) {
				if (!err) {
					entries.forEach(function (entry) {

						// ignore hidden file (start with '.')
						if (entry.substring(0, 1) != '.') {
							var absolutePath = path.join(folder, entry)
							var relativePath = absolutePath.substring(deployFolder.length + 1)

							// check against ignore list
							if (defaults.ignore.indexOf(relativePath) == -1) {
								if (getType(absolutePath) === false) {

									// recursively scan folders
									scanFolder(absolutePath)
								} else {
									var entryExtension = path.extname(entry).substring(1)
									var fileTypeKey = defaults.extensions[entryExtension]
									if (fileTypeKey) {
										counts[fileTypeKey] = (counts[fileTypeKey] || 0) + 1
										var parseFunc = fileTypeMap[fileTypeKey]
										if (parseFunc) {

											// check syntax of json and JavaScript files
											cbCounter++
											parseFunc(absolutePath, relativePath, test, end)
										}
									}
								}
							}
						}
					})
				}
				end(err)
			})
		}
	},
	'Package descriptor file': function (done) {

		// file should exist
		var name = 'package.json'
		var file = path.join(deployFolder, name)
		var exists = fs.existsSync(file)
		test.ok(exists, 'Missing file:\'' + name + '\' in folder:' + deployFolder)
		if (exists) {

			// content should be json
			var jsonString = fs.readFileSync(file, 'utf-8')
			var object = greatjson.parse(jsonString)
			if (object instanceof Error) test(false, 'Improper json in file \'' + name + '\': ' + object.toString())
			else {

				// verify that content has all required keys
				packageJsonKeys.forEach(function (key) {
					test.ok(object[key] != undefined, 'Missing key: \'' + key + '\' in ' + name)
				})
			}
		}

		done()
	},
	'git ignore declaration': function (done) {
		// ensure that .gitignore contains '/node_modules'
		var expected = '/node_modules'

		// file should exist
		var name = '.gitignore'
		var file = path.join(deployFolder, name)
		var exists = fs.existsSync(file)
		test.ok(exists, 'File missing:' + name + ' in folder:' + deployFolder)

		if (exists) {
			var data = fs.readFileSync(file, 'utf-8')

			test.ok(data.indexOf(expected) != -1, 'File ' + name + ' is missing line:\'' + expected + '\'')
		}

		done()
	},
	'Readme': function findReadme(done) {

		var name = 'readme.md'
		var file = path.join(deployFolder, name)
		var exists = fs.existsSync(file)
		test.ok(exists, 'File missing:' + name + ' in folder:' + deployFolder)

		done()
	},
}

// support stuff

// get configuration, optionally from './test-pagage.json'
function getDefaults() {

	// read the ignore file
	var testPackageJsonName = path.join(__dirname, path.basename(__filename, path.extname(__filename)) + '.json')
	if (getType(testPackageJsonName)) {
		var text = fs.readFileSync(testPackageJsonName, 'utf-8')
		var msg = 'Bad json in:' + testPackageJsonName
		try {
			var object = JSON.parse(text)
		} catch (e) {
			console.log(msg)
			throw e
		}
		if (!object) throw Error(msg)

		// apply settings from file
		if (object.ignore) {
			if (!Array.isArray(object.ignore)) Error(testPackageJsonName + ' ignore must be array')
			defaults.ignore = object.ignore
		}
		if (object.extensions) {
			if (typeof object.extensions != 'object') Error(testPackageJsonName + ' extension must be object')
			defaults.extension = object.extension
		}
	}

	return defaults
}

// determine what path1 is
// return value:
// undefined: does not exist
// false: is a directory
// true: is a file
function getType(path1) {
	var result
	var stats
	try {
		stats = fs.statSync(path1)
	} catch (e) {
		var bad = true
		if (e instanceof Error && e.code == 'ENOENT') bad = false
		if (bad) {
			console.log('Exception for:', typeof path1, path1, path1 && path1.length)
			throw e
		}
	}
	if (stats) {
		if (stats.isFile()) result = true
		if (stats.isDirectory()) result = false
	}
	return result
}

function verifyJavaScriptSyntax(file, relPath, test, cb) {
	fs.readFile(file, 'utf-8', function (err, javascript) {
		if (!err) {
			var jsp = uglify.parser
			var ast
			try {
				ast = jsp.parse(javascript)
			} catch (e) {
				var eMsg = util.format('%s at line:%d column:%d position:%d',
					e.message,
					e.line,
					e.col,
					e.pos)					
				test(false, 'File: ' + (relPath ? relPath : file) + ' has bad JavaScript:' + eMsg)
			}
		}
		cb(err)
	})
}

function verifyJsonSyntax(file, relPath, test, cb) {
	fs.readFile(file, 'utf-8', function (err, jsonString) {
		if (!err) {
			var object = greatjson.parse(jsonString)
			if (object instanceof Error) {
				test(false, 'File:\'' + (relPath ? relPath : file) + '\' has improper json:' + object.toString())
			}
		}
		cb(err)
	})	
}