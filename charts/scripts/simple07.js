(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = width - margins.top - margins.bottom,
		color = 'rgba(0,50,100,1)',
		stroke_color = 'rgba(255,255,255,1)',
		stroke_width = 2,
		vis, vis_group, aspect, pack

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

	//pack layout
	pack = d3.layout.pack()
		.size([width, height - 50])
		.padding(10)

	d3.json('data/example07b.json', function(data){
		var nodes = pack.nodes(data)

		var node = vis.selectAll('.node')
		.data(nodes)
			.enter().append('g')
		.attr({
			'class': 'node',
			'transform': function(d){
				return 'translate(' + d.x + ', ' + d.y + ')'
			}
		})

		node.append('circle')
			.attr({
				'r': function(d){
					return d.r
				},
				'fill': color,
				'opacity': .25,
				'stroke': stroke_color,
				'stroke-width': stroke_width
			})

		node.append('text')
			.text(function(d){
				return d.children ? "" : d.name
			})
			.attr({
				'class': 'bubble_text',
				'text-anchor': 'middle'
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