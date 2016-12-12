(function(){
	var container_parent = $('.display'),
		chart_container = $('#example'),
		margins = {top: 250, right: 40, bottom: 250, left: 40},
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

	var x = d3.time.scale()
		.domain([ new Date(2012, 0, 1), new Date(2013, 0, 1) ])
		.range([ 0, width ])

	var xAxis = d3.svg.axis()
		.scale(x)

	vis_group.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0, ' + height + ')'
		})
		.call(xAxis)
		.selectAll('text')
			.attr({
				'x': 9,
				'y': 0,
				'dy': '.35em',
				'transform': 'rotate(90)'				
			})
			.style({
				'text-anchor': 'start'
			})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()