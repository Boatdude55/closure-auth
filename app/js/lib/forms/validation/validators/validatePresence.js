/**
 * @fileoverview Validate control is not blank
 */

goog.provide('forms.validators.validatePresence');

goog.require('util');

/**
 * [validatePresence description]
 * @param  {Object|boolean=} opt Options for configuring the validating function
 */
forms.validators.validatePresence = function (opt) {

	let targets;

	if (typeof opt === 'boolean') {

		opt = { 'presence': opt };

	} else if (opt && opt.on !== undefined) {

		if (typeof opt.on === 'string') {

			targets = [ opt.on ];

		} else if (goog.isArray(opt.on)) {

			targets = opt.on;

		}

		delete opt.on;

	}

	return function (key, value, _oldValue, changes, content) {

		if ( goog.DEBUG ) {

			console.log('validating presence');

		}

		if (targets && !targets.some((target) => changes[target] || (changes[target] === undefined && content[target]))) {

			return true;

		}

		let result = validatePresence_(value, opt, null, key);

		return (result === true) ? true : result;

	};

};

function validatePresence_ (value, options, model, attribute) {

	let presence = goog.object.get(options, 'presence');
	let _isPresent = !util.isEmpty(value);

	if (goog.DEBUG) {

		console.log('validatePresence_: ', {
			presence,
			_isPresent,
			value, options, model, attribute,
		});

	}

	if (presence === true && !_isPresent) {

		// return {type: 'blank', value, options};

		return 'presence error is blank';

	}

	if (presence === false && _isPresent) {

		// return {type: 'present', value, options};

		return 'presence error is present';

	}

	return true;

}
