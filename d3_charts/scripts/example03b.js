(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 30},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom,
		vis, vis_group, aspect,
		line_color = 'rgba(174, 0, 0, 1)',
		line_width = 2,
		circle_radius = 5

	var lineData = [ { 'x': 1, 'y': 5},
					{ 'x': 15, 'y': 30},
					{ 'x': 20, 'y': 20},
					{ 'x': 40, 'y': 80},
					{ 'x': 60, 'y': 90},
					{ 'x': 80, 'y': 40},
					{ 'x': 100, 'y': 5},
					{ 'x': 120, 'y': 25} ]

	var vis = d3.select('#example').append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})

	vis_group = vis.append('g')
		.attr({
	        'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	    })

	aspect = chart_container.width() / chart_container.height()

	var lineFunction = d3.svg.line()
		.x(function(d){
			return xScale(d.x)
		})
		.y(function(d){
			return yScale(d.y)
		})
		.interpolate('linear')

	var xScale = d3.scale.linear()
		.domain([ 
			d3.min(lineData, function(d){
				return d.x
			}), 
			d3.max(lineData, function(d){
				return d.x
			}) ])
		.range([ 0, width ])

	var yScale = d3.scale.linear()
		.domain([ d3.min(lineData, function(d){
			return d.y
		}), d3.max(lineData, function(d){
			return d.y
		}) ])
		.range([ height, 0 ])

	var circles = vis_group.selectAll('circle')
		.data(lineData)
			.enter().append('circle')
		.attr({
			'cx': function(d){
				return xScale(d.x)
			},
			'cy': function(d){
				return yScale(d.y)
			},
			'r': circle_radius,
			'fill': line_color
		})

	var line = vis_group.append('path')
		.attr({
			'd': lineFunction(lineData),
			'stroke': line_color,
			'stroke-width': line_width,
			'fill': 'none'
		})

	var xAxis = d3.svg.axis()
		.scale(xScale)

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')

	var xAxisGroup = vis_group.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0,' +  height + ')'
		})
		.call(xAxis)

	var yAxisGroup = vis_group.append('g')
		.attr({
			'class': 'y axis',
			'transform': 'translate(0, 0)'
		})
		.call(yAxis)

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()