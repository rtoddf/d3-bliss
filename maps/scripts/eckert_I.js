// http://bl.ocks.org/mbostock/3734322

var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.6) - margins.top - margins.bottom,
	vis, vis_group, aspect

var projection = d3.geo.eckert1()
	.scale(160)
	.translate([ width/2, height/2 ])
	.precision(.1)

var path = d3.geo.path()
	.projection(projection)

var graticule = d3.geo.graticule()

vis = d3.select('#example').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

vis_group.append('defs').append('path')
	.datum({
		type: 'Sphere'
	})
	.attr({
		'd': path,
		'id': 'sphere'
	})

vis_group.append('use')
	.attr({
		'class': 'stroke',
		'xlink:href': '#sphere'
	})

vis_group.append('use')
	.attr({
		'class': 'water',
		'xlink:href': '#sphere'
	})

vis_group.append('path')
	.datum(graticule)
	.attr({
		'd': path,
		'class': 'graticule'
	})

d3.json('../data/world-50m.json', function(error, world){
	console.log(world)

	vis_group.append('path')
		.datum(topojson.feature(world, world.objects.land))
		.attr({
			'd': path,
			'class': 'land'
		})

	vis_group.append('path')
		.datum(topojson.mesh(world, world.objects.countries, function(a, b){ return a !== b }))
		.attr({
			'd': path,
			'class': 'boundary'
		})

})