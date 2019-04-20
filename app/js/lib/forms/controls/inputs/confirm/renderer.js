/**
 * @fileoverview Text Input Renderer
 */
goog.provide('forms.controls.ConfirmInputRenderer');

goog.require('goog.ui.ControlRenderer');

/**
 * Textbox Renderer
 *
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
forms.controls.ConfirmInputRenderer = function () {
	forms.controls.ConfirmInputRenderer.base(this, 'constructor');
};

goog.inherits(forms.controls.ConfirmInputRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(forms.controls.ConfirmInputRenderer);

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
forms.controls.ConfirmInputRenderer.CSS_CLASS = goog.getCssName('confirm-input');


/**
 * @param {goog.ui.Control} control
 * @return {Element}
 * @override
 */
forms.controls.ConfirmInputRenderer.prototype.createDom = function(control) {
	this.setUpTextbox_(control);

	var element = control.getDomHelper().createDom('input', {
		'type': control.type,
		'class': this.getClassNames(control).join(' '),
		'id': 'password',
		'disabled': !control.isEnabled(),
		'required': true,
		'aria-describedby': '',
		'aria-required': true,
		'name': control.fieldName,
		'data': control.target
	});

	return element;
};

/** @override */
forms.controls.ConfirmInputRenderer.prototype.decorate = function(control, element)
{
  this.setUpTextbox_(control);
  goog.base(this, 'decorate', control, element);

  control.setContent(element.value);

  return element;
};

/** @override */
forms.controls.ConfirmInputRenderer.prototype.setFocusable = goog.nullFunction;

/** @override */
forms.controls.ConfirmInputRenderer.prototype.setState = function(textbox, state,
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
forms.controls.ConfirmInputRenderer.prototype.updateAriaState = goog.nullFunction;


/**
 * @param {goog.ui.Control} textbox Textbox control to configure
 * @private
 */
forms.controls.ConfirmInputRenderer.prototype.setUpTextbox_ = function(textbox)
{
	textbox.setHandleMouseEvents(false);
	textbox.setAutoStates(goog.ui.Component.State.ALL, false);
	textbox.setSupportedState(goog.ui.Component.State.FOCUSED, false);
};


/** @override **/
forms.controls.ConfirmInputRenderer.prototype.setContent = function(element, value)
{
	if (element)
	{
		element.value = value;
	}
};

/** @override **/
forms.controls.ConfirmInputRenderer.prototype.getCssClass = function()
{
	return forms.controls.ConfirmInputRenderer.CSS_CLASS;
};
