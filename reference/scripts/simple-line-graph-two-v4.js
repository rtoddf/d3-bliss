// https://bl.ocks.org/d3noob/ced1b9b18bd8192d2c898884033b5529

var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 30},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.5) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	line_color = '#003264',
	line_width = 2,
	circle_radius = 5

var svgWidth = +container_parent.width()
var svgHeight = +(+container_parent.width() * 0.5)

vis = d3.select('svg')
	.attrs({
		'width': svgWidth,
		'height': svgHeight
	})

vis_group = vis.append('g')
	.attr('transform', 'translate(' + margins.left + ',' + margins.top + ')');

aspect = chart_container.width() / chart_container.height()

// parse the date / time
var parseTime = d3.timeParse('%d-%b-%y');

// set the ranges
var x = d3.scaleTime().range([0, width]);
var y = d3.scaleLinear().range([height, 0]);

// define the line
var valueline = d3.line()
    .x(function(d) { return x(d.date); })
    .y(function(d) { return y(d.close); })
    .curve(d3.curveLinear)

d3.csv('data-v4/data.csv', function(error, data) {
		if (error) throw error;

		// format the data
	data.forEach(function(d) {
		d.date = parseTime(d.date);
		d.close = +d.close;
	});

	// Scale the range of the data
	x.domain(d3.extent(data, function(d) {
		return d.date;
	}));

	y.domain([0, d3.max(data, function(d) {
		return d.close;
	})]);

	// Add the valueline path.
	vis_group.append('path')
		.data([data])
		.attr('class', 'line')
		.attr('d', valueline);

	var circles = vis_group.selectAll('circle')
		.data(data)
			.enter().append('circle')
		.attrs({
			'cx': function(d){
				return x(d.date)
			},
			'cy': function(d){
				return y(d.close)
			},
			'r': circle_radius,
			'fill': line_color
		})

	// Add the X Axis
	vis_group.append('g')
		.attr('transform', 'translate(0,' + height + ')')
		.call(d3.axisBottom(x));

	// Add the Y Axis
	vis_group.append('g')
		.call(d3.axisLeft(y));

	})


// var lineFunction = d3.svg.line()
// 	.x(function(d){
// 		return xScale(d.x)
// 	})
// 	.y(function(d){
// 		return yScale(d.y)
// 	})
// 	.interpolate('linear')

// var xScale = d3.scale.linear()
// 	.domain([ 
// 		d3.min(lineData, function(d){
// 			return d.x
// 		}), 
// 		d3.max(lineData, function(d){
// 			return d.x
// 		}) ])
// 	.range([ 0, width ])

// var yScale = d3.scale.linear()
// 	.domain([ d3.min(lineData, function(d){
// 		return d.y
// 	}), d3.max(lineData, function(d){
// 		return d.y
// 	}) ])
// 	.range([ height, 0 ])

// var circles = vis_group.selectAll('circle')
// 	.data(lineData)
// 		.enter().append('circle')
// 	.attr({
// 		'cx': function(d){
// 			return xScale(d.x)
// 		},
// 		'cy': function(d){
// 			return yScale(d.y)
// 		},
// 		'r': circle_radius,
// 		'fill': line_color
// 	})

// var line = vis_group.append('path')
// 	.attr({
// 		'd': lineFunction(lineData),
// 		'stroke': line_color,
// 		'stroke-width': line_width,
// 		'fill': 'none'
// 	})

// var xAxis = d3.svg.axis()
// 	.scale(xScale)

// var yAxis = d3.svg.axis()
// 	.scale(yScale)
// 	.orient('left')

// var xAxisGroup = vis_group.append('g')
// 	.attr({
// 		'class': 'x axis',
// 		'transform': 'translate(0,' +  height + ')'
// 	})
// 	.call(xAxis)

// var yAxisGroup = vis_group.append('g')
// 	.attr({
// 		'class': 'y axis',
// 		'transform': 'translate(0, 0)'
// 	})
// 	.call(yAxis)

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})
