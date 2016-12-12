(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = width - margins.top - margins.bottom,
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

	var tooltip = d3.select('body').append('div')
		.attr('class', 'tooltip')
		.style('opacity', 1e-6)

	vis.on('mouseover', function(d) {
		tooltip.transition()
			.duration(200)
			.style('opacity', 1)
		})

	.on('mousemove', function(d, i) {
		if (d3.mouse(this)[0] < 0) {
			tooltip.transition().duration(200).style('opacity', 0)
		} else {
			tooltip.html(function(d) {
				var tooltip_data = ''
				tooltip_data += '<span>Site: SOMETHING</span><span>Visits: VISITS</span><br />'
				return tooltip_data
			})
			.style('left', (d3.event.pageX + 10) + 'px')
			.style('top', (d3.event.pageY) + 'px')
		}
	})
	.on('mouseout', function(d) {
		tooltip.transition().duration(200).style('opacity', 0)
	})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()