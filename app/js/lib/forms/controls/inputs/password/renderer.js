/**
 * @fileoverview Text Input Renderer
 */
goog.provide('forms.controls.PasswordInputRenderer');

goog.require('goog.ui.ControlRenderer');

/**
 * Textbox Renderer
 *
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
forms.controls.PasswordInputRenderer = function () {
	forms.controls.PasswordInputRenderer.base(this, 'constructor');
};

goog.inherits(forms.controls.PasswordInputRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(forms.controls.PasswordInputRenderer);

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
forms.controls.PasswordInputRenderer.CSS_CLASS = goog.getCssName('password-input');


/**
 * @param {goog.ui.Control} control
 * @return {Element}
 * @override
 */
forms.controls.PasswordInputRenderer.prototype.createDom = function(control) {
	this.setUpTextbox_(control);

	var element = control.getDomHelper().createDom('input', {
		'type': 'password',
		'class': this.getClassNames(control).join(' '),
		'id': 'password',
		'disabled': !control.isEnabled(),
		'required': true,
		'aria-describedby': '',
		'aria-required': true,
		'autocomplete': 'new-password',
		'name': control.fieldName
	});

	return element;
};

/** @override */
forms.controls.PasswordInputRenderer.prototype.decorate = function(control, element)
{
  this.setUpTextbox_(control);
  goog.base(this, 'decorate', control, element);

  control.setContent(element.value);

  return element;
};

/** @override */
forms.controls.PasswordInputRenderer.prototype.setFocusable = goog.nullFunction;

/** @override */
forms.controls.PasswordInputRenderer.prototype.setState = function(textbox, state,
	enable)
{
	goog.base(this, 'setState', textbox, state, enable);
	var element = textbox.getElement();
	if (element && state == goog.ui.Component.State.DISABLED)
	{
		element.disabled = enable;
	}
};


/**
 * @override
 */
forms.controls.PasswordInputRenderer.prototype.updateAriaState = goog.nullFunction;


/**
 * @param {goog.ui.Control} textbox Textbox control to configure
 * @private
 */
forms.controls.PasswordInputRenderer.prototype.setUpTextbox_ = function(textbox)
{
	textbox.setHandleMouseEvents(false);
	textbox.setAutoStates(goog.ui.Component.State.ALL, false);
	textbox.setSupportedState(goog.ui.Component.State.FOCUSED, false);
};


/** @override **/
forms.controls.PasswordInputRenderer.prototype.setContent = function(element, value)
{
	if (element)
	{
		element.value = value;
	}
};

/** @override **/
forms.controls.PasswordInputRenderer.prototype.getCssClass = function()
{
	return forms.controls.PasswordInputRenderer.CSS_CLASS;
};
