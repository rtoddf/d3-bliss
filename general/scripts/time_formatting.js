(function () {
	// http://bl.ocks.org/mbostock/1166403

	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 40, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.5) - margins.top - margins.bottom,
		vis, vis_group, aspect,
		parse = d3.time.format('%b %Y').parse		

	// scales and axes. note the inverted domain for the y-scale
	var xScale = d3.time.scale()
		.range([0, width])

	var yScale = d3.scale.linear()
		.range([height, 0])

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.tickSize(-height)
		.tickSubdivide(true)

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.ticks(4)
		.orient('right')

	// an area generator, for the light fill
	var area = d3.svg.area()
		.interpolate('monotone')
		.x(function(d){
			return xScale(d.date)
		})
		.y0(height)
		.y1(function(d){
			return yScale(d.price)
		})

	// a line generator, for the dark stroke
	var line  = d3.svg.line()
		.interpolate('monotone')
		.x(function(d){
			return xScale(d.date)
		})
		.y(function(d){
			return yScale(d.price)
		})

	// add the svg
	vis = d3.select('#example')
		.append('svg')
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

	d3.csv('../data/stocks.csv', function(data){
		// filter to one symbol; the S&P 500
		var values = data.filter(function(d){
			return d.symbol == 'S&P 500'
		})

		// parse dates and numbers. we assume values are sorted by date
		values.forEach(function(d){
			d.date = parse(d.date)
			d.price = +d.price
		})

		// compute the minimum and maximum date, and the maximum price
		xScale.domain([values[0].date, values[values.length - 1].date])
		yScale.domain([0, d3.max(values, function(d){ return d.price })]).nice()

		// add the clip path
		vis_group.append('clipPath')
			.attr({
				'id': 'clip'
			})
			.append('rect')
				.attr({
					'width': width,
					'height': height
				})

		// add the area path
		vis_group.append('path')
			.attr({
				'class': 'area',
				'clip-path': 'url(#clip)',
				'd': area(values)
			})

		// add the xaxis
		vis_group.append('g')
			.attr({
				'class': 'x axis',
				'transform': 'translate(0, ' + height + ')'
			})
			.call(xAxis)

		// add the yaxis
		vis_group.append('g')
			.attr({
				'class': 'y axis',
				'transform': 'translate(' + width + ', 0)'
			})
			.call(yAxis)

		// add the line path
		vis_group.append('path')
			.attr({
				'class': 'line',
				'clip-path': 'url(#clip)',
				'd': line(values)
			})

		vis_group.append('text')
			.attr({
				'x': width - 6,
				'y': height - 6,
				'text-anchor': 'end',
			})
			.text(values[0].symbol)

		// on click, update the x-axis
		vis_group.on('click', function(){
			var n = values.length - 1,
				i = Math.floor(Math.random() * n/2),
				j = i + Math.floor(Math.random() * n/2) + 1

			xScale.domain([ values[i].date, values[j].date ])

			var t = vis.transition().duration(750)

			t.select('.x.axis').call(xAxis)
			
			t.select('.area').attr({
				'd': area(values)
			})

			t.select('.line').attr({
				'd': line(values)
			})
		})

	})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()