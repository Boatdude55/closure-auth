/**
 * @fileoverview
 *
 * Form Validation inspired by Yup.
 */

goog.provide('forms.validation.Validation');
goog.require('goog.events.EventHandler');
goog.require('goog.object');
goog.require('util');

const CONTENT = 'content_';
const CHANGES = 'changes_';
const ERRORS = 'errors_';
const VALIDATOR = 'validator_';
const OPTIONS = 'options_';
const RUNNING_VALIDATIONS = 'runningValidations_';
const BEFORE_VALIDATION_EVENT = 'beforeValidation';
const AFTER_VALIDATION_EVENT = 'afterValidation';
const AFTER_ROLLBACK_EVENT = 'afterRollback';

/**
 * [Validation_ description]
 * @constructor
 * @extends {goog.events.EventHandler}
 * @param {Object=} model         [description]
 * @param {*=} validatorFunc [description]
 */
forms.validation.Validation_ = function (model, validatorFunc) {
	forms.validation.Validation_.base(this, 'constructor');

	goog.object.set(this, CONTENT, model);
	goog.object.set(this, CHANGES, {});
	goog.object.set(this, ERRORS, {});
	goog.object.set(this, VALIDATOR, validatorFunc);
	goog.object.set(this, RUNNING_VALIDATIONS, {});

	this.isValid_ = false;

};
goog.inherits(forms.validation.Validation_, goog.events.EventHandler);

/**
 * [validate description]
 * @param  {string} key      [description]
 * @param  {number|string} newValue [description]
 * @return {*}          [description]
 */
forms.validation.Validation_.prototype.validate = function (key, newValue) {

	if (goog.DEBUG) {

		console.log('validate: ', key, newValue);

	}

	return this.validateKey_(
		key,
		newValue,
		);

};

/**
 * [execute description]
 * @return {boolean} [description]
 */
forms.validation.Validation_.prototype.execute = function () {

	if (goog.DEBUG) {

		console.log('execute');

	}

	return true;

};

/**
 * [save description]
 * @return {boolean} [description]
 */
forms.validation.Validation_.prototype.save = function () {

	if (goog.DEBUG) {

		console.log('save');

	}

	return true;

};

/**
 * [validateKey_ description]
 * @param  {string} key   [description]
 * @param  {string|number} value [description]
 * @return {number|string}       [description]
 */
forms.validation.Validation_.prototype.validateKey_ = function (key, value) {

	let content = goog.object.get(this, CONTENT);

	let oldValue = goog.object.get(content, key);

	if (goog.DEBUG) {

		console.log('validateKey_: ', {
			key,
			value,
			content,
			oldValue,
		});

	}

	let validation = this.validate_(key, value, oldValue);

	let result = this.handleValidation_(validation, { key, value });

	return result;

};

/**
 * [validate_ description]
 * @param  {string} key      [description]
 * @param  {string|number} newValue [description]
 * @param  {string|number} oldValue [description]
 * @return {boolean|*}          [description]
 */
forms.validation.Validation_.prototype.validate_ = function (key, newValue, oldValue) {

	let content = goog.object.get(this, CONTENT);
	let changes = goog.object.get(this, CHANGES);

	if (goog.DEBUG) {

		console.log('validate_: ', {
			key, newValue, oldValue, content,
		});

	}

    let isValid = this.lookUpValidators_(
        key,
        newValue,
        oldValue,
        changes,
        content,
    );

	return goog.isDefAndNotNull(isValid) ? isValid : true;

};

forms.validation.Validation_.prototype.lookUpValidators_ = function (key, newValue, oldValue, changes, content) {

	let validators = goog.object.get(this, VALIDATOR);

	let validator = goog.object.get(validators, key);

	if (goog.DEBUG) {

		console.log('lookUpValidators_: ', {
			key, newValue, oldValue, changes, content,
			validators,
			validator,
		})

	}

	if (!goog.isDef(validator) || goog.isNull(validator) || !goog.isDefAndNotNull(validator)) {

		return true;

	}

	if (goog.isArray(validator)) {

		return this.handleMultipleValidations_(validator, { key, newValue, oldValue, changes, content });

	}

	let validation = validator(key, newValue, oldValue, changes, content);

	return [validation];

};

