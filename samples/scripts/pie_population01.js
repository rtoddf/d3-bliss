var race, total

var arc = d3.svg.arc()
	.outerRadius(radius)
	.innerRadius(radius - 125)

var vis = d3.select('#chart').append('svg')
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

(function () {
	var pie = d3.layout.pie()
		.sort(null)
		.padAngle(.02)
		.value(function(d){
			return d.percentage
		})

	d3.json('data/population.json', function(error, data){
		data.forEach(function(d){
			d.percentage = +d.percentage
		})

		total = d3.sum(pie(data), function(d){
			return d.value
		})

		var g = vis_group.selectAll('.arc')
			.data(pie(data))
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
				'opacity': defaults.opacity.off
			})

		// hover and off states
		g.on('mouseover', over)
		g.on('mouseout', out)
	})
})()

var over = function(d){
	// animate the arc
	d3.select(this)
		.transition()
			.duration(defaults.animation.duration)
			.ease(defaults.animation.easeType)
			.attr({
				'transform': function(d) {
					race = d.data.race
					var c = arc.centroid(d),
					x = c[0],
					y = c[1],
					// pythagorean theorem for hypotenuse
					h = Math.sqrt(x*x + y*y)
					return 'translate(' + (x/h * defaults.animation.diffFromCenter) +  ',' + (y/h * defaults.animation.diffFromCenter) +  ') scale(' + defaults.animation.scaleAmount + ')'
				}
			})
			.style({
				'opacity': .5,
				'cursor': 'pointer'
			})

	// show the tooltip and set the text
	d3.select('.tooltip')
		.html(function(d){
			return '<span>' + race + '</span>'
		})
		.style({
			'left': (d3.event.pageX) + 'px',
			'top': (d3.event.pageY - 28) + 'px'
		})
		.transition()
			.duration(defaults.animation.duration)
			.style({
				'opacity': defaults.opacity.over
			})

	// append the percentage to the center of the chart
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
			'opacity': defaults.opacity.out
		})
		.transition()
			.duration(defaults.animation.duration)
			.style({
				'opacity': defaults.opacity.off
			})
}

var out = function(){
	tooltip
		.transition()
			.duration(defaults.animation.duration)
			.style({
				'opacity': defaults.opacity.off
			})

	d3.selectAll('.arc')
		.transition()
			.duration(defaults.animation.duration)
			.ease(defaults.animation.easeType)
			.attr({
				'transform': 'translate(0, 0) scale(' + defaults.animation.scale + ')'
			})
			.style({
				'opacity': defaults.opacity.off
			})

	d3.select('.percentage')
		.transition()
			.duration(defaults.animation.duration)
			.style({
				'opacity': defaults.opacity.out
			})

	d3.selectAll('text')
		.transition()
		.duration(defaults.animation.duration)
		.style({
			'opacity': defaults.opacity.out
		})
}
