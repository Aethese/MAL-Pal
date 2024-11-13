let showHoursSwitch = document.getElementById('hoursSwitch');
let categorySwitch = document.getElementById('categorySwitch');
let timeSwitch = document.getElementById('timeSwitch');
let versionText = document.getElementById('versionText');


// show the setting that's saved for the options
chrome.storage.local.get(['showHours'], function(result) {
	showHoursSwitch.checked = result.showHours;
});
chrome.storage.local.get(['category'], function(result) {
	categorySwitch.checked = result.category;
});
chrome.storage.local.get(['showLocalTime'], function(result) {
	timeSwitch.checked = result.showLocalTime;
});


// set version text
versionText.innerHTML = `<i>v${chrome.runtime.getManifest().version}</i>`;


// event listeners
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
