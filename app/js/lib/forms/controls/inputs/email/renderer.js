/**
 * @fileoverview Text Input Renderer
 */
goog.provide('forms.controls.EmailInputRenderer');

goog.require('goog.ui.ControlRenderer');

/**
 * Textbox Renderer
 *
 * @constructor
 * @extends {goog.ui.ControlRenderer}
 */
forms.controls.EmailInputRenderer = function () {
	forms.controls.EmailInputRenderer.base(this, 'constructor');
};

goog.inherits(forms.controls.EmailInputRenderer, goog.ui.ControlRenderer);
goog.addSingletonGetter(forms.controls.EmailInputRenderer);

/**
 * Default CSS class to be applied to the root element of components rendered
 * by this renderer.
 * @type {string}
 */
forms.controls.EmailInputRenderer.CSS_CLASS = goog.getCssName('email-input');


/**
 * @param {goog.ui.Control} control
 * @return {Element}
 * @override
 */
forms.controls.EmailInputRenderer.prototype.createDom = function(control) {
	this.setUpTextbox_(control);

	var element = control.getDomHelper().createDom('input', {
		'type': 'email',
		'class': this.getClassNames(control).join(' '),
		'disabled': !control.isEnabled(),
		'maxlength': 100,
		'autocomplete': 'off',
		'required': true,
		'name': control.fieldName
	});

	return element;
};

/** @override */
forms.controls.EmailInputRenderer.prototype.decorate = function (control, element) {
  this.setUpTextbox_(control);
  goog.base(this, 'decorate', control, element);

  control.setContent(element.value);

  return element;
};

/** @override */
forms.controls.EmailInputRenderer.prototype.setFocusable = goog.nullFunction;

/** @override */
forms.controls.EmailInputRenderer.prototype.setState = function(textbox, state, enable) {
	goog.base(this, 'setState', textbox, state, enable);
	var element = textbox.getElement();
	if (element && state == goog.ui.Component.State.DISABLED) {
		element.disabled = enable;
	}
};


/**
 * @override
 */
forms.controls.EmailInputRenderer.prototype.updateAriaState = goog.nullFunction;


/**
 * @param {goog.ui.Control} textbox Textbox control to configure
 * @private
 */
forms.controls.EmailInputRenderer.prototype.setUpTextbox_ = function (textbox) {
	textbox.setHandleMouseEvents(false);
	textbox.setAutoStates(goog.ui.Component.State.ALL, false);
	textbox.setSupportedState(goog.ui.Component.State.FOCUSED, false);
};


/** @override **/
forms.controls.EmailInputRenderer.prototype.setContent = function (element, value) {
	if (element) {
		element.value = value;
	}
};

/** @override **/
forms.controls.EmailInputRenderer.prototype.getCssClass = function () {
	return forms.controls.EmailInputRenderer.CSS_CLASS;
};
