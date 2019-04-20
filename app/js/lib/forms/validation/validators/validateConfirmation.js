/**
 * @fileoverview Validator for confirming other input
 */

goog.provide('forms.validators.validateConfirmation');

goog.require('util');

/**
 * [validateConfirmation description]
 * @param  {Object=} opt Options for configuring the validating function
 */
forms.validators.validateConfirmation = function (opt) {

	return function (key, newValue, _oldValue, changes, content) {

		if ( goog.DEBUG ) {

			console.log('validating confirmation');

		}

		let result = validateConfirmation_(newValue, opt, changes, key);

		return (result === true) ? true : result;

	};

};

function validateConfirmation_ (value, options, model, attribute) {

	let on = goog.object.get(options, 'on');
	let cmp = goog.object.get(model, on);

	if ( goog.DEBUG ) {

		console.log('validateConfirmation_: ', {
			on,
			cmp,
			model,
			value,
			attribute,
		});

	}

	if (!util.isEqual(value, cmp)) {

		return 'confirmation error';

	}

	return true;

}
