(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 30},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom,
		vis, vis_group, aspect

	var lineData = [ { 'x': 1, 'y': 5},
					{ 'x': 20, 'y': 20},
					{ 'x': 40, 'y': 80},
					{ 'x': 60, 'y': 40},
					{ 'x': 80, 'y': 5}, 
					{ 'x': 120, 'y': 60},
					{ 'x': 140, 'y': 60},
					{ 'x': 160, 'y': 60},
					{ 'x': 180, 'y': 60},
					{ 'x': 200, 'y': 60} ]

	vis = d3.select('#example').append('svg')
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
		.domain([ 
			d3.min(lineData, function(d){
				return d.y
			}), 
			d3.max(lineData, function(d){
				return d.y
			}) ])
		.range([ height, 0 ])


	var lineFunction = d3.svg.line()
			.x(function(d){ 
				return xScale(d.x)
			})
			.y(function(d){
				return yScale(d.y)
			})
			.interpolate('basis')

	var linePath = vis_group.append('path')
		.attr({
			'd': lineFunction(lineData),
			'stroke': 'rgba(100, 0, 0, .75)',
			'stroke-width': 2,
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
			'transform': 'translate(0, ' + height + ')'
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