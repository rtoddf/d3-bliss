(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example_a'),
		margins = {top: 20, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.5) - margins.top - margins.bottom,
		vis, vis_group, aspect

	var vis = d3.select('#example_a').append('svg')
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

	var xScale = d3.scale.ordinal()
		.domain(['Sunday','Monday','Tuesday','Wednesday','Thursday','Friday','Saturday'])
		.rangePoints([0 + margins.left, width - margins.right])

	var xAxis = d3.svg.axis()
	    .scale(xScale)

	var xAxisGroup = vis_group.append('g')
	    .attr({
	      'class': 'x axis',
	      'transform': 'translate(0,0)'
	    })
	    .call(xAxis)

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()