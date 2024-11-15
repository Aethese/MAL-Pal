const daysAnime = document.querySelector('#statistics > div:nth-child(2) > div.stats.anime > div.stat-score.di-t.w100.pt8 > div.di-tc.al.pl8.fs12.fw-b');
const daysManga = document.querySelector('#statistics > div:nth-child(3) > div.stats.manga > div.stat-score.di-t.w100.pt8.mb8 > div.di-tc.al.pl8.fs12.fw-b');
const totalEntriesAnime = document.querySelector('#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-data.fl-r > li:nth-child(1) > span.di-ib.fl-r');
const totalEntriesManga = document.querySelector('#statistics > div:nth-child(3) > div.stats.manga > div.mt12.ml8.mr8.clearfix > ul.stats-data.fl-r > li:nth-child(1) > span.di-ib.fl-r');


/* Helper Functions */
function strToInt(string)
{
	// take a number that contains a comma (like 1,042) and return it (1042) in int form
	return parseInt((string).replace(/,/g, ''), 10);
}

function formatNum(number, decimalPlace)
{
	// formats a number to normal text. ex: 1042 to 1,042
	// decimalPlace: int = how many places past decimal should be used

	// undefined = use local language
	return parseFloat(number).toLocaleString(
		undefined, { minimumFractionDigits: decimalPlace, maximumFractionDigits: decimalPlace }
	);
}

/* Add Hours Functions */
function addHours()
{
	// ANIME:
	let daysText = daysAnime.childNodes[1].nodeValue;
	let hoursNum = Number(daysText.replace(/,/g, ''));
	let hours = (hoursNum * 24).toFixed(1);
	let formattedHours = formatNum(hours, 1);

	daysAnime.childNodes[1].nodeValue = `${daysText} (${formattedHours} Hours)`;

	// MANGA:
	let mangaDaysText = daysManga.childNodes[1].nodeValue;
	let mangaHoursNum = Number(mangaDaysText.replace(/,/g, ''));
	let mangaHours = (mangaHoursNum * 24).toFixed(1);
	let mangaFormattedHours = formatNum(mangaHours, 1);

	daysManga.childNodes[1].nodeValue = `${mangaDaysText} (${mangaFormattedHours} Hours)`;
}

/* Category Functions */
function addPercent(subject, nth)
{
	// subject = anime, or manga
	// nth = 2 for anime, 3 for manga

	const watching = document.querySelector(`#statistics > div:nth-child(${nth}) > div.stats.${subject} > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(1) > span`);
	const completed = document.querySelector(`#statistics > div:nth-child(${nth}) > div.stats.${subject} > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(2) > span`);
	const onHold = document.querySelector(`#statistics > div:nth-child(${nth}) > div.stats.${subject} > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(3) > span`);
	const dropped = document.querySelector(`#statistics > div:nth-child(${nth}) > div.stats.${subject} > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(4) > span`);
	const ptw = document.querySelector(`#statistics > div:nth-child(${nth}) > div.stats.${subject} > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(5) > span`);
	const categories = [watching, completed, onHold, dropped, ptw];

	let totalEntries = totalEntriesAnime;
	if (nth == 3) { totalEntries = totalEntriesManga; }

	let totalEntriesNum = strToInt(totalEntries.textContent);

	for (let i = 0; i < categories.length; i++)
	{
		// get num in category, divide num by total entries and format in percent, then display percent
		let amount = strToInt(categories[i].textContent);
		let percent = ((amount / totalEntriesNum) * 100).toFixed(1);
		categories[i].title = `${percent}% of ${formatNum(totalEntriesNum, 0)}`;
	}
}

function addCategoryPercents()
{
	addPercent('anime', 2);
	addPercent('manga', 3);
}


/* Checks and Handlers for changing data */
if (daysAnime) // add hours spent watching next to "Days:" text
{
	chrome.storage.local.get(['showHours'], function(result) {
		if (result.showHours)
		{
			addHours();
			console.log('[MAL Pal: Profile] Modified days text');
		}
	});
}

if (totalEntriesAnime) // add percent a category makes up of the total entries
{
	chrome.storage.local.get(['category'], function(result) {
		if (result.category)
		{
			addCategoryPercents();
			console.log('[MAL Pal: Profile] Modified total entries text');
		}
	});
}
