// http://anilomanwar.github.io/RedialLine/Redial%20Line.html
// http://anilomanwar.github.io/d3jsExperiments/ChartWheel.html
// http://bl.ocks.org/mccannf/1629644
// http://boyfails.me/basil/giantbomb.html

var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.66) - margins.top - margins.bottom,
	vis, vis_group, aspect

var name = 'Music',
	color = '#ae0000',
	dcolor = '#444'

// baseRad is the vertical spacing
var baseRaduis,
	// vertical spacing
	cgap,
	// how far around
	maxVal,
	rad,
	cx1 = width / 2,
	cy1 = height / 2,
	radius = 4,
	twoπ = 2 * Math.PI

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

queue()
	.defer(d3.json, 'data/example03d.json')
	.await(ready)

function ready(error, data){
	baseRadius = (height / 4) / data.length
	cgap = (height / 2) / data.length

	maxVal = d3.max(data, function(d){
		return parseInt(d.count) * 1.25
	})

	console.log(data.length)
	console.log('maxVal: ', maxVal)

	rad = baseRadius

	vis_group.selectAll('path')
		.data(data)
			.enter().append('path')
		.each(drawRing)

	rad = baseRadius

	vis_group.selectAll('circle')
		.data(data)
			.enter().append('circle')
		.each(drawCircle)
		 
	var txtxas = vis_group.selectAll('text')
		.data(data)
			.enter().append('text')
		.attr({
			'transform': function(d, i) {
				console.log('translate(' + (cx1 - 3) + ',' + (data.length * (cgap - 2) - ((cgap) * i)) + ')')
				return 'translate(' + (cx1 - 3) + ',' + (data.length * (cgap - 2) - ((cgap) * i)) + ')'
			},
			'text-anchor': 'end'
		})
		.style({
			'font-size': (data.length * 1.5) + 'px',
			'font-family': 'calibri',
			'fill': dcolor
		})
		.text(function(d, i) {
			return truncate(d.term, 31)
		})

	txtxas.append('title')
		.text(function(d) {
			return d.term + ' (' + d.count + ')'
		})
		   
	// vis_group.append('text')
	// 	.attr({
	// 		'transform': function(d, i){ 
	// 			return 'translate(' + (cx1 - 30) + ',' + (cy1 + 8) + ')'
	// 		}
	// 	})
	// 	.style({
	// 		'font-size': '26px',
	// 		'fill': dcolor,
	// 		'font-family': 'Iceland'
	// 	})
	// 	.text(name)
}

var someNum = -(height / 2)

function drawRing(d) {
	var ratio = d.count/maxVal

	var arc = d3.svg.arc()
		.startAngle(0)
		.innerRadius(someNum + cgap * rad)
		.outerRadius(someNum + cgap * rad + 1)
		.endAngle(twoπ * ratio)
   
	d3.select(this)
		.attr({
			'transform': 'translate(' + cx1 + ', ' + cy1 + ')',
			'd': arc,
			'fill': color
		})

	rad++
}

function drawCircle(d) {
	var ratio = d.count/maxVal;

	d3.select(this)
		.attr({
			'transform': 'translate(' + cx1 + ',' + cy1 + ')',
			'cx': function(d,i) {
				return (someNum + cgap * rad) * Math.cos(twoπ * ratio - twoπ/4)
			},
			'cy': function(d,i) {
				return (someNum + cgap * rad) * Math.sin(twoπ * ratio - twoπ/4)
			},
			'fill': color,
			'r': radius
		})

	rad++
}

function truncate(text, len){
	if(text.length > len){
		return text.substring(0, len) + '..'
	} else {
		return text
	}
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})