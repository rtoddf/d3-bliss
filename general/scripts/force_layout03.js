// http://www.d3noob.org/2013/03/d3js-force-directed-graph-example-basic.html

var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = (width *.5) - margins.top - margins.bottom,
		vis, vis_group, aspect

	vis = d3.select('#example').append('svg')
		.attr({
			'width': width,
			'height': height,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})

	vis_group = vis.append('g')
		.attr({
	        'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	    })

	aspect = chart_container.width() / chart_container.height()

d3.csv('../data/example40.csv', function(error, links) {
	var nodes = {}

	// This block of code looks through all of out data from our csv file and
	// for each link adds it as a node if it hasn't seen it before.
	links.forEach(function(link) {
	    link.source = nodes[link.source] || (nodes[link.source] = {name: link.source})
	    link.target = nodes[link.target] || (nodes[link.target] = {name: link.target})
	    link.value = +link.value
	})

	var force = d3.layout.force()
		.nodes(d3.values(nodes))
		.links(links)
		.size([ width, height ])
		.linkDistance(100)
		.charge(-300)
		.on('tick', tick)
		.start()

	vis_group.append('defs').selectAll('marker')
		.data(['end'])
			.enter().append('marker')
		.attr({
			'id': String,
			'viewBox': '0 -5 10 10',
			'refX': 30,
			'refY': 0,
			'markerWidth': 6,
			'markrtHeight': 6,
			'orient': 'auto'
		})
		.append('path')
			.attr({
				'd': 'M0,-5L10,0L0,5'
			})

	var path = vis_group.append('g').selectAll('path')
		.data(force.links())
			.enter().append('path')
		.attr({
			'class': 'link',
			'marker-end': 'url(#end)'
		})

	var node = vis_group.selectAll('.node')
		.data(force.nodes())
			.enter().append('g')
		.attr({
			'class': 'node'
		})
		.call(force.drag)

	node.append('circle')
		.attr({
			'r': 5
		})

	node.append('text')
		.attr({
			'x': 12,
			'dy': '.35em'
		})
		.text(function(d){
			return d.name
		})

	function tick(){
		path.attr('d', function(d){
			var dx = d.target.x - d.source.x,
				dy = d.target.y - d.source.y,
				dr = Math.sqrt(dx * dx * dy * dy)

			return 'M' + 
				d.source.x + ',' +
				d.source.y + "A" + 
				dr + "," + dr + " 0 0,1 " + 
				d.target.x + "," + 
				d.target.y
		})

		node
			.attr({
				'transform': function(d){
					return 'translate(' + d.x + ', ' + d.y + ')'
				}
			})
	}

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})