/**
 * @fileoverview
 *
 * Plaid Account form
 */

goog.provide('app.components.Plaid');
goog.require('widget.ExpandableContainer');
goog.require('forms.Form');
goog.require('forms.validation.Validation');
goog.require('app.validators.Plaid');

/**
 * [Plaid description]
 * @constructor
 * @extends {widget.ExpandableContainer}
 * @param {boolean=} opt_expanded Initial expanded/visibility state. If
 *     undefined, attempts to infer the state from the DOM. Setting visibility
 *     using one of the standard Soy templates guarantees correct inference.
 * @param {goog.a11y.aria.Role<string>=} opt_role     ARIA role, default TAB.
 */
app.components.Plaid = function (opt_expanded, opt_role) {
	app.components.Plaid.base(this, 'constructor', opt_expanded, opt_role);
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

	function plaidValidations () {

	}


	this.form_ = form_ = new forms.Form();

	this.validation_ = validation_ = forms.validation.Validation(schema, app.validators.Plaid);

	form_.setValidateStrategy(validation_);

	form_.setTitle('Plaid');
	form_.setSubTitle('Get connected to your money');
	form_.setSubmit('Get Connected');

	form_.addFormItem();
	form_.addFormItem();
	form_.addFormItem();

	this.addChild(form_, true);
};
goog.inherits(app.components.Plaid, widget.ExpandableContainer);
