var container_parent = $('.display') ,
	chart_container = $('#poster'),
	width = 600,
	height = width + 200,
	vis, vis_group, aspect,
	padding = 15

var pi = Math.PI

vis = d3.select('#poster ')
	.append('svg')
		.attr({
			'width': width,
			'height': height,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + width + ' ' + height
		})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

// COLORS
var black = 'rgba(0,0,0,1)',
	green = 'rgba(0,146,69,1)',
	white = 'rgba(255,255,255,1)'
	white_50 = 'rgba(255,255,255,.5)'

var stripeWidth = 105
var globe_r = 180

var arcSpecs = {},
	arcRadius = 280,
	arcCx = width/2,
	arcCy = ((height - arcRadius) * .6)

var city = [{
	'path': 'M 0,149 0,130 6,130 6,78 20,78 20,133 27,133 27,90 52,90 52,132 58,132 58,101 65,101 65,50 80,50 80,101 90,101 90,78 115,78 115,132 126,132 126,47 134,47 134,31 155,31 155,47 164,47 164,30 172,30 172,47 180,47 180,132 194,132 194,78 205,78 205,30 233,30 233,78 244,78 244,50 252,50 252,78 260,78 260,15 275,15 275,78 295,78 295,132 305,132 305,67 311,67 311,54 327,54 327,38 339,38 339,51 343,51 343,65 355,65 355,131 360,131 360,22 373,22 373,6 390,6 390,22 405,22 405,131 411,131 411,14 435,14 435,131 440,131 440,42 450,42 450,0 462,0 462,42 469,42 469,25 496,25 496,42 504,42 504,7 515,7 515,42 530,42 530,131 540,131 540,87 555,87 555,131 580,131 580,65 593,65 593,131 600,131 600,149 Z',
	'fill': 'url(#vertical_gradient)',
	'opacity': .7,
	'opacity_reflection': .3
}]

var quote = [
	{
		'line': 'The optimist thinks this is the',
		'xPos': 558,
		'yPos': 650
	},
	{
		'line': 'best of all possible worlds.',
		'xPos': 525,
		'yPos': 700
	},
	{
		'line': 'The pessimist fears it is true',
		'xPos': 538,
		'yPos': 750
	}
]

// DEFS & FILTERS
var defs = vis_group
	.append('defs')

setGradient(green, black)

var filter = vis_group
	.append('filter')
		.attr({
			'id': 'offset'
		})

filter
	.append('feOffset')
		.attr({
			'in': 'SourceAlpha',
			'dx': 4,
			'dy': 4,
			'result': 'offset'
		})

var feMerge = filter
	.append('feMerge')

feMerge
	.append('feMergeNode')
		.attr({
			'in': 'offset'
		})

feMerge
	.append('feMergeNode')
		.attr({
			'in': 'SourceGraphic'
		})
// END DEFS & FILTERS

// BACKGROUND
vis_group
	.append('rect')
		.attr({
			'width': width,
			'height': height,
			'fill': black
		})

// STRIPES
vis_group
	.append('g')
		.selectAll('rect')
		.data(d3.range(0, 5))
	.enter().append('rect')
		.attr({
			'width': stripeWidth,
			'height': height,
			'x': function(d){
				if (d < 2){
					return (d * stripeWidth) + (d * padding) + padding
				} else if (d > 2) {
					return (d * stripeWidth) + (d * padding)
				} else {
					return -stripeWidth
				}
			},
			'fill': 'url(#vertical_gradient)'
		})
// END STRIPES

var arc = d3.svg.arc()
    .innerRadius(arcRadius)
    .outerRadius(180)
    .startAngle(0 * (pi/360)) //converting from degs to radians
    .endAngle(7) //just radians

vis_group
	.append('g')
		.attr({
			'id': 'arcs'
		})
		.append('path')
		    .attr({
		    	'd': arc,
		    	'fill': white_50,
		    	'transform': 'translate(' + arcCx + ', ' + arcCy + ')'
		    })

d3.select('#arcs')
	.append('circle')
		.attr({
			'cx': arcCx,
			'cy': arcCy,
			'r': arcRadius - 15,
			'fill': 'none',
			'stroke': black,
			'stroke-width': 6
		})

