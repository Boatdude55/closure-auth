/**
 * @fileoverview
 *
 * Form Component
 * Inspired by MorningJs, Formik
 * State is Local
 */

goog.provide('forms.Form');

goog.require('goog.dom.forms');
goog.require('goog.structs.Map');
goog.require('goog.ui.Component');
goog.require('goog.ui.registry');
goog.require('goog.events.EventType');
/**
 * @todo Create Scema class, inspired by Yup
 *
 */
goog.require('forms.FormItem');
goog.require('forms.controls.EmailInput');
goog.require('forms.controls.PasswordInput');
goog.require('forms.controls.TextInput');
goog.require('forms.controls.ConfirmInput');


/**
 * [Form description]
 * @constructor
 * @param {Object=} opt_initialValues [description]
 * @param {boolean=} opt_blurValidation [description]
 * @param {boolean=} opt_changeValidation [description]
 * @extends {goog.ui.Component}
 */
forms.Form = function (opt_initialValues, opt_blurValidation, opt_changeValidation) {
	forms.Form.base(this, 'constructor');

	this.validator_ = null;

	/**
	 * [validateOnBlur description]
	 * @type {boolean}
	 */
	this.validateOnBlur = opt_blurValidation ? opt_blurValidation : false;

	/**
	 * [validateOnChange description]
	 * @type {boolean}
	 */
	this.validateOnChange = opt_changeValidation ? opt_changeValidation : true;

	/**
	 * [submitCount_ description]
	 * @type {Number|number}
	 */
	this.submitCount_ = 0;

	/**
	 * [isSubmitting_ description]
	 * @type {Boolean|boolean}
	 */
	this.isSubmitting_ = false;

	/**
	 * [elContent_ description]
	 * @type {Element}
	 */
	this.elContent_ = null;

	/**
	 * [elHeader_ description]
	 * @type {Element}
	 */
	this.elHeader_ = null;

	/**
	 * [elTitle_ description]
	 * @type {Element}
	 */
	this.elTitle_ = null;

	/**
	 * [title_ description]
	 * @type {string}
	 */
	this.title_= '';

	/**
	 * [elSubTitle_ description]
	 * @type {Element}
	 */
	this.elSubTitle_ = null;

	/**
	 * [subTitle_ description]
	 * @type {string}
	 */
	this.subTitle_= '';

	/**
	 * [elFooter_ description]
	 * @type {Element}
	 */
	this.elFooter_ = null;

	/**
	 * [elSubmit_ description]
	 * @type {Element}
	 */
	this.elSubmit_ = null;

	/**
	 * [submitName_ description]
	 * @type {string}
	 */
	this.submitName_ = '';

};
goog.inherits(forms.Form, goog.ui.Component);



forms.Form.prototype.setTitle = function (value) {
	this.title_ = value;
};

forms.Form.prototype.setSubTitle = function (value) {
	this.subTitle_ = value;
};

forms.Form.prototype.setSubmit = function (value) {
	this.submitName_ = value;
};

forms.Form.prototype.getContentElement = function () {
	return this.elContent_;
};

/**
 * @inheritDoc
 */
forms.Form.prototype.createDom = function () {

	var dom = this.getDomHelper();
	var form = dom.createDom('form', {
		'class': 'form'
	},
	this.elHeader_ = dom.createDom(
			'div', {
				'class': 'form-header'
			},
			this.elTitle_ = dom.createDom(
					'div', {
						'class': 'form-header-title'
					},
					this.title_
				),
			this.elSubTitle_ = dom.createDom(
					'div', {
						'class': 'form-header-subtitle'
					},
					this.subTitle_
				)
		),
	this.elContent_ = dom.createDom(
			'div', {
				'class': 'form-content'
			}
		),
	this.elFooter_ = dom.createDom(
			'div', {
				'class': 'form-footer'
			},
			this.elSubmit_ = dom.createDom(
					'button', {
						'class': 'form-footer-button'
					},
					this.submitName_
				)
		)
	);

	this.attachListeners_();
	this.decorateInternal(form);

};

/** @inheritDoc */
forms.Form.prototype.decorateInternal = function (el) {
	forms.Form.base(this, 'decorateInternal', el);

	var items = this.getElementsByClass('form-item');
	goog.array.forEach(items, function (itemEl) {
		var formItem = goog.ui.registry.getDecorator(itemEl);
		this.addChild(formItem);
		formItem.decorate(itemEl);
	}, this);

};

/** @inheritDoc */
forms.Form.prototype.disposeInternal = function () {
};

forms.Form.prototype.attachListeners_ = function () {

	this.getHandler().listen(this.elSubmit_, goog.events.EventType.CLICK, this.handleSubmit_);

};

/**
 * Adds form item to form
 *
 * @param {string=} opt_label
 * @param {string=} opt_className
 * @param {Object=} opt_controlConfig
 * @param {number=} opt_index
 * @return {!forms.FormItem}
 */
