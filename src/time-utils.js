/* global module */
var Clock = require('clock');

/**
 * Return the closest next value from an array of numbers
 * @param {Array<Number>} times List of numbers, each specifying 
 *                        a time value in the format of HHMM
 * @param {Number} time Time value to use as base during search
 * @return Number with next highest value or null
 */
var getNextTimeValue = function (times, time) {
	'use strict';
	var laterTimes = times.filter(function (item) {
		return item > time;
	});
	return laterTimes[0] || null;
};

/**
 * Return the timestamp for the next time occurrence in a list
 * @param {Array<Number>} times List of numbers, each specifying 
 *                        a time value in the format of HHMM
 * @return Timestamp for the next time occurrence
 */
var getNextTime = function (times) {
	'use strict';
	var d = new Date(),
		day = d.getDay(),
		time = getNextTimeValue(times, (d.getHours() * 100 + d.getMinutes()));
	
	if (time === null) {
		day = day + 1;
		time = getNextTimeValue(times, 0);
	}
	return Clock.weekday(day, Math.floor(time / 100), (time % 100));
};

module.exports = {
	getNextTime: getNextTime
};