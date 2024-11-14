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

function formatNum(number)
{
	// undefined = use local language
	return parseFloat(number).toLocaleString(
		undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }
	);
}

/* Add Hours Functions */
function addHours()
{
	// ANIME:
	let daysText = daysAnime.childNodes[1].nodeValue;
	let hoursNum = Number(daysText.replace(/,/g, ''));
	let hours = (hoursNum * 24).toFixed(1);
	let formattedHours = formatNum(hours);

	daysAnime.childNodes[1].nodeValue = `${daysText} (${formattedHours} Hours)`;

	// MANGA:
	let mangaDaysText = daysManga.childNodes[1].nodeValue;
	let mangaHoursNum = Number(mangaDaysText.replace(/,/g, ''));
	let mangaHours = (mangaHoursNum * 24).toFixed(1);
	let mangaFormattedHours = formatNum(mangaHours);

	daysManga.childNodes[1].nodeValue = `${mangaDaysText} (${mangaFormattedHours} Hours)`;
}

/* Category Functions */
function categoryAnime()
{
	const watching = document.querySelector('#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(1) > span');
	const completed = document.querySelector('#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(2) > span');
	const onHold = document.querySelector('#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(3) > span');
	const dropped = document.querySelector('#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(4) > span');
	const ptw = document.querySelector('#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(5) > span');
	const categories = [watching, completed, onHold, dropped, ptw];

	let totalEntriesNum = strToInt(totalEntriesAnime.textContent);

	for (let i = 0; i < categories.length; i++)
	{
		// get num in category, divide num by total entries and format in percent, then display percent
		let amount = strToInt(categories[i].textContent);
		let percent = ((amount / totalEntriesNum) * 100).toFixed(1);
		let previousText = categories[i].textContent;
		categories[i].textContent = `${previousText} (${percent}%)`;
	}
}

function categoryManga()
{
	const reading = document.querySelector('#statistics > div:nth-child(3) > div.stats.manga > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(1) > span');
	const completed = document.querySelector('#statistics > div:nth-child(3) > div.stats.manga > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(2) > span')
	const onHold = document.querySelector('#statistics > div:nth-child(3) > div.stats.manga > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(3) > span');
	const dropped = document.querySelector('#statistics > div:nth-child(3) > div.stats.manga > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(4) > span');
	const ptr = document.querySelector('#statistics > div:nth-child(3) > div.stats.manga > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(5) > span');
	const categories = [reading, completed, onHold, dropped, ptr];

	let totalEntriesNum = strToInt(totalEntriesManga.textContent);

	for (let i = 0; i < categories.length; i++)
	{
		let amount = strToInt(categories[i].textContent);
		let percent = ((amount / totalEntriesNum) * 100).toFixed(1);
		let previousText = categories[i].textContent;
		categories[i].textContent = `${previousText} (${percent}%)`;
	}
}

function addCategoryPercents()
{
	categoryAnime();
	categoryManga();
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
