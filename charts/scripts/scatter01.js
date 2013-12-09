var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 40, left: 60},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.5) - margins.top - margins.bottom,
	vis, vis_group, aspect

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

var color = d3.scale.category20c()

var tooltip = d3.select('body').append('div')
	.attr('class', 'tooltip')
	.style('opacity', 1e-6)

var x = d3.scale.linear()
	.range([ 0, width ])

var y = d3.scale.linear()
	.range([ height, 0 ])

var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom')
	.tickFormat(function(d){
		return Math.round(d / 1e6) + 'M'
	})
	

var yAxis = d3.svg.axis()
	.scale(y)
	.orient('left')
	.tickSize(-width)

d3.csv('../data/planets01.csv', function(error, data){
	data.forEach(function(d) {
		d.number = +d.number
		d.distance = +d.distance
		d.diameter = +d.diameter
		d.density = +d.density
	})

	x.domain(d3.extent(data, function(d){
		return d.distance
	})).nice()

	y.domain(d3.extent(data, function(d){
		return d.density
	})).nice()

	planet = vis_group.selectAll('circle')
		.data(data)
			.enter().append('circle')
		.attr({
			'class': 'planet',
			'cx': function(d){
				return x(d.distance)
			},
			'cy': function(d){
				return y(d.density)
			},
			'r': function(d){
				return d.diameter / 1500
			},
			'fill': function(d){
				return color(d.number)
			},
			'stroke': '#000',
			'stoke-width': 1,
			'stroke-opacity': .5
		})

	planet.on('mouseover', function(d) {
		tooltip.transition()
			.duration(200)
			.style('opacity', 1)

		tooltip.html(d.planet)
			.style({
				'left': (d3.event.pageX + 10) + 'px',
				'top': (d3.event.pageY) + 'px'
			})
	})

	planet.on('mouseout', function(d) {
		tooltip.transition()
			.duration(200)
			.style('opacity', 0)
	})

	vis_group.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0,' + height + ')'
		})
		.call(xAxis)
			.append('text')
				.attr({
					// 'transform': 'rotate(-90)',
					'x': width,
					'dy': 30
				})
				.style({
					'text-anchor': 'end'
				})
				.text('Distance from the Sun (miles)')

	vis_group.append('g')
		.attr({
			'class': 'y axis'
		})
		.call(yAxis)
			.append('text')
				.attr({
					'transform': 'rotate(-90)',
					'x': '.17em',
					'y': -50
				})
				.style({
					'text-anchor': 'end'
				})
				.text('Density (kg pr. cubic meter)')
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})