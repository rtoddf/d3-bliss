(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 5, right: 5, bottom: 5, left: 5},
		width = container_parent.width() - margins.left - margins.right,
		height = width - margins.top - margins.bottom,
		vis, vis_group, aspect,
		line_color = 'rgba(0,50,100,.5)',
		line_stroke_width = 2

	vis = d3.select('#example')
		.append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})

	vis_group = vis.append('g')
		.attr({
	        // 'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	    })

	aspect = chart_container.width() / chart_container.height()

	var yAxisCoordData = d3.range(1, height - 1, 25)
	var xAxisCoordData = d3.range(1, width, 25)

	vis_group.selectAll('line.vertical')
		.data(yAxisCoordData)
			.enter().append('line')
		.attr({
			'x1': function(d){
				return d
			},
			'y1': 1,
			'x2': function(d){
				return d
			},
			'y2': height,
			'class': 'vertical',
			'stroke': line_color,
			'stroke-width': line_stroke_width,
			'opacity': function(d, i){
				if(i % 2 !== 0){
					return .25
				} else {
					return 1
				}
			}
		})

	vis_group.selectAll('line.horizontal')
		.data(xAxisCoordData)
			.enter().append('line')
		.attr({
			'x1': 1,
			'y1': function(d){
				return d
			},
			'x2': width,
			'y2': function(d){
				return d
			},
			'class': 'horizontal',
			'stroke': line_color,
			'stroke-width': line_stroke_width,
			'opacity': function(d, i){
				if(i % 2 !== 0){
					return .25
				} else {
					return 1
				}
			}
		})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()