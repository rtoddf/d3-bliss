var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .6) - margins.top - margins.bottom,
	color = d3.scale.category20c(),
	vis, vis_group, aspect

var x = d3.scale.ordinal()
	.rangeRoundBands([ 0, width], .1)

var y = d3.scale.linear()
	.rangeRound([ height, 0 ])

var z = d3.scale.ordinal()

var xAxis = d3.svg.axis()
	.scale(x)
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

d3.csv('../data/state_population.csv', function(data){
	
	z.domain(d3.keys(data[0]).filter(function(key){
		return key !== 'State'
	}))

	data.forEach(function(d){
		var y0 = 0
		d.ages = z.domain().map(function(name){
			return {
				name: name,
				y0: y0,
				y1: y0 += +d[name]
			}
		})
		d.total = d.ages[d.ages.length - 1].y1
	})

	data.sort(function(a, b){
		return b.total - a.total
	})

	x.domain(data.map(function(d){
		return d.State
	}))

	y.domain([0, d3.max(data, function(d){
		return d.total
	})])

	vis_group.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0,' + height + ')'
		})
		.call(xAxis)

	var state = vis_group.selectAll('.state')
		.data(data)
			.enter().append('g')
		.attr({
			'class': 'g',
			'transform': function(d){
				return 'translate(' + x(d.State) + ',0)'
			}
		})

	state.selectAll('rect')
		.data(function(d){
			return d.ages
		})
			.enter().append('rect')
		.attr({
			'y': function(d){
				return y(d.y1)
			},
			'width': x.rangeBand(),
			'height': function(d){
				return y(d.y0) - y(d.y1)
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
















