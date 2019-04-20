/**
 * @fileoverview
 *
 * App module for multiphase_auth
 */

goog.provide('app.Module');

goog.require('app.components.Firebase');
goog.require('app.components.Profile');
goog.require('app.components.Plaid');

goog.require('goog.events.EventTarget');
goog.require('goog.dom');

/**
 * [Module description]
 * @constructor
 * @param {app.Interface} sandbox Facade for Application Core
 * @extends {goog.events.EventTarget}
 */
app.Module = function (sandbox) {
	var firebaseAuth, plaidAuth, profileAuth;
	this.viewContainer = goog.dom.getElement('auth-app-view');
	this.firebaseAuth = firebaseAuth = new app.components.Firebase(true);
	// this.plaidAuth = plaidAuth =  new app.components.Plaid(true);
	// this.profileAuth = profileAuth = new app.components.Profile(true);

	this.registerDisposable( firebaseAuth );
	// this.registerDisposable( plaidAuth );
	// this.registerDisposable( profileAuth );
};
goog.inherits(app.Module, goog.events.EventTarget);

/**
 * start Intitialize Module and children
 * @param  {Object=}   opt_config [description]
 * @param  {Function=} fn  [description]
 */
app.Module.prototype.start = function( opt_config, fn ) {
	var viewContainer = this.viewContainer;
	this.firebaseAuth.render( viewContainer );
	// this.plaidAuth.render( viewContainer );
	// this.profileAuth.render( viewContainer );
};

app.Module.prototype.destroy = function () {
	this.dispose();
}
