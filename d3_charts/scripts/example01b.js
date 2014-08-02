(function () {
	var container_parent = $('.display'),
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 30, left: 40},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom,
		vis, vis_group, aspect

	var formatPercent = d3.format('.0%')

	var x = d3.scale.ordinal()
			.rangeRoundBands([ 0, width ], .1)

	var y = d3.scale.linear()
			.range([ height, 0 ])

	// sets the colors for the pie pieces
	var color = d3.scale.ordinal()
			.range(['#003264', '#ae0000', '#baba71', '#666666'])

	var xAxis = d3.svg.axis()
			.scale(x)
			.orient('bottom')

	var yAxis = d3.svg.axis()
			.scale(y)
			.orient('left')
			.tickFormat(formatPercent)

	vis = d3.select('#example').append('svg')
			.attr({
				'width': width + margins.left + margins.right,
				'height': height + margins.top + margins.bottom,
				'class': 'chart',
				'preserveAspectRatio': 'xMinYMid',
				'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
			})

	vis_group = vis.append('g')
		.attr({
			'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
		})

	aspect = chart_container.width() / chart_container.height()

	d3.tsv('data/example01b.tsv', function(error, data){
		data.forEach(function(d){
			d.frequency = +d.frequency
		})

		x.domain(data.map(function(d){
			return d.letter
		}))

		y.domain([0, d3.max(data, function(d){
			return d.frequency
		})])

		vis_group.append('g')
			.attr({
				'class': 'x axis',
				'transform': 'translate(0,' + height + ')'
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
				.style('text-anchor', 'end')
				.text('Frequency')

		vis_group.selectAll('bar')
			.data(data)
				.enter().append('rect')
			.attr({
				'class': 'bar',
				'x': function(d){
					return x(d.letter)
				},
				'width': x.rangeBand(),
				'y': function(d){
					return y(d.frequency)
				},
				'height': function(d){
					return height - y(d.frequency)
				},
				'fill': '#003264',
				'opacity': function(d){
					if (formatPercent(d.frequency) == '8%'){
						return .5
					}
				}
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
// http://bl.ocks.org/mbostock/3885304