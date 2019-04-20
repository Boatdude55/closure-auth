/**
 * Validators for Profile personalization
 */

goog.provide('app.validators.Profile');
goog.require('forms.validators.validatePresence');
goog.require('forms.validators.validateEmail');
goog.require('forms.validators.validateLength');
goog.require('forms.validators.validateStrength');
goog.require('forms.validators.validateConfirmation');

app.validators.Profile = {

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
