// mochacoverage.js
// execute jscoverage
// © Harald Rudell 2012

var program = 'mochacoverage'

// http://nodejs.org/api/path.html
var path = require('path')
// http://nodejs.org/docs/latest/api/fs.html
var fs = require('fs')
// https://github.com/visionmedia/mocha
var mocha = require('mocha')
// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

/*
run a command-line coverage report

due to the way this is launched:
process.argv: ['node', 'arg1', ...]
*/
exports.run = function mochacoverage() {

	console.log(program, 'Preparing an automated test coverage report')
	var jsCoverageCommand = ['jscoverage', '--no-highlight']
	var exists = fs.existsSync || path.existsSync
	var join = path.join
	var re = new RegExp('\\.(js)$');
	var basename = path.basename

	var folder = process.argv[2] || 'lib'
	console.log(__dirname)
	// find absolute deployment folder
	var deployFolder = process.cwd()

	// the folder we move
	var folder0 = path.join(deployFolder, folder)
	// where we move it
	var folder1 = folder0 + '-cov'

	var outFile = path.join(folder1, 'report.html')

	if (typeof folder != 'string' || folder.length == 0 || !fs.existsSync(folder0)) {
		fatal('Argument must be a folder that exists in:' + deployFolder)
	}

	// do initial jscoverage
	console.log(program, 'Invoking jsCoverage')
	doCommand(jsCoverageCommand[0],
		jsCoverageCommand.slice(1).concat(folder0, folder1),
		function jsCoverageResult(result) {
		if (!result.exitCode) {
			console.log(program, 'Running tests')
			patchRequire(folder0, folder1)
			runMocha(done)
		} else {
			var msg = 'Command failed:\'' + result.cmd + '\'\n'
			msg += result.output
			msg += 'Exit code:' + result.exitCode
			if (result.exitCode == 127) msg += '\n\nVerify that jscoverage is installed.'
			fatal(msg)
		}
	})

	function done() {
		console.log(program, 'Complete')
	}

	/*
	execute Mocha coverage

	because html-cov uses process.stdout.write, we will use json-cov
	*/
	function runMocha(fn) {

		// get a mocha instance
		var moch = new mocha({
			ui: 'exports',
			reporter: 'json-cov', // json-cov can be redirected as opposed to html-cov
		})

		// find javaScript files containing tests
		moch.files = lookupFiles(path.join(deployFolder, 'test'))

		// here we copy from moch.run()
		try {
			var useStdout = false
			moch.loadFiles()
			var suite = moch.suite
			var options = moch.options
			var runner = new mocha.Runner(suite)
			var reporter = new moch._reporter(runner, useStdout)
			runner.ignoreLeaks = options.ignoreLeaks
			if (options.grep) runner.grep(options.grep, options.invert)
			if (options.globals) runner.globals(options.globals)
			if (options.growl) moch._growl(runner, reporter)
		} catch(e) {
			console.log(program, 'Test running exception:', e)
		}

		return runner.run(runnerComplete)

		// runner and reporter are now done
		// output the result
		function runnerComplete() {
			console.log(program, 'Preparing report')

			// and here we copy from html-cov.js HTMNCov
			try {
				var jade = require('jade')
				var file = path.join(__dirname, '../node_modules/mocha/lib/reporters', 'templates/coverage.jade')
				var str = fs.readFileSync(file, 'utf8')
				var jadeFunction = jade.compile(str, {filename: file})
				var writeStream = fs.createWriteStream(outFile, {encoding: 'utf-8'})
				writeStream.write(jadeFunction({
						cov: reporter.cov,
						coverageClass: coverageClass,
				}))
				console.log(program, 'Launching browser')
				haraldutil.browseTo(outFile)
			} catch (e) {
				console.log(program, 'rendering exception', e)
			}
			done()
		}

		function coverageClass(n) {
			if (n >= 75) return 'high'
			if (n >= 50) return 'medium'
			if (n >= 25) return 'low'
			return 'terrible'
		}
	}
	// something failed
	function fatal(msg) {
		console.error(msg)
		process.exit(1)
	}

	/*
	divert all require from folder0 to folder1
	*/
	function patchRequire(folder0, folder1) {
		// activate our modified require
		var originalRequire = require.extensions['.js']
		require.extensions['.js'] = requireFilter

		/*
		requireFilter: not invoked for native modules, only when loading from the filesystem
		module: mofule object
		- id: string, exports: object, parent: object, filename: string, loaded: boolean
		- children: array, paths: array of string
		filename: absolute filename with extension
		*/
		function requireFilter(module, filename) {
			if (filename.substring(0, folder1.length) != folder1 &&
				filename.substring(0, folder0.length) == folder0) {

				// patch filename
				filename = folder1 + filename.substring(folder0.length)
			}
			return originalRequire(module, filename)
		}

		return originalRequire
	}

	/*
	execute a system command

	cmd: string: the command
	args: array: command arguments
	cb(result): result: object
	.exitCode the child process exit code
	.output: string: any output from running the command
	*/
	function doCommand(cmd, args, cb) {
		var result = {
			exitCode: 0,
		}
		var output = []
		var endCounter = 0

		// launch the subcommand
		var proc = require('child_process').spawn(cmd, args || [])
		proc.stdout.on('data', append)
		proc.stderr.on('data', append)
		proc.stdout.on('end', end)
		proc.stderr.on('end', end)
		proc.on('exit', function procExit(code) {
			result.exitCode = code
			if (code) result.cmd = cmd + ' ' + args.join(' ')
			end()
		})

		function end() {
			if (++endCounter == 3) {
				result.output = output.join('')
				cb(result)
			}
		}

		function append(data) {
			output.push(data)
		}
	}

	// from _mocha
	function lookupFiles(path, recursive) {
		var files = []

		if (!exists(path)) path += '.js'
		var stat = fs.statSync(path)
		if (stat.isFile()) return path

		fs.readdirSync(path).forEach(function(file){
			file = join(path, file)
			var stat = fs.statSync(file)
			if (stat.isDirectory()) {
				if (recursive) files = files.concat(lookupFiles(file, recursive))
				return
			}
			if (!stat.isFile() || !re.test(file) || basename(file)[0] == '.') return
			files.push(file)
		})

		return files
	}
}