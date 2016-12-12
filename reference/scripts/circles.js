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

	var circles = vis_group.selectAll('circle')
		.data(d3.range(1, 12))
			.enter().append('circle')
		.attr({
			'cx':function(d, i){
				return (i + 30) * d
			},
			'cy': function(d, i){
				return (i + 15) * d
			},
			'r': function(d, i){
				return d * (i + 10)
			},
			'fill': function(d){
				return 'rgb(0,50,100)'
			},
			'opacity': function(d){
				return .5
			},
			'stroke-width': function(d, i) {
			    return d / i
			},
			'stroke': 'white'
		})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()