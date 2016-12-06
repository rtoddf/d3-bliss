// https://github.com/mbostock/d3/wiki/Geo-Projections

var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .5) - margins.top - margins.bottom,
	vis, vis_group, aspect

var projection = d3.geo.azimuthalEqualArea()
	.clipAngle(180 - 1e-3)
	.scale(125)
	.translate([ width / 2, height / 2 ])
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

vis_group.append('defs')
	.append('path')
		.datum({
			type: 'Sphere'
		})
		.attr({
			'id': 'sphere',
			'd': path
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
		'class': 'graticule',
		'd': path
	})

d3.json('../data/world-50m.json', function(error, topology){
	console.log('topology: ', topology)

	vis_group.append('path')
		.datum(topojson.feature(topology, topology.objects.land))
		.attr({
			'class': 'land',
			'd': path
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.countries), function(a, b){
			return a !== b
		})
		.attr({
			'class': 'boundary',
			'd': path
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})