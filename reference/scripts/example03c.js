var width = 600,
		height = 400,
		margin = 20

d3.json('data/example09.json', function(error, data){
	console.log(data)

	var svgContainer01 = d3.select('#example01').append('svg')
		.attr({
			'width': width,
			'height': height
		})

	var xScale01 = d3.scale.linear()
		.domain([ 
			d3.min(data, function(d){
				console.log('d.x min: ', d.x)
				return d.x
			}), 
			d3.max(data, function(d){
				console.log('d.x max: ', d.x)
				return d.x
			}) ])
		.range([ margin, width - margin ])

})

var lineData = [ { 'x': 1, 'y': 5},
				{ 'x': 15, 'y': 30},
				{ 'x': 20, 'y': 20},
				{ 'x': 40, 'y': 80},
				{ 'x': 60, 'y': 90},
				{ 'x': 80, 'y': 40},
				{ 'x': 100, 'y': 5},
				{ 'x': 120, 'y': 25} ]

var svgContainer = d3.select('#example').append('svg')
		.attr({
			'width': width,
			'height': height
		})

var lineFunction = d3.svg.line()
		.x(function(d){ return xScale(d.x) })
		.y(function(d){ return yScale(d.y) })
		.interpolate('linear')

var xScale = d3.scale.linear()
		.domain([ 
			d3.min(lineData, function(d){
				return d.x
			}), 
			d3.max(lineData, function(d){
				return d.x
			}) ])
		.range([ margin, width - margin ])

var yScale = d3.scale.linear()
		.domain([ d3.min(lineData, function(d){
			return d.y
		}), d3.max(lineData, function(d){
			return d.y
		}) ])
		.range([ height - margin, margin ])

var circles = svgContainer.selectAll('circle')
		.data(lineData)
		.enter()
		.append('circle')
		.attr('cx', function(d){ return xScale(d.x) })
		.attr('cy', function(d){ return yScale(d.y) })
		.attr('r', 5)
		.attr('fill', 'rgba(174, 0, 0, 1)')

var line = svgContainer.append('path')
		.attr({
			'd': lineFunction(lineData),
			'stroke': 'rgba(174, 0, 0, .7)',
			'stroke-width': '2',
			'fill': 'none'
			})

var xAxis = d3.svg.axis()
		.scale(xScale)

var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')

var xAxisGroup = svgContainer.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0,' +  (height - margin) + ')'
		})
		.call(xAxis)

var yAxisGroup = svgContainer.append('g')
		.attr({
			'class': 'y axis',
			'transform': 'translate(' + margin + ', 0)'
		})
		.call(yAxis)