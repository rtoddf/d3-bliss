function getTargetWidth() {
	// this will have to be done by responsive.js - hardcoded for now
	return 972 - margins.left - margins.right
}

function getTargetHeight() {
	// this will have to be done by responsive.js - hardcoded for now
	return 400 - margins.top - margins.bottom
}


// // color range choices
// https://github.com/mbostock/d3/wiki/Ordinal-Scales#categorical-colors
// d3.scale.category10()
// d3.scale.category20()
// d3.scale.category20b()
// d3.scale.category20c()

number prefixing and shortening
https://github.com/mbostock/d3/wiki/Formatting
http://alignedleft.com/tutorials/d3/axes/

var prefix = d3.formatPrefix(137594020);
console.log(prefix.symbol); // "M"
console.log(prefix.scale(137594020).toFixed()); // 138

var number = 137594020
var prefix = d3.formatPrefix(number)
var test = prefix.scale(number).toFixed()
console.log(test)

// var prefix = d3.formatPrefix(13759402);
// console.log(prefix.symbol); // "M"
// console.log(prefix.scale(13759402).toFixed()); // 14

// var prefix = d3.formatPrefix(1375);
// console.log(prefix.symbol); // "k"
// console.log(prefix.scale(1375).toFixed()); // 1

// .tickFormat(prefix);

// format currency
// https://groups.google.com/forum/#!topic/d3-js/NvFNA8DENaI



			        // // .attr("cy", function() { return color(Math.random()) })