'use strict';


/**
 * @author Sebastian Pekarek
 * @module alarm
 * @constructor ICalAlarm Alarm
 */
var ICalAlarm = function(_data, event) {
	var vars,
		i,
		data;

	if(!event) {
		throw '`event` option required!';
	}

	vars = {
		types: ['display', 'audio']
	};

	data = {
		type: null,
		trigger: null,
		repeat: null,
		repeatInterval: null,
		attach: null,
		description: null
	};


	/**
	 * Set/Get the alarm type
	 *
	 * @param type Type
	 * @since 0.2.1
	 * @returns {ICalAlarm|String}
	 */
	this.type = function(type) {
		if(!type) {
			return data.type;
		}

		if(vars.types.indexOf(type) === -1) {
			throw '`type` is not correct, must be either `display` or `audio`!';
		}

		data.type = type;
		return this;
	};


	/**
	 * Set/Get seconds before event to trigger alarm
	 *
	 * @param {Number|Date} trigger Seconds before alarm triggeres
	 * @since 0.2.1
	 * @returns {ICalAlarm|Number|Date}
	 */
	this.trigger = function(trigger) {
		if(!trigger && data.trigger instanceof Date) {
			return data.trigger;
		}
		if(!trigger) {
			return -1 * data.trigger;
		}

		if(trigger instanceof Date) {
			data.trigger = trigger;
			return this;
		}
		if(typeof trigger === 'number' && isFinite(trigger)) {
			data.trigger = -1 * trigger;
			return this;
		}

		throw '`trigger` is not correct, must be either typeof `Number` or `Date`!';
	};


	/**
	 * Set/Get seconds after event to trigger alarm
	 *
	 * @param {Number|Date} trigger Seconds after alarm triggeres
	 * @since 0.2.1
	 * @returns {ICalAlarm|Number|Date}
	 */
	this.triggerAfter = function(trigger) {
		if(!trigger) {
			return data.trigger;
		}

		return this.trigger(typeof trigger === 'number' ? -1 * trigger : trigger);
	};

	/**
	 * Set/Get seconds before event to trigger alarm
	 *
	 * @param {Number|Date} trigger Seconds before alarm triggeres
	 * @since 0.2.1
	 * @alias trigger
	 * @returns {ICalAlarm|Number|Date}
	 */
	this.triggerBefore = this.trigger;


	/**
	 * Set/Get Alarm Repetitions
	 *
	 * @param {Number} Number of repetitions
	 * @since 0.2.1
	 * @returns {ICalAlarm|Number}
	 */
	this.repeat = function(repeat) {
		if(!repeat) {
			return data.repeat;
		}

		if(typeof repeat !== 'number' || !isFinite(repeat)) {
			throw '`repeat` is not correct, must be numeric!';
		}

		data.repeat = repeat;
		return this;
	};


	/**
	 * Set/Get Repeat Interval
	 *
	 * @param {Number} Interval in seconds
	 * @since 0.2.1
	 * @returns {ICalAlarm|Number|Null}
	 */
	this.interval = function(interval) {
		if(!interval) {
			return data.interval;
		}

		if(typeof interval !== 'number' || !isFinite(interval)) {
			throw '`interval` is not correct, must be numeric!';
		}

		data.interval = interval;
		return this;
	};


	/**
	 * Export Event to iCal
	 *
	 * @since 0.2.0
	 * @returns {String}
	 */
	this.generate = function() {
		var tools = require('./_tools.js'),
			g = 'BEGIN:VALARM\n';

		/*


		 DURATION:PT15M
		 ATTACH;FMTTYPE=audio/basic:ftp://host.com/pub/sounds/bell-01.aud

		 */

		if(!data.type) {
			throw 'No value for `type` in ICalAlarm given!';
		}
		if(!data.trigger) {
			throw 'No value for `trigger` in ICalAlarm given!';
		}

		// ACTION
		g += 'ACTION:' + data.type.toUpperCase() + '\n';

		if(data.trigger instanceof Date) {
			g += 'TRIGGER;VALUE=DATE-TIME:' + tools.formatDate(data.trigger) + '\n';
		}
		else if(data.trigger > 0) {
			g += 'TRIGGER;RELATED=END:' + tools.duration(data.trigger) + '\n';
		}
		else {
			g += 'TRIGGER:' + tools.duration(data.trigger) + '\n';
		}

		// REPEAT
		if(data.repeat && !data.interval) {
			throw 'No value for `interval` in ICalAlarm given, but required for `repeat`!';
		}
		if(data.repeat) {
			g += 'REPEAT:' + data.repeat + '\n';
		}

		// INTERVAL
		if(data.interval && !data.repeat) {
			throw 'No value for `repeat` in ICalAlarm given, but required for `interval`!';
		}
		if(data.interval) {
			g += 'DURATION:' + tools.duration(data.interval) + '\n';
		}

		g += 'END:VALARM\n';
		return g;
	};


	for(i in _data) {
		if(_data.hasOwnProperty(i) && ['type', 'trigger', 'triggerBefore', 'triggerAfter', 'repeat', 'interval'].indexOf(i) > -1) {
			this[i](_data[i]);
		}
	}
};

module.exports = ICalAlarm;