// mochawrapper.js
// © Harald Rudell 2012

module.exports = merge(
	require('./assertwrapper'),
	require('./exportstest'),
	{
		packagetests: require('./test-package')
	}
)

function merge() {
	var result = {}
	Array.prototype.slice.call(arguments).forEach(function (arg) {
		for (var p in arg) result[p] = arg[p]
	})
	return result
}