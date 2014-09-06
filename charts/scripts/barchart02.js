(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 30, left: 40},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom,
		vis, vis_group, aspect;

	var x0 = d3.scale.ordinal()
		.rangeRoundBands([ 0, width ], .1)

	var x1 = d3.scale.ordinal()

	var y = d3.scale.linear()
		.range([ height, 0 ])

	var color = d3.scale.category20c();

	var xAxis = d3.svg.axis()
		.scale(x0)
		.orient('bottom')

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left')
		.tickFormat(d3.format('.2s'))

	vis = d3.select('#example').append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})

	vis_group = vis.append('g')
		.attr({
			'transform': 'translate(' + margins.left + ',' + margins.top + ')'
		})

	aspect = chart_container.width() / chart_container.height()

	d3.csv('data/example01d.csv', function(error, data){
		var ageNames = d3.keys(data[0]).filter(function(key){
			return key!== 'State'
		})

		console.log('data: ', data)

		data.forEach(function(d){
			d.ages = ageNames.map(function(name){
				return {
					name: name,
					value: +d[name]
				}
			})
		})

		console.log('data after: ', data)

		x0.domain(data.map(function(d){
			return d.State
		}))

		x1.domain(ageNames).rangeRoundBands([ 0, x0.rangeBand() ])

		y.domain([ 0, d3.max(data, function(d){
			return d3.max(d.ages, function(d){
				return d.value
			})
		})])

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
					'transform': 'rotate(-90)',
					'y': 6,
					'dy': '.71em'
				})
				.style({
					'text-anchor': 'end'
				})
				.text('Population')

		var state = vis_group.selectAll('.state')
			.data(data)
				.enter().append('g')
			.attr({
				'class': 'g',
				'transform': function(d){
					return 'translate(' + x0(d.State) + ', 0)'
				}
			})

		state.selectAll('rect')
			.data(function(d){
				return d.ages
			})
				.enter().append('rect')
			.attr({
				'width': x1.rangeBand(),
				'x': function(d){
					return x1(d.name)
				},
				'y': function(d){
					return y(d.value)
				},
				'height': function(d){
					return height - y(d.value)
				},
				'fill': function(d){
					return color(d.name)
				}
			})

		var legend = vis_group.selectAll('.legend')
			.data(ageNames.slice().reverse())
				.enter().append('g')
			.attr({
				'class': 'legend',
				'transform': function(d, i){
					return 'translate(0, ' + (i * 20) + ')'
				}
			})

		legend.append('rect')
			.attr({
				'x': width - 18,
				'width': 18,
				'height': 18,
				'fill': color
			})

		legend.append('text')
			.attr({
				'x': width - 24,
				'y': 9,
				'dy': '.35em',
				'text-anchor': 'end'
			})
			.text(function(d){
				return d
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