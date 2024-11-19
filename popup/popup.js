const showHoursSwitch = document.getElementById('hoursSwitch');
const categorySwitch = document.getElementById('categorySwitch');
const timeSwitch = document.getElementById('timeSwitch');
const watchSwitch = document.getElementById('watchSwitch');
const historyHourSwitch = document.getElementById('showHistoryHours');

const versionText = document.getElementById('versionText');


/* Set version text WITHOUT using innerHTML :) */
// indicate in UI that the current build is a beta build
const beta = false;
let betaText = '';
if (beta)
{
	betaText = ' BETA BUILD'
}

const version = chrome.runtime.getManifest().version;
const italicElement = document.createElement('i');
const versionTxt = `v${version}`;

const textNode = document.createTextNode(versionTxt);
const betaNode = document.createTextNode(betaText);

const betaSpan = document.createElement('span');
betaSpan.style.color = '#f44949';
betaSpan.appendChild(betaNode);

italicElement.appendChild(textNode);
italicElement.appendChild(betaSpan);
versionText.appendChild(italicElement);


/* Display user's saved data on switches */
chrome.storage.local.get(['showHours'], function(result) {
	showHoursSwitch.checked = result.showHours;
});
chrome.storage.local.get(['category'], function(result) {
	categorySwitch.checked = result.category;
});
chrome.storage.local.get(['showLocalTime'], function(result) {
	timeSwitch.checked = result.showLocalTime;
});
chrome.storage.local.get(['showWatchLength'], function(result) {
	watchSwitch.checked = result.showWatchLength;
});
chrome.storage.local.get(['showHoursInHistory'], function(result) {
	historyHourSwitch.checked = result.showHoursInHistory;
});


/* Event Listeners */
showHoursSwitch.addEventListener('change', function() {
	let showHours = this.checked;
	chrome.storage.local.set({'showHours': showHours}, function() {
		console.log(`[MAL Pal: Popup] Updated settings to ${showHours} for showing hours`);
	});
});

categorySwitch.addEventListener('change', function() {
	let categoryChecked = this.checked;
	chrome.storage.local.set({'category': categoryChecked}, function() {
		console.log(`[MAL Pal: Popup] Updated settings to ${categoryChecked} for category numbers`);
	});
});

timeSwitch.addEventListener('change', function() {
	let timeChecked = this.checked;
	chrome.storage.local.set({'showLocalTime': timeChecked}, function() {
		console.log(`[MAL Pal: Popup] Updated settings to ${timeChecked} for show local time`);
	});
});

watchSwitch.addEventListener('change', function() {
	let timeChecked = this.checked;
	chrome.storage.local.set({'showWatchLength': timeChecked}, function() {
		console.log(`[MAL Pal: Popup] Updated settings to ${timeChecked} for view watch length`);
	});
});

historyHourSwitch.addEventListener('change', function() {
	let timeChecked = this.checked;
	chrome.storage.local.set({'showHoursInHistory': timeChecked}, function() {
		console.log(`[MAL Pal: Popup] Updated settings to ${timeChecked} for hours in history`);
	});
});
