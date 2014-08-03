var container_parent, vis, aspect;

var vis_group, legend, xAxis, x0, x1, x;

	// VARS FOR THIS CHART
	var container_parent = $('.article'),
		chart_container = $('#dataVizChart'),
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom;

// append the svg for drawing the chart
vis = d3.select('#dataVizChart')
	.append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	});

vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	});

aspect = chart_container.width() / chart_container.height();

$(window).on('resize', function() {
	var targetWidth = container_parent.width();
	vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		});
});