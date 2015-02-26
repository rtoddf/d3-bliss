var container_parent = $('.display') ,
	chart_container = $('#chart'),
	margins = {top: 30, right: 90, bottom: 10, left: 90},
	width = container_parent.width() - margins.left - margins.right,
	height = (width) - margins.top - margins.bottom,
	color = d3.scale.category20c(),
	vis, vis_group, aspect

var rect_color = '#999'

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

vis = d3.select('#chart').append('svg')
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

d3.json('data/us_census.json', function(error, data){
	data.forEach(function(d){
		d.pop = +d.pop
	})

	data.sort(function(a, b){
		return b.pop - a.pop
	})

	// set the scale domain
	x.domain([ 0, d3.max(data, function(d){
		return d.pop
	})])

	// use map for ordinal domains
	y.domain(data.map(function(d){
		return d.placename
	}))

	var bar = vis_group.selectAll('g.bar')
			.data(data)
		.enter().append('g')
		.attr({
			'class': 'bar',
			'transform': function(d){
				return 'translate(0, ' + y(d.placename) + ')'
			}
		})

	bar.append('rect')
		.attr({
			'width': function(d){
				return x(d.pop)
			},
			'height': function(d){
				return y.rangeBand()
			},
			'fill': rect_color
		})
		.style({
				'cursor': 'pointer'
			})
		.on('mouseover', function(d){
			d3.select(this)
				.transition()
					.duration(200)
					.attr({
						'fill': '#444'
					})

			d3.select('.tooltip')
				.html(function(){
					console.log('d: ', d)
					return '<span>' + d.placename + ': </span><span>' + format(d.pop) + '</span>'
				})
				.style({
					'left': (d3.event.pageX + 15) + 'px',
					'top': (d3.event.pageY) + 'px'
				})
				.transition()
					.duration(200)
					.style({
						'opacity': 1
					})
		})
		.on('mouseout', function(d){
			d3.select(this)
				.transition()
					.duration(200)
					.attr({
						'fill': rect_color
					})
		})

	// bar.append('text')
	// 	.attr({
	// 		'class': 'value',
	// 		'x': function(d){
	// 			return x(d.pop)
	// 		},
	// 		'dx': -3,
	// 		'y': y.rangeBand() / 2,
	// 		'dy': '.35em',
	// 		'text-anchor': 'end',
	// 		'fill': '#fff'
	// 	})
	// 	.text(function(d){
	// 		return format(d.pop)
	// 	})

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

var tooltip = d3.select('body').append('div')
	.attr({
		'class': 'tooltip',
		'opacity': 1e-6
	})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})