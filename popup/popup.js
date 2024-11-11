let showHoursSwitch = document.getElementById('hoursSwitch');
let categorySwitch = document.getElementById('categorySwitch');
let versionText = document.getElementById('versionText');

// show the setting that's saved for the options
chrome.storage.local.get(['showHours'], function(result) {
	showHoursSwitch.checked = result.showHours;
});
chrome.storage.local.get(['category'], function(result) {
	categorySwitch.checked = result.category;
});

// set version text
versionText.innerHTML = `<i>v${chrome.runtime.getManifest().version}</i>`;

// event listeners
showHoursSwitch.addEventListener('change', function() {
	let showHours = this.checked; 
	chrome.storage.local.set({'showHours': showHours}, function() {
		console.log(`Updated settings to ${showHours} for showing hours`);
	});
});

categorySwitch.addEventListener('change', function() {
	let categoryChecked = this.checked; 
	chrome.storage.local.set({'category': categoryChecked}, function() {
		console.log(`Updated settings to ${categoryChecked} for category numbers`);
	});
});