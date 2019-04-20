/**
 * @fileoverview
 *
 * Container Widget
 */

goog.provide('widget.ExpandableContainer');
goog.provide('widget.ExpandableContainerEvent');

goog.require('goog.a11y.aria');
goog.require('goog.a11y.aria.Role');
goog.require('goog.a11y.aria.State');
goog.require('goog.style');
goog.require('goog.dom');
goog.require('goog.dom.classlist');
goog.require('goog.fx.Animation');
goog.require('goog.fx.Transition');
goog.require('goog.fx.easing');
goog.require('goog.events');
goog.require('goog.events.Event');
goog.require('goog.events.EventHandler');
goog.require('goog.events.EventTarget');
goog.require('goog.events.EventType');
goog.require('goog.events.KeyCodes');
goog.require('goog.events.KeyHandler');
goog.require('goog.ui.Component');

/**
 * ExpandableContainer Expandable/collapsible container, clicking the header toggles
 * the visibility of the content.
 * @constructor
 * @extends {goog.ui.Component}
 * @param {boolean=} opt_expanded Initial expanded/visibility state. If
 *     undefined, attempts to infer the state from the DOM. Setting visibility
 *     using one of the standard Soy templates guarantees correct inference.
 * @param {goog.a11y.aria.Role<string>=} opt_role     ARIA role, default TAB.
 */
widget.ExpandableContainer = function (opt_expanded, opt_role) {
	widget.ExpandableContainer.base(this, 'constructor');

	this.elWrapper_ = null;

	this.elContent_ = null;

	/**
	 * ARIA role.
	 * @type {goog.a11y.aria.Role<string>}
	 * @private
	 */
	this.role_ = opt_role || goog.a11y.aria.Role.TAB;

	/**
	 * Expanded state.
	 * @type {boolean}
	 * @private
	 */
	this.expanded_ = opt_expanded == true;

	/**
	 * A mouse events handler. If there are two headers it is shared for both.
	 * @type {goog.events.EventHandler<!widget.ExpandableContainer>}
	 * @private
	 */
	this.mouseEventHandler_ = new goog.events.EventHandler(this);

};
goog.inherits(widget.ExpandableContainer, goog.ui.Component);
goog.tagUnsealableClass(widget.ExpandableContainer);

/**
 * Constants for event names
 *
 * @const
 */
widget.ExpandableContainer.Events = {
	// Expandable Container will dispatch an ACTION event for user interaction. Mimics
	// `goog.ui.Controls#performActionInternal` by first changing
	// the toggle state and then dispatching an ACTION event.
	ACTION: 'action',
	// Expandable Container state is toggled from collapsed to expanded or vice versa.
	TOGGLE: 'toggle',
	// The beginning of the animation when the zippy state toggles.
	TOGGLE_ANIMATION_BEGIN: goog.events.getUniqueId('toggleanimationbegin'),
	// The end of the animation when the zippy state toggles.
	TOGGLE_ANIMATION_END: goog.events.getUniqueId('toggleanimationend')
};

/**
 * Duration of expand/collapse animation, in milliseconds.
 * @type {number}
 */
widget.ExpandableContainer.prototype.animationDuration = 500;


/**
 * Acceleration function for expand/collapse animation.
 * @type {!Function}
 */
widget.ExpandableContainer.prototype.animationAcceleration = goog.fx.easing.easeOut;


/**
 * Whether to listen for and handle mouse events; defaults to false.
 * @type {boolean}
 * @private
 */
widget.ExpandableContainer.prototype.handleMouseEvents_ = false;

widget.ExpandableContainer.CSS_CLASS = goog.getCssName("expandable-container");

widget.ExpandableContainer.prototype.getCssClass = function () {
	return widget.ExpandableContainer.CSS_CLASS;
};

widget.ExpandableContainer.prototype.getContentElement = function () {
	return this.elContent_;
};

widget.ExpandableContainer.prototype.getWrapperElement = function () {
	return this.elWrapper_;
};

