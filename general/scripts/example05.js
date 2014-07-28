(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = width - margins.top - margins.bottom,
		vis, vis_group, aspect,
		stroke_width = 4,
		stroke_color = 'rgba(0,50,100,.5)'

	// The data for our line
	var lineData = [ { 'x': width * 0, 'y': height * .25},
				{ 'x': width * .20, 'y': height * .75},
				{ 'x': width * .40, 'y': height * .25},
				{ 'x': width * .60, 'y': height * .75},
				{ 'x': width * .80, 'y': height * .25}, 
				{ 'x': width * 1, 'y': height * .75} ]

	// This is the accessor function we need
	var lineFunction = d3.svg.line()
		.x(function(d){ return d.x })
		.y(function(d){ return d.y })
		.interpolate('cardinal')

	// linear - piecewise linear segments, as in a polyline
	// step-before - alternate between vertical and horizontal segments, as in a step function
	// step-after - alternate between horizontal and vertical segments, as in a step function
	// basis - a B-spline, with control point duplication on the ends
	// basis-open - an open B-spline; may not intersect the start or end
	// basis-closed - a closed B-spline, as in a loop
	// bundle - equivalent to basis, except the tension parameter is used to straighten the spline
	// cardinal - a Cardinal spline, with control point duplication on the ends
	// cardinal-open - an open Cardinal spline; may not intersect the start or end, but will intersect other control points
	// cardinal-closed - a closed Cardinal spline, as in a loop
	// monotone - cubic interpolation that preserves monotonicity in y

	var vis = d3.select('#example').append('svg')
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

	var line_graph = vis_group.append('path')
		.attr({
			'd': lineFunction(lineData),
			'stroke': stroke_color,
			'stroke-width': stroke_width,
			'fill': 'none'
		})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})
})()