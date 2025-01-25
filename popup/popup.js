const showHoursSwitch = document.getElementById('hoursSwitch');
const categorySwitch = document.getElementById('categorySwitch');
const timeSwitch = document.getElementById('timeSwitch');
const watchSwitch = document.getElementById('watchSwitch');
const historyHourSwitch = document.getElementById('showHistoryHours');

const refreshBtn = document.getElementById('refresh');
const versionText = document.getElementById('versionText');


/* Set version text WITHOUT using innerHTML :) */
// indicate in UI that the current build is a beta build
const beta = false;
let betaText = '';
if (beta)
{
	const betaDate = '01/25/2025'; // US format
	let versionName = chrome.runtime.getManifest().version_name;
	if (versionName) {versionName = versionName + ' ';}
	betaText = ` ${versionName}BETA BUILD (${betaDate})`;
}

const version = chrome.runtime.getManifest().version;
const italicElement = document.createElement('i');
const versionTxt = `v${version} by Aethese`;

const textNode = document.createTextNode(versionTxt);
const betaNode = document.createTextNode(betaText);

// add beta text as a span, so it will be inline with the version text
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


/* Handle dropdown menu animation */
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
