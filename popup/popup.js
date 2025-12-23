const showHoursSwitch = document.getElementById('hoursSwitch');
const categorySwitch = document.getElementById('categorySwitch');
const timeSwitch = document.getElementById('timeSwitch');
const watchSwitch = document.getElementById('watchSwitch');
const historyHourSwitch = document.getElementById('showHistoryHours');

const refreshBtn = document.getElementById('refresh');
const versionText = document.getElementById('versionText');


/* Set version text WITHOUT using innerHTML :) */
const version = chrome.runtime.getManifest().version;
const italicElement = document.createElement('i');
const versionTxt = `v${version} by Aethese`;

const textNode = document.createTextNode(versionTxt);

italicElement.appendChild(textNode);
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


/* Handle dropdown menu animation */
function forceResize()
{
	// bad and not fully working fix to try and help the issue with firefox
	// not properly resizing the popup window like chromium browsers do
	setTimeout(() => {
		document.body.style.height = 'auto';
		document.documentElement.style.height = 'auto';
	}, 250);
}

let dropdowns = document.getElementsByClassName('dropdown');
for (let i=0; i<dropdowns.length; i++)
{
	dropdowns[i].addEventListener('click', function()
	{
		this.classList.toggle('active');

		// toggle between hiding and showing
		let panel = this.nextElementSibling;
		if (panel.style.maxHeight)
		{
			panel.style.maxHeight = null;
			forceResize();
		}
		else
		{
			const description = document.querySelector(`body > div:nth-child(${1 + ((i+1) * 2)}) > h3`).textContent;
			// gets character length / 3 then floored to use to calculate for how much extra
			// space may be needed if the character count reaches past 75. extra space is needed
			// for padding purposes
			const charLength = Math.floor(description.length / 3);

			// minimum height of 75 px
			panel.style.maxHeight = Math.max(panel.scrollHeight + charLength, 75) + 'px';
		}
	});
}


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

refreshBtn.addEventListener('click', function() {
	chrome.tabs.query({active: true, currentWindow: true}, function(tabs) {
		chrome.tabs.reload(tabs[0].id);
	});
});
