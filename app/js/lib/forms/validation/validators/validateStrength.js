/**
 * @fileoverview Validate the strength of a password
 */

goog.provide('forms.validators.validateStrength');

/**
 * [validateStrength description]
 * @param  {Object=} opt Options for configuring the validating function
 */
forms.validators.validateStrength = function (opt) {

	return function (key, value, _oldValue, changes, content) {

		if ( goog.DEBUG ) {

			console.log('validating strength');

		}

		let result = validateStrength_();

		return (result === true) ? true : result;

	};

};

function validateStrength_ () {

	return true;

};