// GLOBE
var globe = vis_group
	.append('g')
		.attr({
			'id': 'globe'
		})

globe
	.append('circle')
		.attr({
			'cx': arcCx,
			'cy': arcCy,
			'r': globe_r,
			'fill': 'url(#radial)'
		})
// END GLOBE

globe
	.append('circle')
		.attr({
			'cx': arcCx,
			'cy': arcCy,
			'r': globe_r,
			'fill': 'none',
			'stroke': black,
			'stroke-width': 2
		})

globe.selectAll('ellipse')
		.data(d3.range(0,6))
	.enter().append('ellipse')
		.attr({
			'cx': arcCx,
			'cy': arcCy,
			'rx': function(d, i){
				if(i > 0){ return i * 35 }
			},
			'ry': 180,
			'stroke': black,
			'fill': 'none'
		})
// END GLOBE

// LINES
var lineAngles = [
	{
		'angle1': -40,
		'angle2': -140
	},
	{
		'angle1': -20,
		'angle2': -160
	},
	{
		'angle1': 0,
		'angle2': 180
	},
	{
		'angle1': 20,
		'angle2': 160
	},
	{
		'angle1': 40,
		'angle2': 140
	},
	{
		'angle1': 90,
		'angle2': 270
	}
]

var lines = vis_group
	.append('g')
	.selectAll('line')
		.data(lineAngles)
		// .data(d3.range(-4, 5))
  	.enter().append('line')
		.attr({
			'x1': function(d, i){
				// console.log('d: ', d * 15)
				// console.log('d2: ', (d * 15) - 60)
				return CalculateCirclePoints(d.angle1, 180, arcCx, arcCy, 0)
			},
			'y1': function(d){
				return CalculateCirclePoints(d.angle1, 180, arcCx, arcCy, 1)
			},
			'x2': function(d){
				return CalculateCirclePoints(d.angle2, 180, arcCx, arcCy, 0)
			},
			'y2': function(d){
				return CalculateCirclePoints(d.angle2, 180, arcCx, arcCy, 1)
			},
			'stroke': black,
			'stroke-width': 1
		})

function CalculateCirclePoints(degrees, r, centerX, centerY, coord) {
	var results = []
	var radians = degrees * (Math.PI/180)
	results.push(centerX + Math.cos(radians) * r)
	results.push(centerY + Math.sin(radians) * r)
	return results[coord]
}
// END LINES

vis_group
	.append('circle')
	.attr({
		'cx': arcCx,
		'cy': arcCy,
		'r': 85,
		'fill': white
	})
	.style({
      'filter': 'url(#blur)'
    })

vis_group
	.append('circle')
	.attr({
		'cx': arcCx,
		'cy': arcCy,
		'r': 75,
		'fill': 'url(#radial_offset)'
	})

// CITYSCAPE
var cityscape = vis_group
	.append('g')
		.attr({
			'transform': 'translate(0, ' + 600 + ')'
		})
		.selectAll('path')
		.data(city)
	.enter().append('path')
		.attr({
			'd': function(d){ return d.path },
			'fill': function(d){ return d.fill },
			'opacity': function(d){ return d.opacity }
		})

vis_group
	.append('g')
		.selectAll('path')
		.data(city)
	.enter().append('path')
		.attr({
			'd': function(d){ return d.path },
			'fill': function(d){ return d.fill },
			'opacity': function(d){ return d.opacity_reflection },
			'transform': 'translate(0, ' + 790 + ') scale(1,-.35)'
		})
// END CITYSCAPE

// SNOWFLAKES
// vis
// 	.append('circle')
// 	.attr({
// 		'cx': 50,
// 		'cy': 50,
// 		'r': 15,
// 		'fill': white
// 	})
// 	.style({
//       'filter': 'url(#snow_flake)'
//     })
// END SNOWFLAKES

// QUOTE
vis_group
	.append('g')
		.selectAll('text')
		.data(quote)
	.enter().append('text')
		.text(function(d){
			return d.line
		})
		.attr({
			'class': 'quote',
			'x': function(d, i){
				var _this = d3.select(this)
				return (width / 2) - (d.xPos / 2)
			},
			'y': function(d, i){
				return d.yPos
			},
			'fill': white
		})
		.style({
			'filter': 'url(#offset)'
		})
// END QUOTE

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})