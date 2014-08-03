var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	// width = container_parent.width() - margins.left - margins.right,
	// height = width * .5 - margins.top - margins.bottom,
	div, vis, vis_group

var width = 300,
	height = 300,
	translate = [ width/2, height/2 ]

var projections = [
	{
		name: 'azimuthalEqualArea',
		fn: d3.geo.azimuthalEqualArea()
			.scale(50)
			.translate(translate)
	},
	{
		name: 'equirectangular',
		fn: d3.geo.equirectangular()
			.scale(50)
			.translate(translate)
	},
	{
		name: 'mercator',
		fn: d3.geo.mercator()
			.scale(50)
			.translate(translate)
	},
	{
		name: 'conicEquidistant',
		fn: d3.geo.conicEquidistant()
			.scale(35)
			.translate(translate)
	},
	{
		name: 'orthographic',
		fn: d3.geo.orthographic()
			.scale(90)
			.translate(translate)
	},
	{
		name: 'stereographic',
		fn: d3.geo.stereographic()
			.scale(50)
			.translate(translate)
	}
]

d3.json('../../../data/world-110m.json', function(error, world){
	console.log(world)

	projections.forEach(function(projection){
		var path = d3.geo.path()
			.projection(projection.fn)

		div = d3.select('#example').append('div')
			.attr({
				'class': 'map'
			})

		vis = div.append('svg')
			.attr({
				'width': width + margins.left + margins.right,
				'height': height + margins.top + margins.bottom,
				'preserveAspectRatio': 'xMinYMid',
				'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
			})

		vis.append('path')
			.datum(topojson.feature(world, world.objects.land))
			.attr({
				'd': path
			})

		vis.append('path')
			.datum(topojson.feature(world, world.objects.countries))
			.attr({
				'd': path
			})

		div.append('h3')
			.text(projection.name)
	})

	

	// vis_group = vis.apend('g')


})