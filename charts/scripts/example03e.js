var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = width - margins.top - margins.bottom,
	vis, vis_group, aspect,
	radius = ((width - margins.left - margins.right) / 2) - 20

var backgroundColor = '#000',
	π = Math.PI

var colors = [
	{
		'stop': 0,
		'color': 'rgba(0,0,0,1)'
	},
	{
		'stop': .5,
		'color': 'rgba(0,0,0,1)'
	},
	{
		'stop': 1,
		'color': 'rgba(28,97,119,1)'
	}
]

var angles = [
	{
		'angle': 0
	},
	{
		'angle': 0
	},
	{
		'angle': 90
	},
	{
		'angle': 180
	},
	{
		'angle': 270
	}
]

var setSVG = function(){
	vis = d3.select('#example').append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})
		
	vis_group = vis.append('g')
		.attr({
			'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
		})

	aspect = chart_container.width() / chart_container.height()
};

var setDefs = function(){
	var defs = vis_group.append('defs')

	var radialGradient = defs.append('radialGradient')
		.attr({
			'id': 'radial'
		})

	radialGradient.selectAll('stop')
		.data(colors)
			.enter().append('stop')
		.attr({
			'offset': function(d){
				return d.stop
			},
		})
		.style({
			'stop-color': function(d){
				return d.color
			}
		})
};

(function(){
	setSVG()
	setDefs()

	vis_group.append('rect')
		.attr({
			'width': width,
			'height': height,
			'fill': backgroundColor
		})

	vis_group.append('circle')
		.attr({
			'cx': width / 2,
			'cy': height / 2,
			'r': radius,
			'fill': 'url(#radial)'
		})
		.style({
			'stroke': 'rgba(28,97,119,1)',
			'stroke-width': 2
		})

	vis_group.selectAll('circle')
		.data(angles)
			.enter().append('circle')
		.attr({
			'cx': width / 2,
			'cy': height / 2,
			'r': 8,
			'fill': backgroundColor,
			'transform': function(d) {
				console.log(d.angle)
				var x = Math.sin(d.angle * π/180) * radius
				var y = Math.cos(d.angle * π/180) * radius
				return 'translate(' + x +  ',' + y +  ')'
	        },
		})
		.style({
			'stroke': 'rgba(255,255,255,1)',
			'stroke-width': 1
		})
})()

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})