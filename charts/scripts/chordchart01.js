var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
    height = width - margins.top - margins.bottom,
    innerRadius = Math.min(width, height) * .41,
    outerRadius = innerRadius * 1.1,
	vis, vis_group, aspect

var matrix = [
	[11975,  5871, 8916, 2868],
	[ 1951, 10048, 2060, 6171],
	[ 8010, 16145, 8090, 8045],
	[ 1013,   990,  940, 6907]
]

var chord = d3.layout.chord()
	.padding(.05)
	.sortSubgroups(d3.descending)
	.matrix(matrix)

var fill = d3.scale.ordinal()
	.domain(d3.range(4))
	.range([ '#000000', '#ffdd89', '#957244', '#f26223' ])
		 
vis = d3.select('#example').append('svg')
	.attr({
		'width': width,
		'height': height
	})

vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + width / 2 + ', ' + height / 2 + ')'
	})

vis_group.append('g').selectAll('path')
	.data(chord.groups)
		.enter().append('path')
	.attr({
		'fill': function(d){
			return fill(d.index)
		},
		'd': d3.svg.arc().innerRadius(innerRadius).outerRadius(outerRadius),
		'stroke': function(d){
			return fill(d.index)
		}
	})
	.on('mouseover', fade(.1))
	.on('mouseout', fade(1))

var ticks = vis_group.append('g').selectAll('g')
	.data(chord.groups)
		.enter().append('g').selectAll('g')
	.data(groupTicks)
		.enter().append('g')
	.attr({
		'transform': function(d){
			return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')' 
			+ 'translate(' + outerRadius + ', 0)'
		}
	})

ticks.append('line')
	.attr({
		'x1': 1,
		'y1': 0,
		'x2': 5,
		'y2': 0
	})
	.style('stroke', '#000')

ticks.append('text')
	.attr({
		'x': 8,
		'dy': '.35em',
		'transform': function(d){
			return d.angle > Math.PI ? 'rotate(180)translate(-16)' : null
		}
	})
	.style({
		'text-anchor': function(d){
			return d.angle > Math.PI ? 'end' : null
		}
	})
	.text(function(d){
		return d.label
	})

vis_group.append('g')
	.attr({
		'class': 'chord'
	})
	.selectAll('path')
	.data(chord.chords)
		.enter().append('path')
	.attr({
		'd': d3.svg.chord().radius(innerRadius),
		'fill': function(d){
			return fill(d.target.index)
		}
	})
	.style('opacity', 1)

// returns an array of tick angles and labels, given a group.
function groupTicks(d){
	var k = (d.endAngle - d.startAngle) / d.value
	return d3.range(0, d.value, 1000).map(function(v, i){
		return {
			angle: v * k + d.startAngle,
			label: i % 5 ? null : v / 1000 + 'k'
		}
	})
}

function fade(opacity){
	return function(g, i){
		vis_group.selectAll('.chord path')
			.filter(function(d){
				return d.source.index != i && d.target.index != i
			})
			.transition()
				.style('opacity', opacity)
	}
}

aspect = chart_container.width() / chart_container.height()

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	console.log('targetWidth: ', targetWidth)
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})