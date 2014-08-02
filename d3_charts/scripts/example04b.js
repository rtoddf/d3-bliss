(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 30},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom,
		vis, vis_group, aspect

	var parseDate = d3.time.format('%d-%b-%y').parse

	var x = d3.time.scale()
		.range([0, width])

	var y = d3.scale.linear()
		.range([height, 0])

	var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom')

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left')

	var line = d3.svg.line()
		.x(function(d){
			return x(d.date)
		})
		.y(function(d){
			return y(d.close)
		})

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

	d3.tsv('data/example04b.tsv', function(error, data){
		data.forEach(function(d){
			d.date = parseDate(d.date)
			d.close = +d.close
		})

		// .extent finds the min and max simultaneously
		x.domain(d3.extent(data, function(d){
			return d.date
		}))

		y.domain(d3.extent(data, function(d){
			return d.close
		}))

		vis_group.append('g')
			.attr({
				'class': 'x axis',
				'transform': 'translate(0, ' + height + ')'
			})
			.call(xAxis)

		vis_group.append('g')
			.attr({
				'class': 'y axis'
			})
			.call(yAxis)
			.append('text')
				.attr({
					'tansform': 'rotate(-90)',
					'x': 0,
					'dx': '.71em',
					'y': -10,
					'dy': '.71em'
				})
				.style('text-anchor', 'end')
				.text('Price ($)')

		vis_group.append('path')
			.datum(data)
			.attr({
				'class': 'line',
				'd': line
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