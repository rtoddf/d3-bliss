var container_parent = $('.display') ,
	chart_container = $('#example'),
	width = container_parent.width(),
	height = (width * .8),
	vis, vis_group, aspect, centered, response

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
		'class': 'graticule'
	})