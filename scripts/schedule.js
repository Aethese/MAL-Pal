/* Description: Note: WIP
get premade data either from extension, or go to schedule page and obtain data from there
the goal is to be able to get from the schedule the dates they started to be able to calculate
by using the start date and the current date if their is potentially a new episode
for the user to watch

default to shows being aired at 16 JST. decent middle ground imo since most air at
night
*/

// contains a list of all shows, and their specific info for it
// order for one show: name, aired, totalEp, day, ID
let allTitleData = {};

let days = ['monday', 'tuesday', 'wednesday', 'thursday', 'friday', 'saturday', 'sunday'];
let daysTabs = [];


/* Modifying Local Data */
async function setLocalData(data)
{
	await chrome.storage.local.set({'localJSON': data}, function() {
		console.log('[MAL Pal: Schedule] Updated local data settings');
	});
}

async function getLocalData()
{
	const result = await chrome.storage.local.get(['localJSON']);
	return result.localJSON;
}


/* Updating Local Data */
function getAllTitles(weekIndex)
{
	// 0 = Monday, 1 = Tuesday, ...
	const workingDiv = daysTabs[weekIndex];

	const titles = workingDiv.getElementsByClassName('js-anime-category-producer seasonal-anime js-seasonal-anime js-anime-type-all js-anime-type-1');


	// build all data regarding 1 anime, then at the end append to allTitleData
	for (let i=0; i<titles.length; i++)
	{
		let show = titles[i];

		let showName = show.querySelector('a').textContent;
		let airingDate = show.querySelector('.info').childNodes[0].textContent;
		let epCount = show.querySelector('.info > span:nth-child(2) > span:nth-child(1)').textContent.match(/^(\d+|\?)/)[0];
		let showID = show.querySelector('div > div:nth-child(1) > div:nth-child(3)').getAttribute('id');

		allTitleData[showID] = {
			name: showName,
			aired: airingDate,
			totalEp: epCount,
			day: days[weekIndex]
		}
	}
}

async function getJSONData()
{
	const fileName = 'data.json';
	const file = chrome.runtime.getURL(fileName);

	const fetchResult = await fetch(file);
	const data = await fetchResult.json();

	return data;
}


/* Update Items in List */


/* Main Function */
async function getData()
{
	// first check if data exists locally
	let localData = await getLocalData();

	if (localData)
	{
		console.log('[MAL Pal: Schedule] Local data found, ignoring json file');
		console.log(localData.updatedDate);
	}
	else
	{
		console.log('[MAL Pal: Schedule] No local storage data found, so getting data from data.json');
		// first get file json
		const fileData = await getJSONData();
		// update local data
		await setLocalData(fileData);
		localData = await getLocalData();

		const fileVersion = localData.updatedDate;
		console.log(fileVersion);
	}
}

const scheduleTab = document.querySelector('#content > div.navi-seasonal.js-navi-seasonal > div.horiznav_nav > ul > li:nth-child(7) > a');
if (scheduleTab) // if scheduleTab found, update local data
{
	// get all day tabs
	for (let i=0; i<days.length; i++)
	{
		daysTabs.push(document.querySelector(`#content > div.js-categories-seasonal > div.seasonal-anime-list.js-seasonal-anime-list.js-seasonal-anime-list-key-${days[i]}`));
	}

	// get all titles per day
	for (let i=0; i<daysTabs.length; i++)
	{
		getAllTitles(i);
	}

	// log data to console
	allTitleData = {'updatedDate': new Date().toISOString(), ...allTitleData}; // add updated time at end
	const jsonString = JSON.stringify(allTitleData);
	console.log(jsonString);
}

//getData();
