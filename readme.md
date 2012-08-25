# Mocha Wrapper

The mochawrapper modules makes testing with mocha and assert easier.

* Automated test coverage report
* Package consistency test looks for frequently forgotten items
* Enhanced assertion printouts with message, actual and expected values

## Get It Now

* [Mocha Wrapper](https://github.com/haraldrudell/mochawrapper) is on github

## SHOW ME RIGHT, RIGHT NOW

A project using mochawrapper is [tagfinder](https://github.com/haraldrudell/tagfinder):

```
git clone https://github.com/haraldrudell/tagfinder
cd tagfinder
npm install
mochacoverage
```

The system's browser displays the test coverage report for tagfinder.

The [jsCoverage](http://siliconforks.com/jscoverage/) command is required.

* On Linux: sudo apt-get install jscoverage
* Windows: jsCoverage site has zip to download
* Mac: macports jscoverage
* [github node-jscoverage](https://github.com/visionmedia/node-jscoverage)

To see test regular results:

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

# Add Mocha Wrapper to Your Project

This requires modifying package.json, install the module and copying one file.

1\. In the devDendencies object add mochawrapper:

```json
	"devDependencies": {
		"mochawrapper": ""
	},
```

2\. In the scripts object add test and monitor:

```json
	"scripts": {
		"test": "mocha --ui exports --reporter spec",
		"monitor": "mocha --ui exports --reporter min --watch"
	}
```

3\. Install mochawrapper

```
npm install
```

4\. Add the package test by creating a test directory and copying mochawrapper's file package-test/test-package.js there

```
mkdir test
cp node_modules/mochawrapper/package-test/test-package.js test
```

5\. Test

```
npm test

> cloudclearing@0.0.2 test /home/foxyboy/Desktop/c505/node/cloudclearing
> mocha --ui exports --reporter spec



  Package Consistency:
    ◦ Proper JavaScript and json syntax: Files checked for syntax: javascript:16, json:1 in 0.1 s
    ✓ Proper JavaScript and json syntax (79ms)
    ✓ Package descriptor file 
    ✓ git ignore declaration 
    ✓ Readme 


  ✔ 5 tests complete (86ms)
```

6\. Continuously test as you update files of your project:

```
npm run-script monitor
```

# Test Coverage Report

After adding Mocha Wrapper to your project, make sure the project folder is your current working directory and type:

```
mochacoverage

mochacoverage Preparing an automated test coverage report
mochacoverage Invoking jsCoverage
mochacoverage Running tests
Files checked for syntax: javascript:9, json:1 in 0.1 s
mochacoverage Preparing report
mochacoverage Launching browser
mochacoverage Complete
```

This does coverage analysis of JavaScript files in the project's lib folder. When complete, Mocha Wrapper launches a new tab in the system default browser containing JavaScript source code. Lines marked red were not executed.

## Tip

If you add /*-cov to .gitignore coverage report folders will not be checked in. Sample content:

```
/node_modules
/*-cov
```

# Typical Test

Here are two tests from a test suite. The first test is regular code, and the second test features a callback.

```js
var assert = require('mochawrapper')

exports['Array Length:'] = {
	'array.length returns a number': function () {
		var expected = 'number'
		var actual = typeof [].length
		assert.equal(expected, actual)
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

# Reference

mochacoverage [project folder, default lib]

# Notes

© [Harald Rudell](http://www.haraldrudell.com) wrote this for node in August, 2012

No warranty expressed or implied. Use at your own risk.

Please suggest better ways, new features, and possible difficulties on [github](https://github.com/haraldrudell/mochawrapper)