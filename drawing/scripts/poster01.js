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
	orange = 'rgba(251,176,59,1)',
	orange_dark	 = 'rgba(247,147,30,1)',
	red = 'rgba(193,39,45,1)',
	white = 'rgba(255,255,255,1)'
	white_50 = 'rgba(255,255,255,.5)'


var image_plane = 'images/plane.svg',
	image_plane_width = 800,
	image_plane_height = 301

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
		'line': 'There is so much that',
		'xPos': 458,
		'yPos': 650
	},
	{
		'line': 'must be done in a civilized',
		'xPos': 564,
		'yPos': 700
	},
	{
		'line': 'barbarism like war',
		'xPos': 411,
		'yPos': 750
	}
]

// DEFS & FILTERS
var defs = vis
	.append('defs')

setGradient(orange, black)

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
vis
	.append('rect')
		.attr({
			'width': width,
			'height': height,
			'fill': black
		})

// STRIPES
vis
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

vis
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
var globe = vis
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

// BIG STAR
globe
	.append('polygon')
		.attr({
			'id': 'bigstar',
			'points': CalculateStarPoints(arcCx, arcCy, 5, 70),
			'fill': black,
			'opacity': .3,
			'transform': 'rotate(-18,' + arcCx + ',' + arcCy + ')'
		})
// END BIG STAR

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

var lines = vis
	.append('g')
	.selectAll('line')
		.data(lineAngles)
		// .data(d3.range(-4, 5))
  	.enter().append('line')
		.attr({
			'x1': function(d, i){
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

// STARS
var starSpecs = {
  sides: 5,
  innerRadius: 12,
  fill: orange_dark,
  strokeColor: red,
  strokeWidth: 3
}

var starGroupSpecs = {
	num: 16,
	cx: arcCx,
	cy: arcCy,
  radius: 220
}

var starAngle = (Math.PI * 2) / starGroupSpecs.num

var stars = d3.select('#arcs')
	.append('g')
		.attr({
			'id': 'stars',
			'transform-origin': arcCx + ' ' + arcCy
		})
		.selectAll('polygon')
		.data(d3.range(0, starGroupSpecs.num))
  .enter().append('polygon')
	  .attr({
	  	'id': function(d, i){
	  		return 'star_' + i
	  	},
	  	'points': function(d, i){
	  		var starX = (starGroupSpecs.radius * Math.cos(i * starAngle)) + starGroupSpecs.cx
	  		var starY = (starGroupSpecs.radius * Math.sin(i * starAngle)) + starGroupSpecs.cy
	  		return CalculateStarPoints(starX, starY, starSpecs.sides, starSpecs.innerRadius)
	  	},
	  	'fill': starSpecs.fill,
	  	'stroke': starSpecs.strokeColor,
	  	'stroke-width': starSpecs.strokeWidth
	  })
// END STARS

// ANIMATIONS
var duration  = 8000

// PLANE
var planeGroup = vis
	.append('g')
		.attr({
			'id': 'plane',
			'transform': 'translate(-150, -170) scale(1.5)'
		})
	.append('image')
		.attr({
			'xlink:href': image_plane,
			'width': image_plane_width,
			'height': image_plane_height,
			'x': function(){
				return arcCx - image_plane_width /2
			},
			'y': function(){
				return arcCy - image_plane_height / 2
			}
		})
// END PLANE

// CITYSCAPE
var cityscape = vis
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

vis
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

// QUOTE
vis
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