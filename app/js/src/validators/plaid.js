/**
 * Validators for Plaid service
 */

goog.provide('app.validators.Plaid');
goog.require('forms.validators.validatePresence');
goog.require('forms.validators.validateEmail');
goog.require('forms.validators.validateLength');
goog.require('forms.validators.validateStrength');
goog.require('forms.validators.validateConfirmation');

app.validators.Plaid = {

	'firebaseEmail': [
		forms.validators.validatePresence(true),
		forms.validators.validateEmail({})
	],

	'firebasePassword': [
		forms.validators.validatePresence(true),
		forms.validators.validateLength({ 'min': 20 }),
		forms.validators.validateStrength()
	],

	'confirmPassword': [
		forms.validators.validateConfirmation({ 'on': 'firebasePassword' })
	],
};
