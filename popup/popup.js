const showHoursSwitch = document.getElementById('hoursSwitch');
const categorySwitch = document.getElementById('categorySwitch');
const timeSwitch = document.getElementById('timeSwitch');
const watchSwitch = document.getElementById('watchSwitch');

const versionText = document.getElementById('versionText');


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


/* Set version text */
versionText.innerHTML = `<i>v${chrome.runtime.getManifest().version}</i>`;


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
		console.log(`[MAL Pal: Popup] Updated settings to ${timeChecked} for show local time`);
	});
});
