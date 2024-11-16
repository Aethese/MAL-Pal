// changes that will be made to anime/manga pages

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

	let localTime = date.toLocaleTimeString([], { hour: '2-digit', minute: '2-digit' });

	if (localTime.includes('PM'))
	{
		let newHour = Number(localTime.substring(0, 2)) + 12;
		localTime = newHour + localTime.slice(2); // remove old hour
	}
	localTime = localTime.slice(0, -3); // remove AM/PM
	const localDayOfWeek = date.toLocaleDateString([], { weekday: 'long' });

	return ` ${localDayOfWeek}s at ${localTime} (Local)`;
}

/* Get episode length, translate to hours, then show on page */
function translateMinutes(durationText, episodeCount)
{
	// durationText = the full duration text on left panel
	const length = durationText.match(/^\d+/)[0];
	const totalMinutes = Number(length) * episodeCount;
	return totalMinutes;
}

function minToHours(totalMin)
{
	// calculates minutes to human readable hours

	// if less than an hour
	if (totalMin < 60)
	{
		if (totalMin == 1) {return `${totalMin} minute`;}
		return `${totalMin} minutes`;
	}

	const hours = Math.floor(totalMin / 60);
	const minutes = totalMin % 60;

	// check if an 's' needs to be added after hours/minutes
	let hoursEnding = '';
	let minEnding = '';
	if (hours > 1) {hoursEnding='s';}
	if (minutes > 1) {minEnding='s';}

	// keep text clear at first, then add text if we need to
	let hoursText = '';
	let minText = '';
	let spacing = ''; // add spacing if we have both hours and minutes
	if (hours > 0)   {hoursText=`${hours} hour${hoursEnding}`;}
	if (minutes > 0) {minText=`${minutes} minute${minEnding}`;}
	if ((hours>0) & (minutes>0)) {spacing=' ';}

	return hoursText + spacing + minText;
}

function addWatchText(length)
{
	let div = document.createElement('div');
	div.classList.add('di-ib');
	div.style['margin-left'] = '1.1em';
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
		const lengthText = minToHours(totalMin);
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
