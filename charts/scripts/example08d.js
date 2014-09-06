// http://fleetinbeing.net/d3e/chord.html
// http://fleetinbeing.net/d3e/chord.js
// http://www.javainc.com/projects/dex/examples/vis/d3/presidents/presidentPartyChord.html
// view-source:http://www.javainc.com/projects/dex/examples/vis/d3/presidents/presidentPartyChord.html
// http://exposedata.com/tutorial/chord/latest.html
// view-source:http://exposedata.com/tutorial/chord/latest.html

var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 30, left: 40},
	width = container_parent.width() - margins.left - margins.right,
	height = width - margins.top - margins.bottom,
	vis, vis_group, aspect

var innerRadius = width * .41
	outerRadius = innerRadius * 1.1

var fill = d3.scale.ordinal()
	.domain(d3.range(3))
	.range([ '#fd8d3c', '#fdae6b', '#fdd0a2', '#756bb1', '#9e9ac8', '#bcbddc' ])

var stroke = '#666666'

var last_chord = {}

var data = [
    [11975,  5871, 8916, 2868],
    [ 1951, 10048, 2060, 6171],
    [ 8010, 16145, 8090, 8045],
    [ 1013,   990,  940, 6907]
  ]

var chart = chartIt(data)

d3.select('.change').on('click', function(){
	var new_data = [
		[ rand(), rand(), rand(), rand(), rand() ],
		[ rand(), rand(), rand(), rand(), rand() ],
		[ rand(), rand(), rand(), rand(), rand() ],
		[ rand(), rand(), rand(), rand(), rand() ],
		[ rand(), rand(), rand(), rand(), rand() ]
	]

	vis_group.selectAll('.ticks')
		.transition()
			.each('end', function(){ rerender(new_data) })
			.duration(200)
			.attr({
				'opacity': 0.5
			})
			.remove()
})

function chartIt(data){
	vis = d3.select('#example').append('svg')
		.attr({
			'width': width - margins.left - margins.right,
			'height': height,
			'class': 'chart',
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + width + ' ' + height
		})

	vis_group = vis.append('g')
		.attr({
			'transform': 'translate(' + width / 2 + ', ' + height / 2 + ')'
		})

	aspect = chart_container.width() / chart_container.height()

	var chord = d3.layout.chord()
		.padding(.1)
		.matrix(data)

	vis_group.append('g')
		.attr({
			'class': 'arc'
		})
		.selectAll('path')
		.data(chord.groups)
			.enter().append('path')
		.attr({
			'fill': function(d){
				return fill(d.index)
			},
			'd': d3.svg.arc()
				.innerRadius(innerRadius)
				.outerRadius(outerRadius),
			'stroke': function(d){
				return stroke
			}
		})

	drawTicks(chord, vis_group)

	last_chord = chord

	return vis_group
}

function rerender(data) {
	var chord = d3.layout.chord()
		.padding(.1)
		.matrix(data)

	vis_group.selectAll('.arc')
		.data(chord.groups)
		.transition()
			.duration(1500)
			.attrTween('d', arcTween(last_chord))

	last_chord = chord
}

function drawTicks(chord, vis_group){
	var ticks = vis_group.append('g')
		.attr({
			'class': 'ticks'
		})
		.selectAll('g')
		.data(chord.groups)
			.enter().append('g').selectAll('g')
		.data(groupTicks)
			.enter().append('g')
		.attr({
			'transform': function(d){
				return 'rotate(' + (d.angle * 180 / Math.PI - 90) + ')'
				+ ' translate(' + outerRadius + ', 0)'
			}
		})

	ticks.append('line')
		.attr({
			'x1': 1,
			'y1': 0,
			'x2': 5,
			'y2': 0,
			'stroke': stroke
		})

	ticks.append('text')
		.attr({
			'x': 8,
			'dy': '.35em',
			'transform': function(d){
				return d.angle > Math.PI ? 'rotate(180) translate(-16)' : null
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
			.style({
				'opacity': 1
			})

	return ticks
}

function groupTicks(d){
	var k = (d.endAngle - d.startAngle) / d.value
	return d3.range(0, d.value, 1000).map(function(v, i){
		return {
			angle: v * k + d.startAngle,
			label: i % 5 ? null : v / 1000 + 'k'
		}
	})
}

function rand(){
	return 10000 * Math.random()
}

var arc = d3.svg.arc()
	.startAngle(function(d){ 
		return d.startAngle
	})
	.endAngle(function(d){
		return d.endAngle
	})
	.innerRadius(innerRadius)
	.outerRadius(outerRadius)

var chord1 = d3.svg.chord().radius(innerRadius)

function arcTween(chord){
	return function(d, i){

		var i = d3.interpolate(chord.chords()[i], d)
		return function(t) {
	      return arc(i(t));
	    }
	}
}




