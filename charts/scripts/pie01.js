var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.8) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	radius = Math.min(width, height) / 2.5

var color = d3.scale.ordinal()
	.range(['#b024e4', '#6420c1', '#c78721', '#003264', '#8a0600', '#baba71', '#666666'])

var duration = 300,
	easeType = 'back'
	scale = 1,
	opacity = 1,
	opacityOut = 0,
	opacityOver = .5,
	scaleAmount = 1.3,
	diffFromCenter = radius / 20

var arc = d3.svg.arc()
	.outerRadius(radius)
	.innerRadius(radius - 125)

var tooltip = d3.select('body').append('div')
	.attr('class', 'tooltip')
	.style('opacity', 1e-6)

var vis = d3.select('#example').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + (width/2 + margins.left) + ', ' + (height/2 + margins.top) + ')'
	})

aspect = chart_container.width() / chart_container.height();

var pie = d3.layout.pie()
	.sort(null)
	.value(function(d){
		return d.percentage
	})

d3.json('../data/pie01.json', function(error, data){
	var datum = data.datum

	console.log(datum)

	datum.forEach(function(d){
		d.percentage = +d.percentage
	})

	var total = d3.sum(pie(datum), function(d){
		return d.value
	})

	var g = vis_group.selectAll('.arc')
		.data(pie(datum))
			.enter().append('g')
		.attr({
			'class': 'arc'
		})

	g.append('path')
		.attr({
			'd': arc,
			'fill': function(d){
				return color(d.data.race)
			}
		})
		.style({
			'opacity': opacity
		})

	g.on('mouseover', function(d) {
		tooltip.transition()
			.duration(200)
			.style('opacity', 1)

	d3.select(this)
		.transition()
		.duration(duration + 300)
		.ease(easeType)
		.attr({
			'transform': function(d) {
				var c = arc.centroid(d),
				x = c[0],
				y = c[1],
				// pythagorean theorem for hypotenuse
				h = Math.sqrt(x*x + y*y)
				return 'translate(' + (x/h * diffFromCenter) +  ',' + (y/h * diffFromCenter) +  ') scale(' + scaleAmount + ')'
			}
		})
		.style({
			'opacity': opacityOver	
		})

	vis_group.append('text')
		.attr({
			'class': 'percentage',
			'x': radius / 20,
			'y': radius / 20 + 10,
			'text-anchor': 'middle',
			'font-size': radius / 3
		})
		.text(function(t){
			return ((d.data.percentage/total) * 100).toFixed(0) + '%'
		})
		.style({
			'opacity': 0
		})
		.transition()
			.duration(duration)
				.style({
					'opacity': opacity
				})
	})

	g.on('mousemove', function(d, i) {
		if (d3.mouse(this)[0] < 0) {
			tooltip.transition().duration(200).style('opacity', 0)
		} else {
			tooltip.html(function(d) {
				// console.log(d)
				var tooltip_data = ''
				tooltip_data += '<span>This is the race for this pie wedge</span>'
				return tooltip_data
			})
			.style('left', (d3.event.pageX + 10) + 'px')
			.style('top', (d3.event.pageY) + 'px')
		}
	})

	g.on('mouseout', out)

})

var out = function(){
	tooltip.transition().duration(200).style('opacity', 0)

	d3.selectAll('.arc')
		.transition()
			.duration(duration)
			.ease(easeType)
			.attr({
				'transform': 'translate(0, 0) scale(' + scale + ')'
			})
			.style({
				'opacity': opacity
			})

	d3.select('.percentage')
		.transition()
			.duration(duration)
				.style({
					'opacity': opacityOut
				})

	d3.selectAll('text')
		.transition()
		.duration(200)
		.style({
			'opacity': opacityOut
		})
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})