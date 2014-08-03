var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.7) - margins.top - margins.bottom,
	vis, vis_group, aspect

var projection = d3.geo.albersUsa()
	.scale(850)
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
	console.log('topology: ', topology)

	vis_group.append('path')
		.datum(topojson.feature(topology, topology.objects.counties))
		.attr({
			'd': path,
			'class': 'land-boundary'
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.states, function(a, b) { 
			return a.id !== b.id
		}))
		.attr({
			'd': path,
			'class': 'state-boundary'
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})