forms.validation.Validation_.prototype.handleMultipleValidations_ = function (validators, proposal) {

	let key = goog.object.get(proposal, 'key');
	let newValue = goog.object.get(proposal, 'newValue');
	let oldValue = goog.object.get(proposal, 'oldValue');
	let changes = goog.object.get(proposal, 'changes');
	let content = goog.object.get(proposal, 'content');

	let validations = goog.array.map(validators, function (validator) {

		return validator(key, newValue, oldValue, changes, content);

	});

	if (goog.DEBUG) {

		console.log('handleMultipleValidations_: ', {
			validators,
			proposal,
			validations,
		})

	}

	return this.handleValidations_(validations);

};

forms.validation.Validation_.prototype.handleValidations_ = function (validations) {

	let rejectedValidations = goog.array.filter(validations, function (validation) {

		return !(goog.isBoolean(validation) && validation);

	});

	if (goog.DEBUG) {

		console.log('handleValidations_: ', {
			rejectedValidations,
			validations,
		})

	}

	return goog.object.get(rejectedValidations, 'length') === 0 || rejectedValidations;

};

/**
 * [handleValidation_ description]
 * @param  {boolean|*} validation [description]
 * @param  {Object} proposal   [description]
 * @return {string|number}            [description]
 */
forms.validation.Validation_.prototype.handleValidation_ = function (validation, proposal) {

	if (goog.DEBUG) {

		console.log('handleValidation_: ', {
			validation,
			proposal,
		});

	}

	let key = goog.object.get(proposal, 'key');
	let value = goog.object.get(proposal, 'value');
	let isValid = validation === true || goog.isArray(validation)
	        && validation.length === 1
	        && validation[0] === true;

	// Happy path: remove `key` from error map.
	this.deleteKey_(ERRORS, key);

	// Error case.
	if (!isValid) {

	    return this.addError(key, { value, validation });

	}

	this.setChange_(key, value);

	return value;

};

forms.validation.Validation_.prototype.setChange_ = function (key, value) {

	let changes = goog.object.get(this, CHANGES);

	goog.object.set(changes, key, value);

	return true;

};

forms.validation.Validation_.prototype.deleteKey_ = function (objName, key) {

	if (goog.DEBUG) {

		console.log('deleteKey_: ', {
			objName,
			key,
		});

	}

	let obj = goog.object.get(this, objName);

	if (obj.hasOwnProperty(key)) {
	    delete obj[key];
	}

	let c = this;

	return true;

};

forms.validation.Validation_.prototype.addError = function (key, error) {

	if (goog.DEBUG) {

		console.log('addError: ', {
			error,
			key,
		});

	}

	// Construct new `Err` instance.
	let newError;

	if (goog.isObject(error)) {

	    // assert('Error must have value.', error.hasOwnProperty('value'));
	    // assert('Error must have validation.', error.hasOwnProperty('validation'));

	    newError = {
	    	'errors': error.validation,
		};

	}
	else {

	    newError = {
	    	'errors': error,
	    };

	}

	// Add `key` to errors map.
	let errors = goog.object.get(this, ERRORS);

	goog.object.set(errors, key, newError);

	// // Return passed-in `error`.
	return error;

};

forms.validation.Validation_.prototype.getErrors = function () {

	return goog.object.get(this, ERRORS);

};

forms.validation.Validation_.prototype.isValid = function () {

	let errors = goog.object.get(this, ERRORS);

	return goog.object.getCount(errors) === 0 ? true : false;

};

/**
 * [Schema description]
 */
forms.validation.Validation = function ( model, validators ) {

	return new forms.validation.Validation_(model, validators);

};
