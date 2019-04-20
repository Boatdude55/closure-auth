/**
 * @fileoverview
 *
 * Plugin for Scroll animations
 */

goog.provide("app.plugins.Fx");

app.plugins.Fx =  function (core, options) {

	// define a method that gets called when a module starts
	var onModuleInit = function (instanceSandbox, options, done){
		if ( goog.DEBUG ) {
			console.group("Intializing Fx Plugin");
				console.log(instanceSandbox);
				console.log(options);
				console.log(done);
			console.groupEnd();
		}

		done();
	};

	// define a method that gets called when a module stops
	var onModuleDestroy = function (done){
		if ( goog.DEBUG ) {
			console.log("Destroying Fx Plugin");
		}
		done();
	};

	// don't forget to return your methods
	return {
		init: onModuleInit,
		destroy: onModuleDestroy
	};

};
