var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = width - margins.top - margins.bottom,
	vis, vis_group, aspect,
	translate = [ width / 2, height / 2 ]

var color = d3.scale.category20c(),
	water_fill = 'rgba(87,146,174,.5)',
	no_fill = 'none',
	stroke = '#333',
	stroke_width = .5,
	stroke_opacity = .5

var projection = d3.geo.orthographic()
	.scale(255)
	.rotate([-270, 0])
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
		'fill': no_fill,
		'stroke': stroke,
		'stroke-width': stroke_width,
		'stroke-opacity': stroke_opacity
	})

d3.json('../../../data/world-50m.json', function(error, topology){
	console.log('topology: ', topology)

	var countries = topojson.feature(topology, topology.objects.countries).features,
		neighbors = topojson.neighbors(topology.objects.countries.geometries)

	// console.log('countries: ', countries)
	// console.log('neighbors: ', neighbors)

	vis_group.selectAll('path')
		.data(countries)
			.enter().append('path')
		.attr({
			'd': path,
			'fill': function(d, i){
				// console.log('d: ', d)
				return color(d.color = d3.max(neighbors[i], function(n){
					return countries[n].color
				}) + 1 | 0)
			}
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.countries), function(a, b){
			return a !== b
		})
		.attr({
			'd': path,
			'stroke': stroke,
			'stroke-width': stroke_width,
			'fill': no_fill
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})