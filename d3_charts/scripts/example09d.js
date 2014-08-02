// http://bl.ocks.org/mbostock/1346410

var container_parent = $('.display'),
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 30, left: 40},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.66) - margins.top - margins.bottom,
	vis, vis_group, aspect

var radius = Math.min(width, height) / 2

var color = d3.scale.category20c()
var pie = d3.layout.pie()
	.value(function(d){
		return d.apples
	})
	.sort(null)

var arc = d3.svg.arc()
	.innerRadius(radius - 100)
	.outerRadius(radius - 20)

vis = d3.select('#example').append('svg')
	.attr({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + width + ' ' + height
	})

vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + width/2 + ', ' + height/2 + ')'
	})

d3.tsv('data/example09d.tsv', type, function(data){
	console.log('data: ', data)

	var path = vis_group.datum(data).selectAll('path')
		.data(pie)
			.enter().append('path')
		.attr({
			'fill': function(d, i){
				return color(i)
			},
			'd': arc
		})
		.each(function(d){
			this._current = d
			// save the initial angles
		})

	d3.selectAll('input')
		.on('change', change)

	var timeout = setTimeout(function(){
		d3.select('input[value=\'oranges\']').property('checked', true).each(change)
	})

	function change(){
		var value = this.value
		clearTimeout(timeout)
		// change the value function
		pie.value(function(d){
			return d[value]
		})
		// computer the new angles
		path = path.data(pie)
		path.transition()
			.duration(750)
			.attrTween('d', arcTween)
	}
})

function type(d){
	d.apples = +d.apples
	d.oranges = +d.oranges
	return d
}

function arcTween(a){
	var i  = d3.interpolate(this._current, a)
	this._current = i(0)
	return function(t){
		return arc(i(t))
	}
}
















