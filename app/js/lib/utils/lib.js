/**
 * @fileoverview Utilities for Apps
 */

goog.provide('util');

/**
 * isEmpty Returns true if the specified value is empty.
 * @param  {?}  obj Variable to test.
 * @return {boolean}     Whether variable is empty.
 */
util.isEmpty = function(obj) {

	let none = obj === null || obj === undefined;

	if (none) {

		return none;

	}

	if (typeof obj.size === 'number') {

		return !obj.size;

	}

	let objectType = typeof obj;

	if (objectType === 'object') {

		let size = goog.object.get(obj, 'size');

		if (typeof size === 'number') {

			return !size;

		}

	}

	if (typeof obj.length === 'number' && objectType !== 'function') {

		return !obj.length;

	}

	if (objectType === 'object') {

		let length = goog.object.get(obj, 'length');

		if (typeof length === 'number') {

			return !length;

		}

	}

	return false;

};

/**
 * [isEqual Returns true if the specified values iare equal.
 * @param  {Object}  a [description]
 * @param  {Object}  b [description]
 * @return {boolean}   [description]
 */
util.isEqual = function(a, b) {

	if (a instanceof Date && b instanceof Date) {

		return a.getTime() === b.getTime();

	}

	return a === b;

};
