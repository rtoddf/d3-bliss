var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .8) - margins.top - margins.bottom,
	canvas, aspect,
	speed = 1e-2,
	start = Date.now()

var sphere = {
	type: 'Sphere'
}

var projection = d3.geo.orthographic()
	.scale(height / 2)
	.translate([ (width + margins.left) / 2, (height - margins.top) / 2 ])
	.clipAngle(90)
	.precision(.5)

var graticule = d3.geo.graticule()

canvas = d3.select('#example').append('canvas')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height
	})

var aspect = chart_container.width() / chart_container.height()

var context = canvas.node().getContext('2d')

var path = d3.geo.path()
	.projection(projection)
	.context(context)

d3.json('../../../data/world-110m.json', function(error, topo){
	console.log('topo: ', topo)

	var land = topojson.feature(topo, topo.objects.land),
		borders = topojson.mesh(topo, topo.objects.countries, function(a, b){
			return a !== b
		}),
		grid = graticule()

	d3.timer(function(){
		projection.rotate([ speed * (Date.now() - start), -15 ])

		context.clearRect(0, 0, width, height)

		// context.beginPath()
		// path(sphere)
		// context.lineWidth = 3
		// context.strokeStyle = '#000'
		// context.stroke()

		context.beginPath()
		path(sphere)
		context.fillStyle = 'rgba(87,146,174,.5)'
		context.fill()

		context.beginPath()
		path(land)
		context.fillStyle = 'rgba(0,113,50,1)'
		context.fill()

		context.beginPath()
		path(borders)
		context.lineWidth = 1
		context.strokeStyle = 'rgba(255,255,255,.5)'
		context.stroke()

		context.beginPath()
		path(grid)
		context.lineWidth = .5
		context.strokeStyle = 'rgba(119,119,119,.5)'
		context.stroke()
	})

	d3.select(self.frameElement).style('height', height + 'px')
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	console.log('yo: ', targetWidth)
	canvas.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})