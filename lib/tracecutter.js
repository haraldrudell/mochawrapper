// tracecutter.js
// removes the mocha stack frames from a stack trace
// © Harald Rudell 2012

// https://github.com/haraldrudell/haraldutil
var haraldutil = require('haraldutil')

var mochaFunc = 'Test.Runnable.run'
var mochaFile = 'mocha/lib/runnable.js'
// how each stack frame starts as text
var frameLeadin = '\n\u0020\u0020\u0020\u0020at\u0020'

exports.cutTheTrace = cutTheTrace

function cutTheTrace(e, fu, fi) {
	var trace = haraldutil.parseTrace(e)
	if (trace) { // we coulds parse the trace

		if (!fu) fu = mochaFunc
		if (!fi) fi = mochaFile
		var frames = trace.frames

		// find the frame to cut from
		var theFrame
		frames.forEach(function (frame, index) {
			if (frame.func == fu &&
				~frame.text.indexOf(fi)) {
				theFrame = index
			}
		})

		// modify e
		if (theFrame != null) {
			var msg = [trace. message]
			for (var index = 0; index < theFrame; index++) {
				msg.push(frameLeadin, frames[index].text)
			}
			e.stack = msg.join('')
		}
	}
}