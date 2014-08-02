// http://exposedata.com/tutorial/chord/chord-latest.js
// view-source:http://exposedata.com/tutorial/chord/latest.html
// http://exposedata.com/tutorial/chord/latest.html

d3.chart = d3.chart || {}

d3.chart.chord = function(options){
	var self = {}
	var vis

	var chord = d3.layout.chord()
		.padding(.05)
		.sortSubgroups(d3.descending)

	var width = 340,
		height = 340,
		innerRadius = Math.min(width, height) * .37,
		outerRadius = innerRadius * 1.1,
		coloring = 'bigger'

	self.fill = d3.scale.category20c()

	var arc = d3.svg.arc()
		.innerRadius(innerRadius)
		.outerRadius(outerRadius)

	var chord = d3.svg.chord()
		.radius(innerRadius)

	var comp = {
		bigger: function(a, b){ return a.value > b.value ? a : b },
		smaller: function(a, b){ return a.value < b.value ? a : b }
	}

	for(key in options){
		console.log(key)
		console.log(options[key])
		self[key] = options[key]
	}
}