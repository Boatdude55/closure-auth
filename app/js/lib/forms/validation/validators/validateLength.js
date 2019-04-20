/**
 * @fileoverview Validate the length of a control
 */

goog.provide('forms.validators.validateLength');

/**
 * [validateLength description]
 * @param  {Object=} opt Options for configuring the validating function
 */
forms.validators.validateLength = function (opt) {

	return function (key, value) {

		if ( goog.DEBUG ) {

			console.log('validating length');

		}

		let result = validateLength_(value, opt);

		return (result === true) ? true : result;

	};

};

function validateLength_ (value, options) {

	let allowNone = goog.object.get(options, 'allowNone');
	let allowBlank = goog.object.get(options, 'allowBlank');
	let useBetweenMessage = goog.object.get(options, 'useBetweenMessage');
	let is = goog.object.get(options, 'is');
	let min = goog.object.get(options, 'min');
	let max = goog.object.get(options, 'max');

	let length = value.length;

	if (goog.isDefAndNotNull(min) && min > length) {

		return 'tooShort error';

	}

	if (goog.isDefAndNotNull(max) && max < length) {

		return 'tooLong error';

	}

	return true;

};
