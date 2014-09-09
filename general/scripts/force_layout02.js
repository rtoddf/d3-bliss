var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .5) - margins.top - margins.bottom,
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

vis.append('defs').selectAll('marker')
	.data([ 'suit', 'licensing', 'resolved' ])
		.enter().append('marker')
	.attr({
		'id': String,
		'viewBox': '0 -5 10 10',
		'refX': 15,
		'refY': -1.5,
		'markerWidth': 6,
		'markerHeight': 6,
		'orient': 'auto'
	})
	.append('path')
		.attr({
			'd': 'M0,-5 L10,0 L0,5'
		})	

d3.json('../data/patent_suits.json', function(error, links){
	var nodes = {}

	links.forEach(function(link){
		link.source = nodes[link.source] || (nodes[link.source] = {name: link.source})
		link.target = nodes[link.target] || (nodes[link.target] = {name: link.target})
	})

	var force = d3.layout.force()
		.nodes(d3.values(nodes))
		.links(links)
		.size([ width, height ])
		.linkDistance(60)
		.charge(-300)
		.on('tick', tick)
		.start()

	var path = vis_group.append('g').selectAll('path')
		.data(force.links())
			.enter().append('path')
		.attr({
			'class': function(d){
				return 'link ' + d.type
			},
			'marker-end': function(d){
				return 'url(#' + d.type + ')'
			}
		})
		.attr({
			'fill': 'none',
			'stroke-width': '1.5px',
			'stroke': '#666'
		})

	var circle = vis_group.append('g').selectAll('circle')
		.data(force.nodes())
			.enter().append('circle')
		.attr({
			'r': 6,
			'fill': '#ccc',
			'stroke-width': '1.5px',
			'stroke': '#333'
		})
		.call(force.drag)

	var text = vis_group.append('g').selectAll('g')
		.data(force.nodes())
			.enter().append('g')

	text.append('text')
		.attr({
			'x': 8,
			'y': '.31em',
			'class': 'shadow'
		})
		.text(function(d){
			return d.name
		})

	text.append('text')
		.attr({
			'x': 8,
			'y': '.31em'
		})
		.text(function(d){
			return d.name
		})

	// Use elliptical arc path segments to doubly-encode directionality.
	function tick() {
		path.attr('d', function(d) {
			var dx = d.target.x - d.source.x,
				dy = d.target.y - d.source.y,
				dr = Math.sqrt(dx * dx + dy * dy)
			return 'M' + d.source.x + ',' + d.source.y + 'A' + dr + ',' + dr + ' 0 0,1 ' + d.target.x + ',' + d.target.y
		});

		circle.attr('transform', function(d) {
			return 'translate(' + d.x + ',' + d.y + ')'
		});

		text.attr('transform', function(d) {
			return 'translate(' + d.x + ',' + d.y + ')'
		})
	}


})