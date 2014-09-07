var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 30, left: 40},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.66) - margins.top - margins.bottom,
	vis, vis_group, aspect

var x_axis_sorter = 'Year', y_axis_label = 'Admissions vs Population'
var color = d3.scale.category20()

var x0 = d3.scale.ordinal()
	.rangeRoundBands([ 0, width ], .1)

var x1 = d3.scale.ordinal()

var y = d3.scale.linear()
	.range([ height, 0 ])

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
		'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	})

aspect = chart_container.width() / chart_container.height()

d3.csv('data/barchart04.csv', function(error, data){
	
	var x_sorter = d3.keys(data[0]).filter(function(key){
		return key !== x_axis_sorter
	})

	data.forEach(function(d){
		d.sorter = x_sorter.map(function(name){
			return {
				name: name,
				value: +d[name]
			}
		})
	})

	console.log(data)

	x0.domain(data.map(function(d){
		return d[x_axis_sorter]
	}))
	x1.domain(x_sorter).rangeRoundBands([ 0, x0.rangeBand() ])
	y.domain([ 0, d3.max(data, function(d){
		return d3.max(d.sorter, function(d){
			return d.value
		})
	})])

	vis_group.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0, ' + height + ')'
		})
		.call(xAxis)
		.selectAll('text')
			.attr({
				'x': '-.8em',
				'dx': 0,
				'y': '.70em',
				'dy': 0,
				'transform': function(d) {
					return 'rotate(-60)';
				}
			})
			.style({
				'text-anchor': 'end'
			});

	vis_group.append('g')
		.attr({
			'class': 'y axis'
		})
		.call(yAxis)
			.append('text')
				.attr({
					'transform': 'rotate(-90)',
					'y': 6,
					'dy': '.171em'
				})
				.style({
					'text-anchor': 'end'
				})
				.text(y_axis_label)

	var x_stuff = vis_group.selectAll('.xrects')
		.data(data)
			.enter().append('g')
		.attr({
			'class': 'xrects',
			'transform': function(d){
				return 'translate(' + x0(d[x_axis_sorter]) + ', 0)'
			}
		})

	x_stuff.selectAll('rect')
		.data(function(d){
			return d.sorter
		})
			.enter().append('rect')
		.attr({
			'x': function(d){
				return x1(d.name)
			},
			'y': function(d){
				return y(d.value)
			},
			'width': x1.rangeBand,
			'height': function(d){
				return height - y(d.value)
			},
			'fill': function(d){
				return color(d.name)
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