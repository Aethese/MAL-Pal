const days = document.querySelector("#statistics > div:nth-child(2) > div.stats.anime > div.stat-score.di-t.w100.pt8 > div.di-tc.al.pl8.fs12.fw-b");
const totalEntries = document.querySelector("#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-data.fl-r > li:nth-child(1) > span.di-ib.fl-r");

if (days)
{
	// add hours spent watching next to "Days:" text
	let daysText = days.childNodes[1].nodeValue;
	let hoursNum = Number(daysText);
	let hours = (hoursNum * 24).toFixed(1);
	let formattedHours = parseFloat(hours).toLocaleString(
		undefined, { minimumFractionDigits: 1, maximumFractionDigits: 1 }
	);

	days.childNodes[1].nodeValue = daysText + " ("+ formattedHours + " Hours)";
	console.log("[MAL Pal] Modified days text");
} else
{
	console.warn("Days not found");
}

if (totalEntries)
{
	// add percent a category makes up of the total entries
	const watching = document.querySelector("#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(1) > span");
	const completed = document.querySelector("#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(2) > span");
	const onHold = document.querySelector("#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(3) > span");
	const dropped = document.querySelector("#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(4) > span");
	const ptw = document.querySelector("#statistics > div:nth-child(2) > div.stats.anime > div.mt12.ml8.mr8.clearfix > ul.stats-status.fl-l > li:nth-child(5) > span");
	const categories = [watching, completed, onHold, dropped, ptw];

	let totalEntriesNum = parseInt((totalEntries.textContent).replace(/,/g, ""), 10);

	for (let i = 0; i < categories.length; i++)
	{
		let amount = parseInt((categories[i].textContent).replace(/,/g, ""), 10);
		let percent = ((amount / totalEntriesNum) * 100).toFixed(1);
		let previousText = categories[i].textContent;
		categories[i].textContent = previousText + " (" + percent + "%)";
	}
	console.log("[MAL Pal] Modified total entries text");
} else
{
	console.warn("Total entries not found");
}