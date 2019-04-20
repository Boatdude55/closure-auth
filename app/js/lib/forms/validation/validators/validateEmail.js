/**
 * @fileoverview Validate that email is valid format
 */

goog.provide('forms.validators.validateEmail');

const regularExpressions = {
  // eslint-disable-next-line no-useless-escape
  'email': /^[a-z0-9!#$%&'*+\/=?^_`{|}~-]+(?:\.[a-z0-9!#$%&'*+\/=?^_`{|}~-]+)*@(?:[a-z0-9](?:[a-z0-9-]*[a-z0-9])?\.)+[a-z0-9](?:[a-z0-9-]*[a-z0-9])?$/i,
  // eslint-disable-next-line no-useless-escape
  'phone': /^([\+]?1\s*[-\/\.]?\s*)?(\((\d{3})\)|(\d{3}))\s*[-\/\.]?\s*(\d{3})\s*[-\/\.]?\s*(\d{4})\s*(([xX]|[eE][xX][tT]?[\.]?|extension)\s*([#*\d]+))*$/,
  // eslint-disable-next-line no-useless-escape
  'url': /(?:([A-Za-z]+):)?(\/{0,3})[a-zA-Z0-9][a-zA-Z-0-9]*(\.[\w-]+)+([\w.,@?^=%&amp;:\/~+#-{}]*[\w@?^=%&amp;\/~+#-{}])??/
};

/**
 * [validateEmail description]
 * @param  {Object=} opt Options for configuring the validating function
 */
forms.validators.validateEmail = function (opt) {

	return function (key, value) {

		if ( goog.DEBUG ) {


			console.log('validating email');

		}

		let result = validateEmail_(value, opt, null, key);

		return (result === true) ? true : result;

	};

};

function validateEmail_ (value, options, model, attribute) {

	let regex = goog.object.get(regularExpressions, 'email');

	if ( goog.DEBUG ) {

		console.log('validateEmail_: ', {
			regex,
			value, options, model, attribute
		});

	}

	if (regex && !goog.isDefAndNotNull(value.match(regex))) {

		// return {type: 'invalid', value, options};

		return 'email error';

	}

	return true;

}
