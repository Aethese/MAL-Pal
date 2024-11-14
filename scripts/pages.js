// changes that will be made to anime/manga pages

/* Helper Functions */
function getJSTDate()
{
	const spaceitItems = document.body.getElementsByClassName('spaceit_pad');

	for (let i=0; i<spaceitItems.length; i++)
	{
		let nodeValue = spaceitItems[i].childNodes[2].nodeValue;
		if (nodeValue.includes('(JST)'))
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

/* Checks and Changing on screen data */
function changeTime()
{
	const dateInfo = getJSTDate(); // [JSTDate, path]
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



chrome.storage.local.get(['showLocalTime'], function(result) {
	if (result.showLocalTime)
	{
		changeTime();
	}
});
