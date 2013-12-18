var container_parent = $('.display') ,
	chart_container = $('#example'),
	width = container_parent.width(),
	height = (width * .8),
	vis, vis_group, aspect, centered, response

var defaults = {
	graticule: {
		fill: 'none',
		stroke: '#333',
		strokeWidth: .25
	},
	antimeridia: {
		fill: 'none',
		stroke: '#333',
		strokeWidth: 1.5,
		strokeDasharray: '5 5'
	},
	land: {
		fill: 'rgba(0,0,0,1)',
		opacity: .5,
		stroke: 'rgba(0,0,0,1)',
		strokeWidth: .75
	},
	bounds: {
		fill: 'rgba(0,50,100,1)',
		fillOpacity: .25,
		stroke: '#000',
		strokeWidth: 1
	}
}

var projection = d3.geo.orthographic()
	.translate([ width / 2, height / 2 ])
	.scale(250)
	.clipAngle(90)
	.precision(.1)
	.rotate([ 0, -30 ])

var path = d3.geo.path()
	.projection(projection)

var graticule = d3.geo.graticule()

vis = d3.select('#example').append('svg')
	.attr({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width) + ' ' + (height)
	})
	.call(d3.behavior.drag()
		.origin(function(){
			var rotate = projection.rotate()
			return {
				x: 2 * rotate[0],
				y: -2 * rotate[1]
			}
		})
		.on('drag', function(){
			projection.rotate([
				d3.event.x / 2,
				-d3.event.y / 2,
				projection.rotate()[2]
			])
			vis_group.selectAll('path')
				.attr({
					'd': path
				})
		})
	)

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

vis_group.append('path')
	.datum(graticule)
	.attr({
		'd': path,
		'fill': defaults.graticule.fill,
		'stroke': defaults.graticule.stroke,
		'stroke-width': defaults.graticule.strokeWidth
	})

vis_group.append('path')
	.datum({
		type: 'LineString',
		coordinates: [ [180, -90], [180, 0], [180, 90] ]
	})
	.attr({
		'd': path,
		'fill': defaults.antimeridia.fill,
		'stroke': defaults.antimeridia.stroke,
		'stroke-width': defaults.antimeridia.strokeWidth,
		'stroke-dasharray': defaults.antimeridia.strokeDasharray
	})

vis_group.append('path')
	.datum({
		type: 'Sphere'
	})
	.attr({
		'd': path,
		'fill': defaults.graticule.fill
	})

d3.json('../data/world-110m.json', function(error, world){
	var country = vis_group.selectAll('.country')
		.data(topojson.feature(world, world.objects.countries).features)
			.enter().append('g')
		.attr({

		})

	country.append('path')
		.attr({
			'd': path,
			'fill': defaults.land.fill,
			'opacity': defaults.land.opacity,
			'stroke': defaults.land.stroke,
			'stroke-width': defaults.land.strokeWidth,
			'class': 'land'
		})

	country.append('path')
		.datum(boundsPolygon(d3.geo.bounds))
		.attr({
			'd': path,
			'fill': defaults.bounds.fill,
			'fill-opacity': defaults.bounds.fillOpacity,
			'stroke': defaults.bounds.stroke,
			'stroke-width': defaults.bounds.strokeWidth,
			'class': 'bounds'
		})
})

function boundsPolygon(b){

	return function(geometry){
		console.log('geometry: ', geometry)
		var bounds = b(geometry)
		if(bounds[0][0] === -180 && bounds[0][1] === -90 && bounds[1][0] === 180 && bounds[1][1] === 90){
			return {
				type: 'Sphere'
			}
		}
		if (bounds[0][1] === -90) bounds[0][1] += 1e-6
		if (bounds[1][1] === 90) bounds[0][1] -= 1e-6
		if (bounds[0][1] === bounds[1][1]) bounds[1][1] += 1e-6

		return {
			type: 'Polygon',
			coordinates: [
				[bounds[0]]
					.concat(parallel(bounds[1][1], bounds[0][0], bounds[1][0]))
					.concat(parallel(bounds[0][1], bounds[0][0], bounds[1][0]).reverse())
			]
		}
	}
}

function parallel(Φ, λ0, λ1){
	// console.log('Φ: ', Φ)
	if (λ0 > λ1) λ1 += 360
	var dλ = λ1 - λ0,
		step = dλ / Math.ceil(dλ)
	return d3.range(λ0, λ1 + .5 * step, step)
		.map(function(λ){
			return [ normalise(λ), Φ ]
		})
}

function normalise(x){
	return (x + 180) % 360 - 180
}