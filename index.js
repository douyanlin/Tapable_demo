const {
	SyncHook,
	SyncBailHook,
	SyncWaterfallHook,
	SyncLoopHook,
	AsyncParallelHook,
	AsyncParallelBailHook,
	AsyncSeriesHook,
	AsyncSeriesBailHook,
	AsyncSeriesWaterfallHook
 } = require("tapable");

class Car {
	constructor() {
    // The best practice is to expose all hooks of a class in a hooks property:
		this.hooks = {
      accelerate: new SyncHook(["newSpeed"]),
      accelerateBail: new SyncBailHook(["newSpeed"]),
			brake: new SyncHook(),
			asyncHook: new AsyncSeriesHook(["param"])
		};
	}

	setSpeed(newSpeed) {
		// following call returns undefined even when you returned values
		this.hooks.accelerate.call(newSpeed);
	}
}

const myCar = new Car();

myCar.hooks.accelerate.tap("LoggerPlugin", newSpeed => console.log(`Accelerating to ${newSpeed}`))
myCar.hooks.accelerateBail.tap("LoggerBailPlugin", newSpeed => console.log(`Bail Accelerating to ${newSpeed}`))
myCar.hooks.accelerateBail.tap("LoggerBail2Plugin", newSpeed => console.log(`Bail2 Accelerating to ${newSpeed}`))

// 这里的callback不是传过来的参数
myCar.hooks.asyncHook.tapAsync("AsyncPlugin1", (param, callback) => {
  setTimeout(() => {
    console.log('AsyncPlugin1', param)
    callback()
  }, 1000)
})
myCar.hooks.asyncHook.tapAsync("AsyncPlugin2", (param, callback) => {
  setTimeout(() => {
    console.log('AsyncPlugin2', param)
    callback()
  }, 2000)
})

// myCar.setSpeed(1)
myCar.hooks.accelerate.call(1)
console.log('== accelerate call end')
myCar.hooks.accelerateBail.call(2)
console.log('== accelerateBail call end')
myCar.hooks.asyncHook.callAsync(3, () => {
  console.log('Asynchronously tapping the run hook.');
})
console.log('== asyncHook call end')