widget.ExpandableContainer.prototype.createDom = function () {
	var domHelper = this.getDomHelper();
	var elWrapper_, elContent_;
	// Create wrapper element and move content into it.
	this.elWrapper_ = elWrapper_ = domHelper.createDom(goog.dom.TagName.DIV, {
			'style': 'overflow:hidden',
			'class': this.getCssClass()
		},
		this.elContent_ = elContent_ = domHelper.createDom(
				goog.dom.TagName.DIV, {
					'class': goog.getCssName(this.getCssClass(), 'content')
				}
			)
		);
	elWrapper_.style.display = this.isExpanded() ? '' : 'none';
	this.setElementInternal(elWrapper_);
};

/**
 * Expands content pane.
 */
widget.ExpandableContainer.prototype.expand = function() {
	this.setExpanded(true);
};


/**
 * Collapses content pane.
 */
widget.ExpandableContainer.prototype.collapse = function() {
	this.setExpanded(false);
};


/**
 * Toggles expanded state.
 */
widget.ExpandableContainer.prototype.toggle = function() {
	this.setExpanded(!this.expanded_);
};

/**
 * Sets expanded state.
 *
 * @param {boolean} expanded Expanded/visibility state.
 */
widget.ExpandableContainer.prototype.setExpanded = function(expanded) {
	if (this.isExpanded() == expanded && !this.anim_) {

		return;

	}

	// Reset display property of wrapper to allow content element to be
	// measured.
	if (this.elWrapper_.style.display == 'none') {

		this.elWrapper_.style.display = '';

	}

	// Measure content element.
	var h = this.getContentElement().offsetHeight;

	// Stop active animation (if any) and determine starting height.
	var startH = 0;
	if (this.anim_) {

		expanded = this.isExpanded();
		goog.events.removeAll(this.anim_);
		this.anim_.stop(false);

		var marginTop = parseInt(this.getContentElement().style.marginTop, 10);
		startH = h - Math.abs(marginTop);

	} else {

		startH = expanded ? 0 : h;

	}

	// Set up expand/collapse animation.
	this.anim_ = new goog.fx.Animation(
						[0, startH], [0, expanded ? h : 0], this.animationDuration,
						this.animationAcceleration);

	var events = [
		goog.fx.Transition.EventType.BEGIN, goog.fx.Animation.EventType.ANIMATE,
		goog.fx.Transition.EventType.END
	];

	goog.events.listen(this.anim_, events, this.onAnimate_, false, this);
	goog.events.listen(
		this.anim_, goog.fx.Transition.EventType.BEGIN,
		goog.bind(this.onAnimationBegin_, this, expanded));
	goog.events.listen(
		this.anim_, goog.fx.Transition.EventType.END,
		goog.bind(this.onAnimationCompleted_, this, expanded));

	// Start animation.
	this.anim_.play(false);

};

/**
 * Sets expanded internal state.
 *
 * @param {boolean} expanded Expanded/visibility state.
 * @protected
 */
widget.ExpandableContainer.prototype.setExpandedInternal = function(expanded) {
	this.expanded_ = expanded;
};

/**
 * @return {boolean} Whether the Expandable Container is expanded.
 */
widget.ExpandableContainer.prototype.isExpanded = function() {
	return this.expanded_;
};

/**
 * Sets whether the Expandable Container handles it's own mouse events.
 * @param {boolean} enable Whether the Zippy handles mouse events.
 */
widget.ExpandableContainer.prototype.setHandleMouseEvents = function(enable) {
  if (this.handleMouseEvents_ != enable) {
    this.handleMouseEvents_ = enable;
    if (enable) {
      this.enableMouseEventsHandling_(this.elWrapper_);
      // this.enableMouseEventsHandling_(this.elExpandedHeader_);
    } else {
      this.mouseEventHandler_.removeAll();
    }
  }
};

/**
 * Enables mouse events handling for the passed header element.
 * @param {Element} el The header element.
 * @private
 */
