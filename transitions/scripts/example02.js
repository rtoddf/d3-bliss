(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom,
		vis, vis_group, aspect

	var duration = 300

	var color = d3.scale.category20c()

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

	d3.json('../../../data/example_transition02.json', function(error, data){
		vis_group.selectAll('line')
			.data(data)
				.enter().append('line')
			.attr({
				'x1': function(d){
					return d.x1
				},
				'y1': function(d){
					return d.y1
				},
				'x2': function(d){
					return d.x2
				},
				'y2': function(d){
					return d.y2
				},
				'stroke': function(d){
					return color(d.x1)
				},
				'stroke-width': function(d){
					return d.stroke
				}
			})

		vis_group.selectAll('circle')
			.data(data)
				.enter().append('circle')
			.attr({
				'class': 'circle',
				'cx': function(d){
					return d.x1
				},
				'cy': function(d){
					return d.y1
				},
				'r': function(d){
					return d.r
				},
				'fill': function(d){
					return color(d.x1)
				}			
			})
			.on({
				'mouseover': over,
				'mouseout': out
			})

		function over(){
			d3.select(this).transition()
				.duration(duration)
				.attr({
					'r': function(){
						return d3.select(this).attr('r') * 3
					}
				})
		}

		function out(){
			d3.select(this).transition()
				.duration(duration)
				.attr({
					'r': function(){
						return d3.select(this).attr('r') / 3
					}
				})
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