(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.5) - margins.top - margins.bottom,
		vis, vis_group, aspect

	var dataset = [ [5, 20], [480, 90], [250, 50], [100, 33], [330, 95], [410, 12], [475, 44], [25, 67], [85, 21], [220, 88] ]

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
	        'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	    })

	aspect = chart_container.width() / chart_container.height()

	var circles = vis_group.selectAll('circle')
		.data(dataset)
			.enter().append('circle')
		.attr({
			'cx': function(d){
				return d[0] + 10
			},
			'cy': function(d){
				return d[1]
			},
			'r': function(d){
				return Math.sqrt(width - d[1])
			},
			'fill': 'rgba(0, 0, 0, .25)'
		})

	vis_group.selectAll('text')
		.data(dataset)
			.enter().append('text')
		.text(function(d){
			return d[0] + ',' + d[1]
		})
		.attr({
			'x': function(d){
				return d[0] + 20
			},
			'y': function(d){
				return d[1]
			},
			'fill': 'rgba(0, 0, 0, 1)'
		})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()