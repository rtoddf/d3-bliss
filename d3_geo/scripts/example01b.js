var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.7) - margins.top - margins.bottom,
	vis, vis_group, aspect

var defaults = {
	graticule: {
		fill: 'none',
		stroke: 'rgba(102,102,102,1)',
		strokeWidth: .5
	},
	states: {
		fill: 'rgba(235,182,52,1)',
		stroke: 'rgba(102,102,102,1)',
		strokeWidth: 1
	},
	counties: {
		fill: 'none',
		stroke: 'rgba(255,255,255,1)',
		strokeWidth: .5
	}
}

var projection = d3.geo.conicEqualArea()
	.scale(2500)
	.rotate([ 100, 0 ])
	.center([ 2, 31.5 ])
	.parallels([ 30, 65 ])

var path = d3.geo.path()
	.projection(projection)

var graticule = d3.geo.graticule()
	.step([ 1, 1 ])

vis = d3.select('#example').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')

d3.json('../../../data/us.json', function(error, topology){
	console.log('topology: ', topology)

	var state = topology.objects.states.geometries.filter(function(d){
		return d.id === 48
	})[0],
		counties = topology.objects.counties.geometries.filter(function(d){
			return d.id / 1000 | 0 === 48
		})

	vis_group.append('path')
		.datum(graticule)
		.attr({
			'd': path,
			'fill': defaults.graticule.fill,
			'stroke': defaults.graticule.stroke,
			'stroke-width': defaults.graticule.strokeWidth
		})

	vis_group.append('path')
		.datum(topojson.feature(topology, state))
		.attr({
			'd': path,
			'fill': defaults.states.fill,
			'stroke': defaults.states.stroke,
			'stroke-width': defaults.states.strokeWidth
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, {
			type: 'GeometryCollection',
			geometries: counties
		}))
		.attr({
			'd': path,
			'fill': defaults.counties.fill,
			'stroke': defaults.counties.stroke,
			'stroke-width': defaults.counties.strokeWidth
		})

	console.log('state: ', state)
})