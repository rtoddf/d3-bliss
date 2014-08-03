var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .8) - margins.top - margins.bottom,
	canvas, aspect

var projection  = d3.geo.orthographic()
	.scale(248)
	.clipAngle(90)

var canvas = d3.select('#example').append('canvas')
	.attr({
		'width': width,
		'height': height
	})

var c = canvas.node().getContext('2d')

var path = d3.geo.path()
	.projection(projection)
	.context(c)

var title = d3.select('h1')

queue()
	.defer(d3.json, '../../../data/world-110m.json')
	.defer(d3.tsv, '../../../data/world-country-names.tsv')
	.await(ready)

function ready(error, world, names){
	// console.log('world: ', world)
	// console.log('names: ', names)

	var globe = {
		'type': 'Sphere'
	},
	land = topojson.feature(world, world.objects.land),
	countries = topojson.feature(world, world.objects.countries).features,
	borders = topojson.mesh(world, world.objects.countries, function(a, b){
		return a !== b
	}),
	i = -1,
	n = countries.length

	countries = countries.filter(function(d){
		return names.some(function(n){
			if(d.id == n.id) return d.name = n.name
		})
	}).sort(function(a, b){
		return a.name.localeCompare(b.name)
	});

	// console.log(countries);

	(function transition(){
		d3.transition()
			.duration(1250)
			.each('start', function(){
				title.text(countries[i = (i + 1) % n].name)
			})
			.tween('rotate', function(){
				var p = d3.geo.centroid(countries[i]),
					r = d3.interpolate(projection.rotate(), [ -p[0], -p[1] ])

				return function(t){
					projection.rotate(r(t))
					c.clearRect(0, 0, width, height)
					c.fillStyle = '#bbb', c.beginPath(), path(land), c.fill()
					c.fillStyle = '#f00', c.beginPath(), path(countries[i]), c.fill()
					c.strokeStyle = '#fff', c.lineWidth = .5, c.beginPath(), path(borders), c.stroke()
					// c.strokeStyle = '#000', c.lineWidth = 2, c.beginPath(), path(globe), c.stroke()
				}
			})
			.transition()
				.each('end', transition)
	})()
}