/**
 * @fileoverview
 *
 * Expandable animation
 */
goog.provide('animation');
goog.provide('animation.Expandble');
goog.require('widget.ExpandableContainerEvent');

goog.require('goog.a11y.aria.Role');
goog.require('goog.dom');
goog.require('goog.dom.TagName');
goog.require('goog.events');
goog.require('goog.fx.Animation');
goog.require('goog.fx.Transition');
goog.require('goog.fx.easing');



/**
 * Zippy widget. Expandable/collapsible container, clicking the header toggles
 * the visibility of the content.
 */
animation.Expandble = function() {
};

/**
 * Constants for event names.
 *
 * @const
 */
animation.Expandble.Events = {
  // The beginning of the animation when the zippy state toggles.
  TOGGLE_ANIMATION_BEGIN: goog.events.getUniqueId('toggleanimationbegin'),
  // The end of the animation when the zippy state toggles.
  TOGGLE_ANIMATION_END: goog.events.getUniqueId('toggleanimationend')
};


/**
 * Duration of expand/collapse animation, in milliseconds.
 * @type {number}
 */
animation.Expandble.prototype.animationDuration = 500;


/**
 * Acceleration function for expand/collapse animation.
 * @type {!Function}
 */
animation.Expandble.prototype.animationAcceleration = goog.fx.easing.easeOut;


/**
 * @return {boolean} Whether the zippy is in the process of being expanded or
 *     collapsed.
 */
animation.Expandble.prototype.isBusy = function() {
  return this.anim_ != null;
};


/**
 * Sets expanded state.
 *
 * @param {boolean} expanded Expanded/visibility state.
 * @override
 */
animation.Expandble.prototype.setExpanded = function(expanded) {
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

  // Updates header class name after the animation has been stopped.
  this.updateHeaderClassName(expanded);

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
 * Called during animation
 *
 * @param {goog.events.Event} e The event.
 * @private
 */
animation.Expandble.prototype.onAnimate_ = function(e) {
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
animation.Expandble.prototype.onAnimationBegin_ = function(expanding) {
  this.dispatchEvent(new widget.ExpandableContainerEvent(
      animation.Expandble.Events.TOGGLE_ANIMATION_BEGIN, this, expanding));
};


/**
 * Called once the expand/collapse animation has completed.
 *
 * @param {boolean} expanded Expanded/visibility state.
 * @private
 */
animation.Expandble.prototype.onAnimationCompleted_ = function(expanded) {
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
      new widget.ExpandableContainerEvent(goog.ui.Zippy.Events.TOGGLE, this, expanded));
  this.dispatchEvent(new widget.ExpandableContainerEvent(
      animation.Expandble.Events.TOGGLE_ANIMATION_END, this, expanded));
};
