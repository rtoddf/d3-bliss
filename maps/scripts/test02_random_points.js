// https://www.jasondavies.com/maps/random-points/
// view-source:https://www.jasondavies.com/maps/random-points/

var n = 4e2,
	id = 0,
	width = 310,
	height = 310,
	graticule = d3.geo.graticule()
	
var rotate = {
		x: 0,
		y: 90
	}

var projection = d3.geo.orthographic()
	.translate([ width / 2, height / 2 ])
	.clipAngle(90)
	// .rotate([ rotate.x / 2, -rotate.y / 2 ])

var path = d3.geo.path()
	.projection(projection)
	.pointRadius(1.5)

var degrees = 180 / Math.PI,
	λ = d3.scale.linear().range([-180, 180]),
	φ = d3.scale.linear().range([-90, 90]),
	radius = projection([ 90, 0 ])[0] - projection([ 0, 0 ])[0]

var div = d3.selectAll('.sphere')
	.data([wrong(), uniform(), poisson(50)])

var svg = div.append('svg')
    .attr({
    	'width': width,
		'height': height
	})

// wrap the text around the spheres
// var dy = 20
// div.selectAll('div.wrap')
// 	.data(d3.range(height / dy))
// 		.enter().insert('div', ':first-child')
// 	.attr({
// 		'class': 'wrap'
// 	})
// 	.style({
// 		'width': function(d){
// 			var r = 10 + width / 2,
// 				y = width / 2 - d * dy
// 			return width / 2 + ~~Math.sqrt(r * r - y * y) + 'px'
// 		}
// 	})

svg.append('path')
	.datum(graticule)
	.attr({
		'd': path,
		'class': 'graticule'
	})

svg.append('circle')
	.datum(rotate)
	.attr({
		'class': 'mouse',
		'fill': 'none',
		'stroke': '#000',
		'stroke-width': 2,
		'transform': 'translate(' + [ width / 2, height / 2 ] + ')',
		'r': radius
	})

var point = svg.append('g')
	.style({
		'stroke': function(d, i){
			return ['red', 'green', 'blue'][i]
		},
		'fill': function(d, i){
			return ['red', 'green', 'blue'][i]
		}
	})
	.selectAll('path.point')

d3.timer(function(){
	point = point.data(function(random){
		return random()
	}, pointId)
	point
		.exit().remove()
	point
		.enter().append('path')
		.attr({
			'd': path,
			'class': 'point'
		})
})

function poisson(k) {
	var radius = 10,
		points = [],
		geometries = [],
		findClosest = finder(points, radius * 2)
  
	return function() {
		var best = null

		// Create k candidates, picking the best (furthest away)
		for (var i = 0; i < k; ++i) {
			var candidate = {
				x: λ(Math.random()), 
				y: 180 * Math.acos(Math.random() * 2 - 1) / Math.PI - 90
			}
		  findClosest(candidate)
		  if (!best || candidate.radius > best.radius) best = candidate
		}

		best.radius = 5
		points.push(best)
		geometries.push({
			type: 'Point',
			coordinates: [best.x, best.y], id: nextId()
		})
		if (geometries.length > n) geometries.shift(), points.shift()
		return geometries
	}
}

// Find the closest circle to the candidate.
function finder(points) {
	var arc = d3.geo.greatArc().target(Object)

	return function(candidate) {
		candidate.radius = Infinity
		arc.source([ candidate.x, candidate.y ])

		points.forEach(function(point) {
			var radius = Math.max(0, arc.distance([point.x, point.y]) * 180 / Math.PI - point.radius)
			if (radius < candidate.radius) candidate.radius = radius
		})
	}
}

function wrong() {
	var points = []
	return function() {
		points.push({
			type: 'Point',
			coordinates: [ λ(Math.random()), φ(Math.random()) ],
			id: nextId()
		})
		if (points.length > n) points.shift()
		return points
	}
}

function uniform() {
	var points = []
	return function() {
		points.push({
			type: 'Point',
			coordinates: [ 
				λ(Math.random()),
				Math.acos(2 * Math.random() - 1) * degrees - 90
			],
			id: nextId()
		})
		if (points.length > n) points.shift()
		return points
	}
}

function pointId(d){
	return d.id
}

// Just in case we overflow…
function nextId(){
	return id = ~~(id + 1)
}