/**
 * @fileoverview Text Input Renderer
 */
goog.provide('forms.controls.TextInputRenderer');

goog.require('goog.ui.ControlRenderer');

/**
 * Textbox Renderer
 *
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
forms.controls.TextInputRenderer = function () {
	forms.controls.TextInputRenderer.base(this, 'constructor');
};

goog.inherits(forms.controls.TextInputRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(forms.controls.TextInputRenderer);

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
forms.controls.TextInputRenderer.CSS_CLASS = goog.getCssName('text-input');


/**
 * @param {goog.ui.Control} control
 * @return {Element}
 * @override
 */
forms.controls.TextInputRenderer.prototype.createDom = function(control) {
	this.setUpTextbox_(control);

	var element = control.getDomHelper().createDom('input', {
		'type': 'text',
		'class': this.getClassNames(control).join(' '),
		'disabled': !control.isEnabled(),
		'value': control.getContent(),
		'maxlength': 20,
		'autocomplete': "username",
		'required': true,
		'name': control.fieldName
	});

	return element;
};

/** @override */
forms.controls.TextInputRenderer.prototype.decorate = function(control, element)
{
  this.setUpTextbox_(control);
  goog.base(this, 'decorate', control, element);

  control.setContent(element.value);

  return element;
};

/** @override */
forms.controls.TextInputRenderer.prototype.setFocusable = goog.nullFunction;

/** @override */
forms.controls.TextInputRenderer.prototype.setState = function(textbox, state,
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
forms.controls.TextInputRenderer.prototype.updateAriaState = goog.nullFunction;


/**
 * @param {goog.ui.Control} textbox Textbox control to configure
 * @private
 */
forms.controls.TextInputRenderer.prototype.setUpTextbox_ = function(textbox)
{
	textbox.setHandleMouseEvents(false);
	textbox.setAutoStates(goog.ui.Component.State.ALL, false);
	textbox.setSupportedState(goog.ui.Component.State.FOCUSED, false);
};


/** @override **/
forms.controls.TextInputRenderer.prototype.setContent = function(element, value)
{
	if (element)
	{
		element.value = value;
	}
};

/** @override **/
forms.controls.TextInputRenderer.prototype.getCssClass = function()
{
	return forms.controls.TextInputRenderer.CSS_CLASS;
};
