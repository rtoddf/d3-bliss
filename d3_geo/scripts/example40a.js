var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .7) - margins.top - margins.bottom,
	vis, vis_group, aspect

var defaults = {
	land: {
		fill: 'rgba(186,186,113,1)',
		stroke: 'rgba(0,0,0,.5)'
	},
	counties: {
		fill: 'rgba(186,186,113,1)',
		stroke: 'rgba(102,102,102,1)',
		strokeWidth: .5
	},
	states: {
		fill: 'none',
		stroke: 'rgba(0,0,0,.5)',
		strokeWidth: .5
	}
}

// .center(defaults.land.fill)

var projection = d3.geo.albersUsa()
	.scale(width)
	.translate([ width / 2, height / 2 ])

var path = d3.geo.path()
	.projection(projection)

vis = d3.select('#example').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

d3.json('../../../data/us.json', function(error, topology){
	vis_group.append('path')
		.datum(topojson.feature(topology, topology.objects.land))
		.attr({
			'd': path,
			'fill': defaults.land.fill,
			'stroke': defaults.land.stroke
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.counties, function(a, b){
			return a !== b && !(a.id / 1000 ^ b.id / 1000)
		}))
		.attr({
			'd': path,
			'fill': defaults.counties.fill,
			'stroke': defaults.counties.stroke,
			'stroke-width': defaults.counties.strokeWidth
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.states, function(a, b){
			return a !== b
		}))
		.attr({
			'd': path,
			'fill': defaults.states.fill,
			'stroke': defaults.states.stroke
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})