widget.ExpandableContainer.prototype.enableMouseEventsHandling_ = function(el) {
  if (el) {
    this.mouseEventHandler_.listen(
        el, goog.events.EventType.CLICK, this.onHeaderClick_);
  }
};

/**
 * Click event handler for header element.
 *
 * @param {!goog.events.BrowserEvent} event Click event.
 * @private
 */
widget.ExpandableContainer.prototype.onHeaderClick_ = function(event) {
  this.toggle();
  this.dispatchActionEvent_(event);
};

/**
 * Dispatch an ACTION event whenever there is user interaction with the header.
 * Please note that after the Expandable Container state change is completed a TOGGLE event
 * will be dispatched. However, the TOGGLE event is dispatch on every toggle,
 * including programmatic call to `#toggle`.
 * @param {!goog.events.BrowserEvent} triggeringEvent
 * @private
 */
widget.ExpandableContainer.prototype.dispatchActionEvent_ = function(triggeringEvent) {
	this.dispatchEvent(new widget.ExpandableContainerEvent(
			widget.ExpandableContainer.Events.ACTION, this, this.expanded_, triggeringEvent));
};

/**
 * @return {boolean} Whether the expandable container is in the process of being expanded or
 *     collapsed.
 */
widget.ExpandableContainer.prototype.isBusy = function () {
	return this.anim_ != null;
};

/**
 * Called during animation
 *
 * @param {goog.events.Event} e The event.
 * @private
 */
widget.ExpandableContainer.prototype.onAnimate_ = function (e) {
	var contentElement = this.getContentElement();
	var h = contentElement.offsetHeight;
	contentElement.style.marginTop = (e.y - h) + 'px';
};


/**
 * Called once the expand/collapse animation has started.
 *
 * @param {boolean} expanding Expanded/visibility state.
 * @private
 */
widget.ExpandableContainer.prototype.onAnimationBegin_ = function (expanding) {
	this.dispatchEvent(new widget.ExpandableContainerEvent(
  		widget.ExpandableContainer.Events.TOGGLE_ANIMATION_BEGIN, this, expanding));
};


/**
 * Called once the expand/collapse animation has completed.
 *
 * @param {boolean} expanded Expanded/visibility state.
 * @private
 */
widget.ExpandableContainer.prototype.onAnimationCompleted_ = function (expanded) {
	// Fix wrong end position if the content has changed during the animation.
	if (expanded) {

		this.getContentElement().style.marginTop = '0';

	}

	goog.events.removeAll(/** @type {!goog.fx.Animation} */ (this.anim_));
	this.setExpandedInternal(expanded);
	this.anim_ = null;

	if (!expanded) {

		this.elWrapper_.style.display = 'none';

	}

	// Fire toggle event.
	this.dispatchEvent(
	  new widget.ExpandableContainerEvent(widget.ExpandableContainer.Events.TOGGLE, this, expanded));
	this.dispatchEvent(new widget.ExpandableContainerEvent(
	  widget.ExpandableContainer.Events.TOGGLE_ANIMATION_END, this, expanded));

};
/**
 * Object representing a zippy toggle event.
 *
 * @param {string} type Event type.
 * @param {widget.ExpandableContainer} target Expandable Container widget initiating event.
 * @param {boolean} expanded Expanded state.
 * @param {!goog.events.BrowserEvent=} opt_triggeringEvent
 * @extends {goog.events.Event}
 * @constructor
 * @final
 */
widget.ExpandableContainerEvent = function(type, target, expanded, opt_triggeringEvent) {
	widget.ExpandableContainerEvent.base(this, 'constructor', type, target);

	/**
	 * The expanded state.
	 * @type {boolean}
	 */
	this.expanded = expanded;

	/**
	 * For ACTION events, the key or mouse event that triggered this event, if
	 * there was one.
	 * @type {?goog.events.BrowserEvent}
	 */
	this.triggeringEvent = opt_triggeringEvent || null;
};
goog.inherits(widget.ExpandableContainerEvent, goog.events.Event);
