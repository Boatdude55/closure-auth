/**
 * @fileoverview
 *
 * Firebase Account form
 */

goog.provide('app.components.Firebase');
goog.require('widget.ExpandableContainer');
goog.require('forms.Form');
goog.require('forms.validation.Validation');
goog.require('app.validators.Firebase');

/**
 * [Firebase description]
 * @constructor
 * @extends {widget.ExpandableContainer}
 * @param {boolean=} opt_expanded Initial expanded/visibility state. If
 *     undefined, attempts to infer the state from the DOM. Setting visibility
 *     using one of the standard Soy templates guarantees correct inference.
 * @param {goog.a11y.aria.Role<string>=} opt_role     ARIA role, default TAB.
 */
app.components.Firebase = function (opt_expanded, opt_role) {
	app.components.Firebase.base(this, 'constructor', opt_expanded, opt_role);
	var form_, validation_;

/*	var schema = new Map([
		['firebaseEmail', 'firebaseEmail'],
		['firebasePassword', 'firebasePassword'],
		['confirmPassword', 'confirmPassword']
	]);*/

	var schema = {
		'firebaseEmail': 'default@example.com',
		'firebasePassword': '5tr0ngPassw0r6',
		'confirmPassword': '5tr0ngPassw0r6',
	};

	function firebaseValidations () {

	}


	this.form_ = form_ = new forms.Form();

	this.validation_ = validation_ = forms.validation.Validation(schema, app.validators.Firebase);

	form_.setValidateStrategy(validation_);

	form_.setTitle('Firebase');
	form_.setSubTitle('One account to rule them all');
	form_.setSubmit('Get Access');

	form_.addFormItem("Email", "email-input", {
		fieldName: 'firebaseEmail'
	});
	form_.addFormItem("Password", "password-input", {
		fieldName: 'firebasePassword'
	});
	form_.addFormItem("Confirm Password", "confirm-input", {
		fieldName: 'confirmPassword',
		type: 'password',
		dataTarget: 'firebasePassword'
	});

	this.addChild(form_, true);
};
goog.inherits(app.components.Firebase, widget.ExpandableContainer);
