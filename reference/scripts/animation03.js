// http://bl.ocks.org/enjalot/1429426
// http://danieltao.com/lazy.js/

var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 30, left: 40},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.66) - margins.top - margins.bottom,
	vis, vis_group, aspect

vis = d3.select('#example').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'class': 'chart',
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
	.attr({
		'id': 'barchart',
		'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	})

	aspect = chart_container.width() / chart_container.height()

var data1 = [ 5, 20, 55, 60, 89 ]
var data2 = [ 35, 80, 35, 90, 19, 39, 199 ]

var data01
var data02

d3.json('data/example09_01.json', function(data){
	data01 = data
	// console.log('data01: ', data01)
})


d3.json('data/example09_01.json', function(data){
	data02 = data
	// console.log('data02: ', data02)
})

console.log('data01: ', data01)
console.log('data02: ', data02)

d3.select('#data1')
	.on('click', function(d, i){
		bars(data1)
	})

d3.select('#data2')
	.on('click', function(d, i){
		bars(data2)
	})

// make the bars
bars(data1)

function bars(data){
	// console.log(data)

	max = d3.max(data)

	//nice breakdown of d3 scales
	//http://www.jeromecukier.net/blog/2011/08/11/d3-scales-and-color/
	x = d3.scale.linear()
		.domain([ 0, max ])
		.range([ 0, width ])

	var y = d3.scale.ordinal()
		.domain(d3.range(data.length))
		.rangeBands([ 0, height ], .2)

	var vissy = d3.select('#barchart')

	var bars = vissy.selectAll('rect.bar')
		.data(data)

	// update
	bars
		.attr({
			'fill': function(d){
				// console.log('max: ', max)
				// console.log('data.length: ', data.length)
				// console.log('d: ', d)
				if(d > 100){
					return '#800'
				} else {
					return '#003264'
				}
				
			}
		})

	// enter	
	bars.enter().append('rect')
		.attr({
			'class': 'bar',
			'fill': function(d){
				// console.log('d: ', d)
				if(d > 100){
					return '#800'
				} else {
					return '#003264'
				}
			}
		})

	// exit
	bars.exit()
		.transition()
			.duration(300)
			.ease('exp')
			.attr({
				'width': 0
			})
			.remove()

	bars
		.attr({
			'stroke-width': 4
		})
		.transition()
			.duration(3000)
			.ease('quad')
			.attr({
				'width': x,
				'height': y.rangeBand(),
				'transform': function(d, i){
					return 'translate(' + [ 0, y(i) ] + ')'
				}
			})
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})