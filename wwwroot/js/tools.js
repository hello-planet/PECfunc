/**
 * 
 */

$(function getTimestamp() {
	var now = new Date();
	var date = now.getFullYear() + "-" + (now.getMonth() + 1) + "-"
			+ now.getDate() + now.getTime();
	document.getElementById("timestamp").value = date;
});
