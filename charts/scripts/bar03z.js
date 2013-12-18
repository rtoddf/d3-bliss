var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .6) - margins.top - margins.bottom,
	color = d3.scale.category20c(),
	vis, vis_group, aspect

var x = d3.scale.ordinal()
	.rangeRoundBands([ 0, width - margins.right - margins.left ])

var y = d3.scale.linear()
	.range([ 0, height - margins.top - margins.bottom ])

var z = d3.scale.ordinal()
	.range([ 'lightpink', 'darkgray', 'lightblue' ])

var parse = d3.time.format('%m/%Y').parse,
	format = d3.time.format('%b')

vis = d3.select('#example').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})
	
vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + margins.left + ', ' + (height - margins.top) + ')'
	})

aspect = chart_container.width() / chart_container.height()


d3.csv('../data/crimes01.csv', function(data){
	// transpose the data into layers by cause
	var causes = d3.layout.stack()(['wounds', 'other', 'disease'].map(function(cause){
		return data.map(function(d){
			return {
				x: parse(d.date),
				y: +d[cause]
			}
		})
	}))

	// compute the x-domain (by date) and y-domain (by top)
	x.domain(causes[0].map(function(d){
		return d.x
	}))
	y.domain([ 0, d3.max(causes[causes.length - 1], function(d){
		return d.y0 + d.y
	})])

	// add a group for each cause
	var cause = vis_group.selectAll('g.cause')
		.data(causes)
			.enter().append('g')
		.attr({
			'class': 'cause',
			'fill': function(d, i){
				return z(i)
			},
			'stroke': function(d, i){
				return d3.rgb(z(i)).darker()
			}
		})

	// add a rect for each date
	var rect = cause.selectAll('rect')
		.data(Object)
			.enter().append('rect')
		.attr({
			'x': function(d){
				return x(d.x)
			},
			'y': function(d){
				return -y(d.y0) - y(d.y)
			},
			'height': function(d){
				return y(d.y)
			},
			'width': function(d){
				return x.rangeBand()
			}
		})

	var label = vis_group.selectAll('text')
		.data(x.domain())
			.enter().append('text')
		.attr({
			'x': function(d){
				return x(d) + x.rangeBand() / 2
			},
			'y': 6,
			'dy': '.71em',
			'text-anchor': 'middle'
		})
		.text(format)

	var rule = vis_group.selectAll('g.rule')
		.data(y.ticks(5))
			.enter().append('g')
		.attr({
			'class': 'rule',
			'transform': function(d){
				return 'translate(0, ' + -y(d) + ')'
			}
		})

	rule.append('line')
		.attr({
			'x2': width - margins.left - margins.right,
			'stroke': function(d){
				return d ? '#fff' : '#000'
			},
			'stroke-opacity': function(d){
				return d ? .7 : null
			}
		})

	rule.append('text')
		.attr({
			'x': width - margins.left - margins.right + 6,
			'dy': '.35em'			
		})
		.text(d3.format(', d'))
})














