/**
 * @fileoverview Form item, consists of label + control
 * Bindable to model for change events.
 */

goog.provide('forms.FormItem');

goog.require('goog.ui.Component');
goog.require('goog.ui.registry');
goog.require('goog.dom');

/**
 * Form item
 *
 * @constructor
 * @extends {goog.ui.Component}
 */
forms.FormItem = function () {
  forms.FormItem.base(this, 'constructor');

  /**
   * Label
   *
   * @type {string}
   * @private
   */
  this.label_ = '';

  /**
   * Bindings for change events
   *
   * @type {Object}
   * @private
   */
  this.bind_ = null;

  this.el_ = null;

  this.elContent_= null;

  this.elError_ = null;

  this.elInfo_ = null;

  /**
   * Binding handler, manages listeners attached to change events
   *
   * @type {goog.events.EventHandler}
   * @private
   */
  this.bindHandler_ = new goog.events.EventHandler(this);
};
goog.inherits(forms.FormItem, goog.ui.Component);

/**
 * [createDom description]
 * @inheritDoc
 */
forms.FormItem.prototype.createDom = function () {
  var dom = this.getDomHelper(),
  el = dom.createDom('div', 'form-item', [
      dom.createDom('div', 'form-item-label', this.label_),
      this.elContent_ = dom.createDom('div', 'form-item-control'),
      this.elInfo_ = dom.createDom('div', 'form-item-info', dom.createDom(
      	'ul',
      	'form-item-info-content'
      	)),
      this.elError_ = dom.createDom('div', 'form-item-error', dom.createDom(
      	'ul',
      	'form-item-error-content'
      	)),
      dom.createDom('div', 'clear')
  ]);

  this.decorateInternal(el);
};

forms.FormItem.prototype.getContentElement = function () {
	return this.elContent_;
};

/** @inheritDoc */
forms.FormItem.prototype.decorateInternal = function (el) {
  forms.FormItem.base(this, 'decorateInternal', el);

/*  var controlEls = this.getElementsByClass('form-control');
  for (var i = 0; i < controlEls.length; i++)
  {
    var control = goog.ui.registry.getDecorator(controlEls[i]);
    if (!control)
    {
      if (goog.DEBUG)
      {
        console.warn('Decorator not found for %o', controlEls[i]);
      }
      continue;
    }
    this.addChild(control);
    control.decorate(controlEls[i]);
  }

  if (goog.DEBUG && controlEls.length === 0)
  {
    console.warn('No control found: %o', el);
  }*/

};

forms.FormItem.prototype.setLabel = function(label) {
	this.label_ = label;

	var el = this.getElement();
	if (el) {
		this.getElementByClass('form-item-label').innerHTML = label;
	}
};

forms.FormItem.prototype.setErrors = function(errors) {

	var dom = this.getDomHelper();
	var el = this.getElement();
	var elError = dom.getElementByClass('form-item-error-content', el);
	errors = errors[0];

	dom.removeChildren(elError);

	if ( goog.isArray(errors) && errors.length > 0 ) {

		var i = 0;
		while( errors.length - 1 >= i) {

			let el = dom.createDom(
				'li',
				'form-error',
				errors[i]
			);

			dom.appendChild(elError, el);

			i++;

		};

	}
};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'form-item',
  function() {
    return new forms.FormItem();
  });
