/* global require */
/** imports **/
var UI = require('ui');
var Wakeup = require('wakeup');
var Vibe = require('ui/vibe');
var Light = require('ui/light');
var TimeUtils = require('./time-utils');
var Settings = require('settings');

/** config **/
var dailyIntake = Settings.option('calories') || 2000;
var reminders = {
	800: {
		label: 'Breakfast',
		calories: 0.25
	},
	1030: {
		label: 'Snack',
		calories: 0.1
	},
	1230: {
		label: 'Lunch',
		calories: 0.35
	},
	1630: {
		label: 'Snack',
		calories: 0.1
	},
	2000: {
		label: 'Dinner',
		calories: 0.2
	}
};


/** settings **/
Settings.config(
	{ url: 'https://bodnaristvan.github.io/pebble-diet-reminder/settings.html' },
	function(e) {
		Settings.option('calories', dailyIntake);
	},
	function(e) {}
);

/** UI elements **/
var mainCard = new UI.Card({
	title: 'Diet reminder',
	// icon: 'images/apple-icon-small.png',
	scrollable: false
});

var reminderCard = new UI.Card({
	title: 'Diet reminder!'
});


/** util functions **/
var showReminder = function (reminderId) {
	'use strict';
	reminderCard.subtitle(reminders[reminderId].label);
	reminderCard.body('Suggested calorie intake: ' + Math.floor(dailyIntake * reminders[reminderId].calories) + 'kcal');
	reminderCard.show();
	Vibe.vibrate('long');
	Light.trigger();
};

var scheduleNextTime = function () {
	'use strict';
	var nextTime = TimeUtils.getNextTime(Object.keys(reminders)),
		d = new Date(nextTime * 1000),
		reminderId = (d.getHours() * 100) + d.getMinutes(),
		scheduleOpts = {
			time: nextTime,
			data: { reminderId: reminderId }
		};

	// cancel all other schedules
	Wakeup.cancel('all');
	// schedule next time
	Wakeup.schedule(scheduleOpts, function () {});
	return nextTime;
};


/** app launch **/
Wakeup.launch(function(e) {
	'use strict';
	if (e.wakeup) {
		showReminder(e.data.reminderId);
		scheduleNextTime();
	} else {
		var nextTime = scheduleNextTime(),
			d = new Date(nextTime * 1000),
			m = d.getMinutes(),
			hours = d.getHours(),
			minutes = (m < 10) ? '0' + m : '' + m,
			reminder = reminders[(hours * 100) + m],
			calories = Math.floor(dailyIntake * reminder.calories),
			reminderText;
		reminderText  = 'Next meal is ' + reminder.label.toLowerCase() + ' at ' + hours + ':' + minutes + ', ';
		reminderText += 'suggested calorie intake is ' + calories + 'kcal.\n\n';
		reminderText += 'Daily calories: ' + dailyIntake + 'kcal';
		mainCard.body(reminderText);
		mainCard.show();
	}
});
