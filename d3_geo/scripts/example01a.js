var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.7) - margins.top - margins.bottom,
	vis, vis_group, aspect

$(function(){
    rtodd.henka({
        'max' : 640
        }).on(function(){
        	console.log(640)
            // $('body').addClass('sh-mobile');
        }).off(function(){
        	console.log('not 640')
            // $('body').removeClass('sh-mobile');
        }).update(true);
})

var defaults = {
	states: {
		fill: 'rgba(102,122,137,1)',
		stroke: 'rgba(0,0,0,.5)',
		strokeWidth: .5
	},
	counties: {
		fill: 'none',
		stroke: 'rgba(255,255,255,1)',
		strokeWidth: .5
	},
	graticule: {
		fill: 'none',
		stroke: '#777',
		strokeWidth: .5,
		opacity: .5
	}
}

var projection = d3.geo.conicEqualArea()
	.scale(5400)
	.rotate([ 80, 0 ])
	.center([ 6, 43 ])
	.parallels([ 55, 65 ])
	// .clipExtent([[-1, -1], [width + 1, height + 1]])

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
aspect = chart_container.width() / chart_container.height()

d3.json('../../../data/us.json', function(error, topology){
	var state = topology.objects.states.geometries.filter(function(d){
		return d.id === 36
	})[0],
		counties = topology.objects.counties.geometries.filter(function(d){
			return d.id / 1000 | 0 === 36
		})
		
	vis_group.append('path')
		.datum(graticule)
		.attr({
			'd': path,
			'fill': defaults.graticule.fill,
			'stroke': defaults.graticule.stroke,
			'stroke-width': defaults.graticule.strokeWidth,
			'stroke-opacity': defaults.graticule.opacity
		})

	vis_group.append('path')
		.datum(topojson.feature(topology, state))
			.attr({
				'd': path,
				'fill': defaults.states.fill
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
})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})