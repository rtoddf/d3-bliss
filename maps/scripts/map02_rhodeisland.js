var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = width - margins.top - margins.bottom,
	vis, vis_group, aspect

var defaults = {
	counties: {
		fill: '#eee',
		over: 'orange',
		stroke: '#777',
		strokeWidth: 1
	}
}

var projection = d3.geo.conicConformal()
	.parallels([ 40 + 26 / 60, 41 + 42 / 60 ])
    .rotate([ 82 + 30 / 60, -39 - 40 / 60 ])
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

d3.json('../data/states/ri-counties.json', function(error, topology){
	console.log('topology: ', topology)
	var counties = topojson.feature(topology, topology.objects.counties)

	projection
		.scale(1)
		.translate([ 0, 0 ])

	var bounds = path.bounds(counties),
		// the decimal is the percentage
		// the Math.max finds the larger of the 2 dimensions
		scale = .95 / Math.max((bounds[1][0] - bounds[0][0]) / width, (bounds[1][1] - bounds[0][1]) / height),
		// the translate moves the state to the center of the svg
		translate = [(width - scale * (bounds[1][0] + bounds[0][0])) / 2, (height - scale * (bounds[1][1] + bounds[0][1])) / 2]

	projection
		.scale(scale)
		.translate(translate)

	vis_group.selectAll('path')
		.data(counties.features.filter(function(d){
			return d.id % 1000
		}))
			.enter().append('path')
		.attr({
			'class': 'county',
			'd': path,
			'fill': defaults.counties.fill,
			'stroke': defaults.counties.stroke,
			'stroke-width': defaults.counties.strokeWidth
		})
		.on('mouseover', function(){
			d3.select(this)
				.transition()
				.duration(500)
					.attr({
						'fill': defaults.counties.over
					})
		})
		.on('mouseout', function(){
			d3.select(this)
				.transition()
				.duration(500)
					.attr({
						'fill': defaults.counties.fill
					})
		})

	vis_group.selectAll('text')
		.data(counties.features.filter(function(d){
			return d.id % 1000
		}))
			.enter().append('text')
		.attr({
			'transform': function(d) {
				return 'translate(' + path.centroid(d) + ')'
			},
			'dy': '.35em',
			'text-anchor': 'middle',
			'font-weight': 'bold'
		})
		.text(function(d){
			return (d.properties.name).replace(' County', '')
		})
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})