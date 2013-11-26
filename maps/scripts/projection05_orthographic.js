var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = width - margins.top - margins.bottom,
	vis, vis_group, aspect,
	translate = [ width / 2, height / 2 ]

var color = d3.scale.category10(),
	water_fill = 'rgba(87,146,174,1)',
	land_fill = 'rgba(184,170,156,1)',
	country_fill = 'none',
	stroke = '#666',
	stroke_width = .5,
	stroke_opacity = .5

var projection = d3.geo.orthographic()
	.scale(255)
	.translate(translate)
	.clipAngle(90)
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

vis_group
	.append('defs')
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
		'xlink:href': '#sphere',
		'fill': water_fill
	})

vis_group.append('path')
	.datum(graticule)
	.attr({
		'd': path,
		'fill': country_fill,
		'stroke': stroke,
		'stroke-width': stroke_width,
		'stroke-opacity': stroke_opacity
	})

d3.json('../data/world-50m.json', function(error, topology){
	console.log(topology)

	vis_group.append('path')
		.datum(topojson.feature(topology, topology.objects.land))
		.attr({
			'd': path,
			'fill': land_fill
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.countries), function(a, b){
			return a !== b
		})
		.attr({
			'd': path,
			'stroke': stroke,
			'stroke-width': stroke_width,
			'fill': country_fill
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})