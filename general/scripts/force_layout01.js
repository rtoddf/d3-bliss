(function(){
	var container_parent = $('.display'),
		chart_container = $('#example'),
		width = container_parent.width(),
		height = width,
		vis, aspect,
		color = d3.scale.category20c(),
		radius = 12

	vis = d3.select('#example').append('svg')
		.attr({
			'width': width,
			'height': height,
			// 'preserveAspectRatio': 'xMinYMid',
			// 'viewBox': '0 0 ' + width + ' ' + height
		})

	vis.append('rect')
		.attr({
			'width': width,
			'height': height
		})	

	aspect = chart_container.width() / chart_container.height()

	var force = d3.layout.force()
		.gravity(0)
		.charge(-10)
		.size([ width, height ])

	var nodes = force.nodes(),
		a = {type: 0, x: 1 * width / 8, y: 1 * height / 8, fixed: true},
		b = {type: 1, x: 4 * width / 8, y: 1 * height / 8, fixed: true},
		c = {type: 2, x: 7 * width / 8, y: 1 * height / 8, fixed: true},
		d = {type: 3, x: 1 * width / 8, y: 4 * height / 8, fixed: true},
		e = {type: 4, x: 4 * width / 8, y: 4 * height / 8, fixed: true},
		f = {type: 5, x: 7 * width / 8, y: 4 * height / 8, fixed: true},
		g = {type: 6, x: 1 * width / 8, y: 7 * height / 8, fixed: true},
		h = {type: 7, x: 4 * width / 8, y: 7 * height / 8, fixed: true},
		i = {type: 8, x: 7 * width / 8, y: 7 * height / 8, fixed: true}

	d3.json('../../../data/animated_dots.json', function(error, nuds){
		console.log('nuds: ', nuds)
	})

	nodes.push(a, b, c, d, e, f, g, h, i)

	console.log('nodes: ', nodes)

	vis.selectAll('circle')
		.data(nodes)
			.enter().append('circle')
		.attr({
			'r': radius,
			'cx': function(d){
				return d.x
			},
			'cy': function(d){
				return d.y
			}
		})
		.style({
			'fill': fill
		})
		.call(force.drag)

	force.on('tick', function(e){
		var k = e.alpha * .08
		nodes.forEach(function(node){
			var center = nodes[node.type]
			node.x += (center.x - node.x) * k
			node.y += (center.y - node.y) * k
		})

		vis.selectAll('circle')
			.attr({
				'cx': function(d){
					return d.x
				},
				'cy': function(d){
					return d.y
				}
			})
	})

	function fill(d) {
		return color(d.type)
	}

	var p0

	vis.on('mousemove', function() {
		var num_nodes = 9,
			new_radius = Math.floor(Math.random() * 8) + 2

		var p1 = d3.mouse(this),
			node = {type: Math.random() * num_nodes | 0, x: p1[0], y: p1[1], px: (p0 || (p0 = p1))[0], py: p0[1]}

		p0 = p1

		vis.append('circle')
			.data([node])
			.attr({
				'cx': function(d){
					return d.x
				},
				'cy': function(d){
					return d.y
				},
				'r': new_radius
			})
			.style({
				'fill': fill
			})
			.transition()
				.delay(2000)
				.attr({
					'r': 1e-6
				})
				.each('end', function(){
					nodes.splice(num_nodes, 1)
				})
				.remove()

		nodes.push(node)
		force.start()
	})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()