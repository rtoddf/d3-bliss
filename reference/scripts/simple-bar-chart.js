var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 30, left: 40},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.66) - margins.top - margins.bottom,
	vis, vis_group, aspect

// var dataset = []

// for(var i = 0; i < 25; i++){
// 	var newNum = Math.random() * 30
// 	dataset.push(newNum)
// }

var formatPercent = d3.format('.0%')

var x = d3.scale.ordinal()
		.rangeRoundBands([ 0, width ], .1)

var y = d3.scale.linear()
		.range([ height, 0 ])

var xAxis = d3.svg.axis()
		.scale(x)
		.orient('bottom')

var yAxis = d3.svg.axis()
		.scale(y)
		.orient('left')
		// .tickFormat(formatPercent)

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

d3.csv('data/sales.csv', function(error, data){

	data.forEach(function(d){
		console.log('d: ', d)
		d.sales = +d.sales
	})

	x.domain(data.map(function(d){
		return d.salesperson
	}))

	y.domain([0, d3.max(data, function(d){
		return d.sales
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
			.text('Sales')

	vis_group.selectAll('bar')
		.data(data)
			.enter().append('rect')
		.attr({
			'class': 'bar',
			'x': function(d){
				return x(d.salesperson)
			},
			'width': x.rangeBand(),
			'y': function(d){
				return y(d.sales)
			},
			'height': function(d){
				return height - y(d.sales)
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