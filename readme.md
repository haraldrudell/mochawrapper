# Mocha Wrapper

The mochawrapper modules makes testing with mocha and assert easier.

## Get It Now

* [Mocha Wrapper](https://github.com/haraldrudell/mochawrapper) is on github

# Add Mocha Wrapper to Your Project

This requires modifying package.json, install the module and copying one file.

1. In the devDendencies object add mochawrapper:

```json
	"devDependencies": {
		"mochawrapper": ""
	},
```

2. In the scripts object add test and monitor:

```json
	"scripts": {
		"test": "mocha --ui exports --reporter spec",
		"monitor": "mocha --ui exports --reporter min --watch"
	}
```

3. Install mochawrapper

```
npm install
```

4. Add the package test by creating a test directory and copying mochawrapper's file package-test/test-package.js there

```
mkdir test
cp node_modules/mochawrapper/package-test/test-package.js test
```

5. Test

```
g$ npm test

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

```
npm run-script monitor
```

# Notes

© [Harald Rudell](http://www.haraldrudell.com) wrote this for node in August, 2012

No warranty expressed or implied. Use at your own risk.

Please suggest better ways, new features, and possible difficulties on [github](https://github.com/haraldrudell/mochawrapper)