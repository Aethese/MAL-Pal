// changes that will be made to anime/manga pages

/*
Available options, and functions used for those options:
- Showing Length of a show
	- getLeftPanelInfo()
	- getNextDateForDay()
	- translateMinutes()
	- addWatchText()
	- addWatchLength()
- Changing an airing show's time to a user's local time
	- getLeftPanelInfo()
	- translateDate()
	- changeTime()
*/

/* Helper Functions */
function getLeftPanelInfo(lookFor)
{
	// lookFor: str = what we're looking for in the left panel
	// returns: [value, path]

	const spaceitItems = document.body.getElementsByClassName('spaceit_pad');

	for (let i=0; i<spaceitItems.length; i++)
	{
		let nodeValue = spaceitItems[i].childNodes[2].nodeValue;
		if (nodeValue.includes(lookFor))
		{
			return [nodeValue.trim(), spaceitItems[i]];
		}
	}
	return undefined;
}


// i hate dates in js
function getNextDateForDay(day)
{
	const daysOfWeek = ['Sunday', 'Monday', 'Tuesday', 'Wednesday', 'Thursday', 'Friday', 'Saturday'];
	const today = new Date();
	const todayIndex = today.getDay();   

	const targetDayIndex = daysOfWeek.indexOf(day);

	let daysToAdd = targetDayIndex - todayIndex;
	if (daysToAdd <= 0)
	{
		daysToAdd += 7; 
	}

	const nextDate = new Date();
	nextDate.setDate(today.getDate() + daysToAdd);
	return nextDate;
}

/* Translate Date into user's local time */
function translateDate(JSTDate)
{
	let day = JSTDate.match(/^\w+/)[0];
	day = day.slice(0, -1); // remove 's' at the end of the day
	const time = JSTDate.match(/\d{2}:\d{2}/)[0];

	const nextDate = getNextDateForDay(day);

	const dateString = `${day} ${nextDate.toLocaleDateString('en-US', { month: 'long', day: 'numeric', year: 'numeric' })} ${time}:00 GMT+0900 (JST)`; 
	const date = new Date(dateString);

	const localTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit', hour12: false });
	const localDayOfWeek = date.toLocaleDateString([], { weekday: 'long' });
	const timezone = new Date().toLocaleTimeString('en-us',{timeZoneName:'short'}).split(' ')[2]

	return ` ${localDayOfWeek}s at ${localTime} (${timezone})`;
}

/* Get episode length, translate to hours, then show on page */
function translateMinutes(durationText, episodeCount)
{
	// if there are hours involved, get the duration differently
	const hourLength = durationText.match(/(\d+)[^\d]+(\d+)/);
	if (hourLength)
	{
		const hours = Number(hourLength[1]) * 60;
		const min = Number(hourLength[2]);
		const totalMinutes = (hours + min) * episodeCount;
		return totalMinutes;
	}
	const length = durationText.match(/^\d+/)[0];
	const totalMinutes = Number(length) * episodeCount;
	return totalMinutes;
}

function addWatchText(length)
{
	let div = document.createElement('div');
	div.classList.add('di-ib');
	div.classList.add('form-user-episode');
	div.classList.add('MAL-Pal-generated');
	div.style['margin-left'] = '8px';
	let p = document.createElement('p');

	const statusBlock = document.querySelector('#content > table > tbody > tr > td:nth-child(2) > div > table > tbody > tr:nth-child(1) > td > div.pb16 > div.di-t.w100.mt12 > div.anime-detail-header-stats.di-tc.va-t > div.user-status-block.js-user-status-block.fn-grey6.clearfix.al.mt8.po-r');
	statusBlock.append(div);
	div.append(p);
	p.innerText = `Length: ${length}`;
}

/* Checks and Changing on screen data */
function changeTime()
{
	const dateInfo = getLeftPanelInfo('(JST)'); // [JSTDate, path]
	if (dateInfo)
	{
		let newText = translateDate(dateInfo[0]);
		dateInfo[1].childNodes[2].nodeValue = `${newText}`;
		console.log('[MAL Pal: Pages] Updated broadcast time');
	}
	else
	{
		console.log('[MAL Pal: Pages] Couldn\'t find scheduled date, assuming there is none');
	}
}

function addWatchLength()
{
	const episodeCount = document.querySelector('#curEps');
	if (episodeCount.textContent == '?')
	{
		console.log('[MAL Pal: Pages] Anime not finished, so won\'t get duration');
		return;
	}

	const durationInfo = getLeftPanelInfo('per ep.'); // [duration, path]
	if (durationInfo)
	{
		const totalMin = translateMinutes(durationInfo[0], episodeCount.textContent);
		const lengthText = minToHours(totalMin); // scripts/utilities.js
		addWatchText(lengthText);
		console.log('[MAL Pal: Pages] Added watch length')
	}
	else
	{
		console.log('[MAL Pal: Pages] Couldn\'t find duration, assuming there is none');
	}
}



chrome.storage.local.get(['showLocalTime'], function(result) {
	if (result.showLocalTime)
	{
		changeTime();
	}
});

chrome.storage.local.get(['showWatchLength'], function(result) {
	if (result.showWatchLength)
	{
		addWatchLength();
	}
});
