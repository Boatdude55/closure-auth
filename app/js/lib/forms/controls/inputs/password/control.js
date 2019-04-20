/**
 * @fileoverview Text Password control.
 */
goog.provide('forms.controls.PasswordInput');

goog.require('goog.async.Delay');
goog.require('goog.ui.Control');
goog.require('goog.ui.registry');
goog.require('goog.events.KeyCodes');
goog.require('forms.controls.PasswordInputRenderer');


/**
 * A textbox control
 *
 * @param {string} content Text to set as the textbox's value.
 * @param {forms.controls.PasswordInputRenderer=} opt_renderer Renderer used to render or
 *   decorate the textbox.
 * @param {goog.dom.DomHelper=} opt_domHelper Optional DOM hepler, used for
 *   document interaction.
 * @constructor
 * @extends {goog.ui.Control}
 */
forms.controls.PasswordInput = function (content, opt_renderer, opt_domHelper) {
	forms.controls.PasswordInput.base(this, 'constructor', content, opt_renderer ||
		forms.controls.PasswordInputRenderer.getInstance(), opt_domHelper);

	/**
	 * Delay after which change event is fired
	 *
	 * @type {goog.async.Delay}
	 * @private
	 */
	this.changeDelay_ = new goog.async.Delay(this.fireChangeEvent_, 300, this);

	/**
	 * Defines whether change event should be delayed
	 *
	 * @type {boolean}
	 * @private
	 */
	this.delayChangeEvent_ = true;

	/**
	 * Field name
	 *
	 * @type {string}
	 * @protected
	 */
	this.fieldName = '';

	/**
	 * Textbox value
	 *
	 * @type {*}
	 * @private
	 */
	this.value_ = '';

	/**
	 * Textbox placeholder
	 *
	 * @type {string}
	 * @private
	 */
	this.placeholder_ = '';

	if (!content) {
		this.setContent('');
	}
};
goog.inherits(forms.controls.PasswordInput, goog.ui.Control);

/** @inheritDoc */
forms.controls.PasswordInput.prototype.decorateInternal = function (el) {
	forms.controls.PasswordInput.base(this, 'decorateInternal', el);

	this.fieldName = el.name;

	if (this.className_)
	{
		goog.dom.classlist.add(el, this.className_);
	}
};

/** @inheritDoc */
forms.controls.PasswordInput.prototype.enterDocument = function () {
	forms.controls.PasswordInput.base(this, 'enterDocument');

	var el = this.getElement();

	if (this.placeholder_)
	{
		el.placeholder = this.placeholder_;
	}

	this.getHandler()
	    .listen(el, goog.events.EventType.KEYDOWN, this.handleKeyDown_)
	    .listen(el, goog.events.EventType.KEYUP, this.handleKeyUp_)
	    .listen(el, goog.events.EventType.CHANGE, this.fireChangeEvent_);

};

/**
 * Sets textbox config
 *
 * @param {Object} config
 */
forms.controls.PasswordInput.prototype.setConfig = function (config) {

	if ( !goog.isDefAndNotNull(config) ) {

		return;

	}

	if (goog.isDef(config.fieldName)) {

		this.fieldName = config.fieldName;

	}

	if (goog.isDef(config.type)) {

		this.type = config.type;

	}
};

/**
 * Returns current value
 *
 * @return {*}
 */
forms.controls.PasswordInput.prototype.getValue = function () {
  return this.getElement() ? this.getElement().value : '';
};

/**
 * Sets control's value
 *
 * @param {*} value
 */
forms.controls.PasswordInput.prototype.setValue = function (value) {
	if (this.getElement().value != value) {
		this.getElement().value = value;
		this.value_ = /** @type {string} */ (value);
	}
};

/**
 * Fires change event if value has actually been changed
 *
 * @private
 */
forms.controls.PasswordInput.prototype.fireChangeEvent_ = function () {

	if (this.value_ != this.getValue()) {

		this.value_ = this.getValue();

		this.dispatchEvent(goog.events.EventType.CHANGE);

	}

};

/**
 * Handles key down events
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
forms.controls.PasswordInput.prototype.handleKeyDown_ = function (e) {

	if (e.keyCode == goog.events.KeyCodes.ENTER) {

		this.dispatchEvent(goog.events.EventType.SUBMIT);

	}

	this.dispatchEvent(goog.events.EventType.KEYDOWN);

};

/**
 * Handles key up events
 *
 * @param {goog.events.BrowserEvent} e
 * @private
 */
forms.controls.PasswordInput.prototype.handleKeyUp_ = function (e) {

	this.dispatchEvent(goog.events.EventType.KEYUP);

	if (this.delayChangeEvent_) {

		this.changeDelay_.start();

	}else {

		this.fireChangeEvent_();

	}

};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  forms.controls.PasswordInputRenderer.CSS_CLASS,
  function() {
    return new forms.controls.PasswordInput(' ');
  });
