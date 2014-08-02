(function () {
	// view-source:http://mbostock.github.io/d3/talk/20111018/flare.json
	// view-source:http://mbostock.github.io/d3/talk/20111018/tree.html
	// http://mbostock.github.io/d3/talk/20111018/tree.html
	// https://github.com/jasondavies/d3-cloud/blob/master/d3.layout.cloud.js

	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 120, bottom: 20, left: 120},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom,
		i = 0,
		root, vis, vis_group, aspect

	var tree = d3.layout.tree()
		.size([ height, width ])

	var diagonal = d3.svg.diagonal()
		.projection(function(d){
			return [ d.y, d.x ]
		})

	var vis = d3.select('#example')
		.append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})
		
	vis_group = vis.append('svg')
			.attr({
				'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
			})

	aspect = chart_container.width() / chart_container.height()

	d3.json('data/example06b.json', function(error, data){
		// console.log(data)

		root = data
		root.x0 = height / 2
		root.y0 = 0

		function toggleAll(d){
			if(d.children){
				d.children.forEach(toggleAll)
				toggle(d)
			}
		}

		// initialize the display to show a few nodes
		root.children.forEach(toggleAll)
		// huh?
		toggle(root.children[1])
		toggle(root.children[1].children[2])
		toggle(root.children[9])
		toggle(root.children[9].children[0])

		update(root)
	})

	function update(source){
		var duration = d3.event && d3.event.altKey ? 5000 : 500

		// compute the new tree layout
		var nodes = tree.nodes(root).reverse()

		// normalize for fixed depth
		nodes.forEach(function(d){
			d.y = d.depth * 180
		})

		// update the nodes
		var node = vis_group.selectAll('g.node')
			.data(nodes, function(d){
				return d.id || (d.id = ++i)
			})

		console.log(nodes)
	}

	// toggle children
	function toggle(d){
		if(d.children){
			d._children = d.children
			d.children = null
		} else {
			d.children = d._children
			d._children = null
		}
	}

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()