var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 200},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .6) - margins.top - margins.bottom,
	color = d3.scale.category20c(),
	vis, vis_group, aspect

var x = d3.scale.ordinal()
	.rangeRoundBands([ 0, width - margins.right - margins.left ])

var y = d3.scale.linear()
	.range([ 0, height - margins.top - margins.bottom ])

var z = d3.scale.ordinal()

var xAxis = d3.svg.axis()
	.scale(x)
	.orient('bottom')

var yAxis = d3.svg.axis()
	.scale(y)
	.orient('right')
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
		'transform': 'translate(' + margins.left + ', ' + (height - margins.top) + ')'
	})
aspect = chart_container.width() / chart_container.height()

d3.csv('../data/languages01.csv', function(data){
	var language_sorter = d3.keys(data[0]).filter(function(key){
		return key !== 'Year'
	})

	var languages = d3.layout.stack()(d3.keys(data[0]).filter(function(key){
		return key !== 'Year'
	}).map(function(lang){
		return data.map(function(d){
			return {
				name: lang,
				x: d.Year,
				y: +d[lang]
			}
		})
	}))

	console.log('languages: ', languages)

	x.domain(languages[0].map(function(d){
		return d.x
	}))
	y.domain([ 0, d3.max(languages[languages.length - 1], function(d){
		return d.y0 + d.y
	})])

	var language = vis_group.selectAll('g.cause')
		.data(languages)
			.enter().append('g')
		.attr({
			'class': 'cause',
			'fill': function(d, i){
				return color(d[0].name)
			},
			'stroke': function(d, i){
				return d3.rgb(color(d[0].name)).darker()
			}
		})

	var rect = language.selectAll('rect')
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
		.text(function(d){
			return d
		})

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
		.text(d3.format('.2s'))

	vis_group.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0, ' + height + ')'
		})
		.call(xAxis)

	// vis_group.append('g')
	// 	.attr({
	// 		'class': 'y axis',
	// 		'trasform': 'translate(' + width + ', 0)'
	// 	})
	// 	.call(yAxis)
	// 	.append('text')
	// 		.attr({
	// 			'transform': 'rotate(-90)',
	// 			'y': 6,
	// 			'dy': '.71em'
	// 		})
	// 		.style({
	// 			'text-anchor': 'end'
	// 		})
	// 		.text('Number of Americans')

	var theLegend = vis_group.append('g')
		.attr({
			'transform': function(d, i){
				return 'translate(' + -(width - margins.right) + ', ' + -(height - margins.top) + ')'
			}
		})

	var legend = theLegend.selectAll('.legend')
		.data(languages)
			.enter().append('g')
		.attr({
			'transform': function(d, i){
				return 'translate(0, ' + (i * 20) + ')'
			}
		})

	legend.append('rect')
		.attr({
			'x': width - 18,
			'width': 18,
			'height': 18,
			'fill': function(d, i){
				return color(language_sorter[i])
			}
		})

	legend.append('text')
		.attr({
			'x': width - 24,
			'y': 9,
			'dy': '.35em',
			'text-anchor': 'end'
		})
		.text(function(d){
			return d[0].name
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})