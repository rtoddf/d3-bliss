var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 30, right: 10, bottom: 10, left: 30},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 1.5) - margins.top - margins.bottom,
	rect_color = '#fd8d3c',
	color = d3.scale.category20c(),
	vis, vis_group, aspect

// The comma (",") option enables the use of a comma for a thousands separator.
// The "0" option enables zero-padding.
// fixed ("f") - use Number.toFixed.
var format = d3.format(',.0f')

var x = d3.scale.linear()
	.range([ 0, width ])

var y = d3.scale.ordinal()
	.rangeRoundBands([ 0, height], .1)

var xAxis = d3.svg.axis()
	.scale(x)
	.orient('top')
	.tickSize(-height)

var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left')
	.tickSize(0)

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

d3.csv('../data/bar01.csv', function(error, data){
	data.forEach(function(d){
		d.value = +d.value
	})

	data.sort(function(a, b){
		return b.value - a.value
	})

	x.domain([ 0, d3.max(data, function(d){
		return d.value
	})])

	y.domain(data.map(function(d){
		return d.name
	}))

	var bar = vis_group.selectAll('g.bar')
			.data(data)
		.enter().append('g')
		.attr({
			'class': 'bar',
			'transform': function(d){
				return 'translate(0, ' + y(d.name) + ')'
			}
		})

	bar.append('rect')
		.attr({
			'width': function(d){
				return x(d.value)
			},
			'height': function(d){
				return y.rangeBand()
			},
			'fill': rect_color
		})

	bar.append('text')
		.attr({
			'class': 'value',
			'x': function(d){
				return x(d.value)
			},
			'dx': -3,
			'y': y.rangeBand() / 2,
			'dy': '.35em',
			'text-anchor': 'end',
			'fill': '#fff'
		})
		.text(function(d){
			return format(d.value)
		})

	vis_group.append('g')
		.attr({
			'class': 'x axis'
		})
		.call(xAxis)

	vis_group.append('g')
		.attr({
			'class': 'y axis'
		})
		.call(yAxis)
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})