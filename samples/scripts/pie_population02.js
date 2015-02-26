var container_parent = $('.display'),
	chart_container = $('#chart'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.8) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	radius = Math.min(width, height) / 2 - margins.top

var outerRadius = radius,
	innerRadius = radius / 2

var defaults = {
	pad_angle: .02,
    colors: {
        fill_off: 'orange',
        fill_over: '#999',
        stroke_off: '#999',
        stroke_over: '#000'
    },
    animation: {
        duration: 500,
        delay_off: 0,
        delay_over: 150,
        strokeWidth_off: .5,
        strokeWidth_over: 1.5,
    },
    opacity: {
        off: 1,
        over: 1,
        out: 0
    }
}

var arc = d3.svg.arc()
	.padRadius(outerRadius)
	.innerRadius(innerRadius)

var pie = d3.layout.pie()
	.padAngle(defaults.pad_angle)
	.value(function(d){
		return d.percentage
	})

var tooltip = d3.select('body').append('div')
	.attr({
		'class': 'tooltip',
		'opacity': 1e-6
	})

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

aspect = chart_container.width() / chart_container.height()
var total, percent, the_data

d3.json('data/population.json', function(error, data){
	data.forEach(function(d){
		d.percentage = +d.percentage
	})

	total = d3.sum(pie(data), function(d){
		return d.value
	})

	vis_group.selectAll('path')
		.data(pie(data))
			.enter().append('path')
		.each(function(d) {
			d.outerRadius = outerRadius
		})
		.attr({
			'd': arc,
			'fill': defaults.colors.fill_off,
			'stroke': defaults.colors.stroke_off,
			'stroke-width': defaults.animation.strokeWidth_off
		})
		.on('mouseover', user_interaction('over'))
		.on('mouseout', user_interaction('off'))
})


function user_interaction(event){
	var rad = event == 'over' ? outerRadius + 20 : outerRadius
	var fill_color = event == 'over' ? defaults.colors.fill_over : defaults.colors.fill_off
	var delay = event == 'over' ? defaults.animation.delay_off : defaults.animation.delay_over
	var tooltip_opacity = event == 'over' ? defaults.opacity.over : defaults.opacity.out
	var text_opacity = event == 'over' ? defaults.opacity.over : defaults.opacity.out

	return function(){
		// animate the arc
		d3.select(this)
			.transition()
				.delay(delay)
				.attrTween('d', function(d) {
					the_data = d.data
					percentage = d.data.percentage
					var i = d3.interpolate(d.outerRadius, rad)
					return function(t) {
						d.outerRadius = i(t)
						return arc(d)
					}
				})
				.style({
					'cursor': 'pointer',
					'fill': fill_color
				})

		// show the tooltip and set the text
		d3.select('.tooltip')
			.html(function(){
				return '<span>' + the_data.race + '</span>'
			})
			.style({
				'left': (d3.event.pageX) + 'px',
				'top': (d3.event.pageY - 28) + 'px'
			})
			.transition()
				.duration(defaults.animation.duration)
				.style({
					'opacity': tooltip_opacity
				})

		// append the percentage to the center of the chart
		d3.select('.percentage')
			.remove()

		vis_group.append('text')
			.attr({
				'class': 'percentage',
				'x': radius / 20,
				'y': radius / 20 + 10,
				'text-anchor': 'middle',
				'font-size': radius / 3
			})
			.text(function(t){
				return ((percentage/total) * 100).toFixed(0) + '%'
			})
			.style({
				'opacity': defaults.opacity.out
			})
			.transition()
				.duration(defaults.animation.duration)
				.style({
					'opacity': text_opacity
				})
	}
}
