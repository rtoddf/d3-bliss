(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom,
		circle_color = '#003264',
		radius = 5,
		font_size = 14,
		vis, vis_group, aspect

	vis = d3.select('#example')
		.append('svg')
			.attr({
				'width': width + margins.left + margins.right,
				'height': height + margins.top + margins.bottom,
				'preserveAspectRatio': 'xMinYMid',
				'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
			})

	vis_group = vis
		.append('g')
		.attr({
			'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
		})

	aspect = chart_container.width() / chart_container.height()

	var tree = d3.layout.tree()
		.size([400, 400])

	var diagonal = d3.svg.diagonal()
		.projection(function(d){
			return [d.y, d.x]
		})

	d3.json('data/example06a.json', function(data){
		var nodes = tree.nodes(data)
		var links = tree.links(nodes)

		var node = vis_group.selectAll('.node')
			.data(nodes)
				.enter().append('g')
			.attr({
				'class': 'node',
				'transform': function(d){
					return 'translate(' + d.y + ', ' + d.x + ')'
				}
			})

		node.append('text')
			.text(function(d){
				return d.name
			})
			.attr({
				'x': 0,
				'y': -10,
				'fill': circle_color
			})
			.style({
				'font-size': font_size,
				'font-weight': 'bold'
			})

		vis_group.selectAll('.link')
				.data(links)
			.enter().append('path')
				.attr({
					'class': 'link',
					'fill': 'none',
					'stroke': circle_color,
					'd': diagonal
				})

		node.append('circle')
			.attr({
				'r': radius,
				'fill': circle_color
			})
	})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()