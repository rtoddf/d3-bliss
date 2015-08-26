var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 30},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.66) - margins.top - margins.bottom,
	vis, vis_group, aspect

(function () {
	queue()
		.defer(d3.json, 'data/example09a.json')
		.defer(d3.json, 'data/example09ab.json')
		.await(ready)

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

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()

function ready(error, lineData, newLineData){
	var xScale = d3.scale.linear()
		.domain([ 0, 
			d3.max([ 
				d3.max(lineData, function(d){
					return d.x 
				}), d3.max(newLineData, function(d){ 
					return d.x
				})
			])
		])
		.range([ 0, width ])

	var yScale = d3.scale.linear()
		.domain([ 0, 
			d3.max([ 
				d3.max(lineData, function(d){
					return d.y
				}), d3.max(newLineData, function(d){ 
					return d.y
				})
			])
		])
		.range([ height, 0 ])

	// var circles = vis_group.selectAll('circle')
	// 	.data(lineData)
	// 		.enter().append('circle')
	// 	.attr({
	// 		'class': 'circles',
	// 		'cx': function(d){
	// 			return xScale(d.x)
	// 		},
	// 		'cy': function(d){
	// 			return yScale(d.y)
	// 		},
	// 		'r': 5,
	// 		'fill': '#ae0000'
	// 	})

	var lineFunction = d3.svg.line()
			.x(function(d){ 
				return xScale(d.x)
			})
			.y(function(d){
				return yScale(d.y)
			})
			.interpolate('basis')

	var linePath = vis_group.append('path')
		.attr({
			'class': 'the_line',
			'd': lineFunction(lineData),
			'stroke': '#ae0000',
			'stroke-width': 2,
			'fill': 'none'
		})

	var xAxis = d3.svg.axis()
		.scale(xScale)

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')

	var xAxisGroup = vis_group.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0, ' + height + ')'
		})
		.call(xAxis)

	var yAxisGroup = vis_group.append('g')
		.attr({
			'class': 'y axis',
			'transform': 'translate(0, 0)'
		})
		.call(yAxis)

	function animate(){
		var duration = 1500

		d3.selectAll('.the_line').transition()
			.duration(duration)
			.attr({
				'd': function(d){
					return lineFunction(newLineData)
				}
			})
			.style({
				'stroke': '#003264'
			})

		// d3.selectAll('.circles').transition()
		// 	.duration(duration)
		// 	.attr({
		// 		'cx': function(d){
		// 		return xScale(d.x)
		// 		},
		// 		'cy': function(d){
		// 			return yScale(d.y)
		// 		}
		// 	})
		// 	.style({
		// 		'fill': '#003264'
		// 	})
	}

	$('.animate').on('click', function(){
		animate(this)
	})
}
