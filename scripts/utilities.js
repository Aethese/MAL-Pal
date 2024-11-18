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