forms.Form.prototype.addFormItem = function (opt_label, opt_className, opt_controlConfig, opt_index) {

	var formItem = new forms.FormItem();

	opt_label = opt_label ? opt_label : "DefaultLabel";
	opt_className = opt_className ? opt_className : "text-input";

	formItem.setLabel(opt_label);

	var control = goog.ui.registry.getDecoratorByClassName(opt_className);
	if (!control) {
		console.log(control);
		throw new Error('Decorator not found for control type "' + opt_className + '"');

	}

	control.setConfig(opt_controlConfig);

	this.setValidators_(control);

	formItem.addChild(control,true);

	if (typeof opt_index == 'number') {

		this.addChildAt(formItem, opt_index, true);

	}
	else {

		this.addChild(formItem, true);

	}

	return formItem;
};

/**
 * Removes all form items
 */
forms.Form.prototype.removeFormItems = function () {

	var formItems = [];

	this.forEachChild(function(child) {
		if (child instanceof forms.FormItem) {
			formItems.push(child);
		}
	}, this);

	for (var i = 0; i < formItems.length; i++) {

		this.removeChild(formItems[i], true);

	}

	return formItems;

};

forms.Form.prototype.setValidateStrategy = function (validateStrategy) {

	this.validator_ = validateStrategy;

};

forms.Form.prototype.setValidators_ = function (control) {

	if ( this.validateOnBlur ) {

		this.setValidationOnBlur_(control);

	}

	if ( this.validateOnChange ) {

		this.setValidationOnChange_(control);

	}

}

forms.Form.prototype.setValidationOnBlur_ = function(control) {

	var validator_ = this.validator_;

	validator_.listen(control, goog.events.EventType.BLUR, function (event) {

		let parent = event.target.getParent();
		let key = event.target.fieldName;
		let newValue = event.target.getValue();

		let result = validator_.validate(key, newValue);
		let errors = validator_.getErrors();
		let ctrl = goog.object.get(errors, key);

		if (goog.DEBUG) {
			console.log('validateOnBlur: ', {
				parent,
				key,
				newValue,
				result,
				errors,
				ctrl,
			});
		}

		if ( goog.object.getCount(errors) < 0 ) {

			return;

		}

		parent.setErrors(goog.object.getValues(ctrl));

		this.setValidState_(validator_.isValid());

	});

	return true;

};

forms.Form.prototype.setValidationOnChange_ = function(control) {

	var validator_ = this.validator_;

	validator_.listenWithScope(control, goog.events.EventType.CHANGE, function (event) {

		let parent = event.target.getParent();
		let key = event.target.fieldName;
		let newValue = event.target.getValue();

		let result = validator_.validate(key, newValue);
		let errors = validator_.getErrors();
		let ctrl = goog.object.get(errors, key);

		if (goog.DEBUG) {
			console.log('validateOnChange: ', {
				parent,
				key,
				newValue,
				result,
				errors,
				ctrl,
			});
		}

		parent.setErrors(goog.object.getValues(ctrl));

		this.setValidState_(validator_.isValid());

	}, false, this);

	return true;

};

forms.Form.prototype.setValidState_ = function (isValid) {

	if ( goog.DEBUG ) {
		console.log('setValidState_: ', {
			isValid,
		})
	}
	goog.dom.forms.setDisabled(this.elSubmit_, !isValid);

	return true;

};

forms.Form.prototype.onSubmit = function () {
	console.log("Form onSubmit");
};

forms.Form.prototype.onReset = function () {
	console.log("Form onReset");
};

forms.Form.prototype.handleSubmit_ = function (e) {

	e.preventDefault();

	console.log("Form handleSubmit_");


};

forms.Form.prototype.handleBlur_ = function (e) {
	if ( this.validateOnBlur ) {

		console.log('validateOnBlur');

	}
	console.groupEnd();
};

forms.Form.prototype.handleChange_ = function (e) {
	if ( this.validateOnChange ) {

		console.log('validateOnChange');

	}
	console.groupEnd();
};

forms.Form.prototype.validateForm_ = function () {

};

forms.Form.prototype.getControlByName = function (name) {

};

forms.Form.prototype.getFormItemByName = function (name) {

};

forms.Form.prototype.getData = function () {

};

forms.Form.prototype.handleValidationComplete = function (e) {

};

forms.Form.prototype.bind = function (bind) {

};

forms.Form.prototype.reset = function () {

};

forms.Form.prototype.validate = function () {

};

forms.Form.prototype.setData = function (data) {

};

forms.Form.prototype.unbind = function (bind) {

};

forms.Form.prototype.unbindAll = function () {

};

/**
 * Register this control so it can be created from markup.
 */
goog.ui.registry.setDecoratorByClassName(
  'form',
  function() {
    return new forms.Form();
  });
