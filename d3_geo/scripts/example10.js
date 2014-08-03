var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .6) - margins.top - margins.bottom,
	vis, vis_group, aspect

var defaults = {
	countries: {
		fill: 'rgba(102,102,102,.5)',
		stroke: 'rgba(255,255,255,1)',
		strokeWidth: .5
	}
}

var projection = d3.geo.mercator()
	.scale((width + 1) / 2 / Math.PI)
	.translate([ width / 2, height / 2 ])
	.precision(.1)

var path = d3.geo.path()
	.projection(projection)

var graticule = d3.geo.graticule()

var places = {
	HNL: [ -157, 21 ],
	HKG: [ 113, 22 ],
	SVO: [ 37, 55 ],
	HAV: [ -82, 22 ],
	CCS: [ -66, 10 ],
	UIO: [ -78, 0 ]
}

var route = {
	type: "LineString",
	coordinates: [
		places.HNL,
		places.HKG,
		places.SVO,
		places.HAV,
		places.CCS,
		places.UIO
	]
}

vis = d3.select('#example').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

vis_group.append('path')
	.datum(graticule)
	.attr({
		'd': path,
		'class': 'graticule'
	})

queue()
	.defer(d3.json, '../../../data/world-110m.json')
	.defer(d3.csv, '../../../data/cities02.csv')
	.await(ready)

function ready(error, topology, cities){
	console.log('cities: ', cities)
	vis_group.append('path')
		.datum(topojson.feature(topology, topology.objects.land))
		.attr({
			'd': path,
			'fill': defaults.countries.fill,
			'stroke': defaults.countries.stroke,
			'stroke-width': 1
		})

	vis_group.append('path')
		.datum(topojson.mesh(topology, topology.objects.countries, function(a, b) { 
			return a !== b
		}))
		.attr({
			'd': path,
			'fill': 'none',
			'stroke': defaults.countries.stroke,
			'stroke-width': defaults.countries.strokeWidth
		})

	vis_group.append('path')
		.datum(route)
		.attr({
			'd': path,
			'class': 'route'
		})


	var point = vis_group.append('g')
		.attr({
			'class': 'points'
		})
		.selectAll('g')
			.data(d3.entries(places))
				.enter().append('g')
			.attr({
				'transform': function(d){
					console.log('d: ', d)
					return 'translate(' + projection(d.value) + ')'
				}
			})

	point.append('circle')
		.attr({
			'r': 5
		})

	point.append('text')
		.attr({
			'y': 10,
			'dy': '.71em'
		})
		.text(function(d){
			return d.key
		})

}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})






















