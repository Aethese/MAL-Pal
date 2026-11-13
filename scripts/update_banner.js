/*
	Handles showing a banner on every MAL page when a new update is detected.
	The goal is to notify the user in a way that is universal, non-intrusive
	(e.g. opening update page automatically).
	Rules: Must contain link/button that directs to a page explaining the most recent
	updates and changes. Must be non-intrusive and dismissable. Our banner will also always
	go below MAL's own banner
*/

const manifestVersion = chrome.runtime.getManifest().version;


function displayBanner()
{
	// Displays the update banner. Follows MAL's own banner
	// styling, while respecting it (sit below it)
	const wrapper = document.querySelector('.wrapper');
	const contentWrapper = document.querySelector('#contentWrapper');

	if (! (wrapper && contentWrapper) )
	{
		console.log('[MAL Pal: Update Banner] Missing main page content, so not displaying banner');
		return;
	}

	// Master Banner
	let masterBannerDiv = document.createElement('div');
	masterBannerDiv.classList.add('text-ribbon', 'MAL-Pal-generated');
	masterBannerDiv.style.display = 'block';
	masterBannerDiv.style.maxHeight = '10em';

	// Main Div
	let bannerDiv = document.createElement('div');
	bannerDiv.classList.add('ac', 'fs12', 'pt8', 'pr8', 'pb8', 'pl8', 'MAL-Pal-generated');
	bannerDiv.style.backgroundColor = '#287d52';
	bannerDiv.style.color = '#ffffff';
	masterBannerDiv.appendChild(bannerDiv);

	// Close Button
	let closeButton = document.createElement('a');
	closeButton.setAttribute('href', '#');
	closeButton.classList.add('di-b', 'fl-r', 'MAL-Pal-generated');
	closeButton.style.color = '#ffffff';
	closeButton.style.marginTop = '1px';

	let closeMark = document.createElement('i');
	closeMark.classList.add('fa-solid', 'fa-xmark', 'MAL-Pal-generated');
	closeButton.appendChild(closeMark);
	bannerDiv.appendChild(closeButton);

	// Update Text
	let updateText = document.createElement('a');
	updateText.setAttribute('href', 'https://aethese.com/');
	updateText.setAttribute('target', '_blank');
	updateText.setAttribute('rel', 'noopener noreferrer');
	updateText.classList.add('di-b', 'pr12', 'pl12', 'MAL-Pal-generated');
	updateText.style.color = '#ffffff';

	// now build text content while bolding key parts like MAL does
	const nameVersionBold = document.createElement('b');
	nameVersionBold.textContent = `MAL Pal v${manifestVersion}`;

	updateText.append(nameVersionBold, ' is now out! Click to view the latest changes');
	bannerDiv.append(updateText);

	// Add Master Element Right Above The Actual Page Content
	wrapper.insertBefore(masterBannerDiv, contentWrapper);
	console.log('[MAL Pal: Update Banner] Added Update Banner to page');

	// Handle Banner Closing
	closeButton.addEventListener('click', function() {
		masterBannerDiv.remove();
		chrome.storage.local.set({'latestUpdatedVersion': manifestVersion}, function() {
			console.log(`[MAL Pal: Update Banner] Update banner closed, and local version now matching manifest version`);
		});
	});
}

function checkVersion(localVersion)
{
	// localVersion: str = local saved version in local storage
	////
	// main logic that checks whether the local version is equal to the manifest version

	if (localVersion === undefined) // fresh install
	{
		chrome.storage.local.set({'latestUpdatedVersion': manifestVersion}, function() {
			console.log(`[MAL Pal: Update Banner] Fresh install detected, updating local version to ${manifestVersion}`);
		});
		return;
	}
	else if (localVersion === manifestVersion) return; // versions match, don't show shi

	// When local version mismatches manifest version, new update is available so display banner
	displayBanner();
}

chrome.storage.local.get(['latestUpdatedVersion'], function(result) {
	checkVersion(result.latestUpdatedVersion);
});
