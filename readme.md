# Mocha Wrapper

The [Mocha Wrapper](https://github.com/haraldrudell/mochawrapper) module makes testing with mocha and assert very easy.

* Automated test coverage report
* Package consistency test looks for frequently forgotten items
* Automated adding of mocha to your project
* Enhanced assertion printouts with message, actual and expected values

## Add to my project NOW

**Simply add mocha :)**

```
npm install mochawrapper; node_modules/.bin/addmocha; npm test

> mochawrapper@0.0.18 test /home/foxyboy/Desktop/c505/node/mochawrapper
> mocha --ui exports --reporter spec
...
```

The `addmocha` command updates .gitignore, package.json and the test folder in a  safe manner so testing can start immediately from a single dependency.

## SHOW ME RIGHT, RIGHT NOW

A project using mochawrapper is [tagfinder](https://github.com/haraldrudell/tagfinder):

```
git clone https://github.com/haraldrudell/tagfinder
cd tagfinder
npm install

npm test
npm run-script coverage
```

The system’s browser displays the test coverage report for tagfinder.

## Automatic Coverage Report

`npm run-script coverage` displays a test coverage report by opening a tab or window in the system’s browser. There is no need to modify any code to run coverage, and you can continuously use it as a guide for further areas to test.

# Reference

## Continuous Testing

`npm run-script monitor` continuously displays current test results and rerun the tests as you save your sourcefiles.

## Test Everything

`npm test` runs all the tests in the test folder.

## Debug Tests

`npm run-script debugtest` runs all tests using the debugger. By inserting JavaScript’s debugger statement at strategic locations you can run to the exact location where there is something funky going on.

## Coverage Report

```
npm run-script coverage

mochacoverage Preparing an automated test coverage report
mochacoverage Invoking jsCoverage
mochacoverage Running tests
Files checked for syntax: javascript:9, json:1 in 0.1 s
mochacoverage Preparing report
mochacoverage Launching browser
mochacoverage Complete
```

This does coverage analysis of JavaScript files in the project's lib folder. When complete, Mocha Wrapper launches a new tab in the system default browser containing JavaScript source code. Lines marked red were not executed.

The report can also be invoke using `node_modules/.bin/mochacoverage` or simply `mochacoverage` if you have updated your PATH. For both of these methods, you can add a top-level folder other than `lib`.

## Getting jscoverage

The [jsCoverage](http://siliconforks.com/jscoverage/) command is required.

```
jscoverage --version
jscoverage 0.5.1
```

* Linux has a jscoverage package: `sudo apt-get install jscoverage`
* Windows: [jsCoverage](http://siliconforks.com/jscoverage/) site has zip to download
* Mac: `sudo macports install jscoverage`
* There is a [github node-jscoverage](https://github.com/visionmedia/node-jscoverage) if you have a C compiler installed.

## Regular Test Output

```
npm test

> tagfinder@0.1.0 test /home/foxyboy/Desktop/c505/node/tf
> mocha --ui exports --reporter spec

  Empty Markup
    ✓ Can compile undefined 
    ✓ Can compile empty string 

  Parsing
    ✓ Can remove html comments 
    ✓ Can find opening tags 
    ✓ Empty attributes 
    ✓ Unquoted attributes 
    ✓ Quoted attributes 
    ✓ Unescaped content: script and textarea 
    ✓ Closing tag in unescaped content 
    ✓ MathML 
    ✓ cdata section 
    ✓ svg 

  Package Consistency:
    ◦ Proper JavaScript and json syntax: Files checked for syntax: javascript:3, json:1 in 0.1 s
    ✓ Proper JavaScript and json syntax (87ms)
    ✓ Package descriptor file 
    ✓ git ignore declaration 
    ✓ Readme 


  ✔ 16 tests complete (102ms)
```

## Tip

Add `node_modules/.bin` to your PATH environment variable to run executable scripts from your modules.

# Test Examples

Here are two tests from a test suite. The first test is regular code, and the second test features a callback.

```js
var assert = require('mochawrapper')

exports['Array Length:'] = {
	'array.length returns a number': function () {
		var expected = 'number'
		var actual = typeof [].length
		assert.equal(actual, expected)
	},
	'Testing with callback (asynchronous)': function (done) {
		setTimeout(completeWhenThisExecutes, 100)
		console.log('background complete')
		function completeWhenThisExecutes() {
			console.log('finishing test')
			done()
		}
	}
}
```

```
npm test

> cloudclearing@0.0.2 test /home/foxyboy/Desktop/c505/node/cloudclearing
> mocha --ui exports --reporter spec


  Array Length:
    ✓ array.length returns a number 
    ◦ Testing with callback (asynchronous): background complete
finishing test
    ✓ Testing with callback (asynchronous) (111ms)

  Package Consistency:
    ◦ Proper JavaScript and json syntax: Files checked for syntax: javascript:16, json:1 in 0.1 s
    ✓ Proper JavaScript and json syntax (79ms)
    ✓ Package descriptor file 
    ✓ git ignore declaration 
    ✓ Readme 


  ✔ 7 tests complete (198ms)
```

# Notes

© [Harald Rudell](http://www.haraldrudell.com) wrote mochawrapper for node in August, 2012

No warranty expressed or implied. Use at your own risk.

Please suggest better ways, new features, and possible difficulties on [github](https://github.com/haraldrudell/mochawrapper)