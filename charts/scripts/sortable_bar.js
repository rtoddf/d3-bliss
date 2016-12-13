// http://bl.ocks.org/mbostock/3885705

var container_parent = $('.display'),
	chart_container = $('#stuff'),
	margins = {top: 10, right: 40, bottom: 30, left: 40},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.7) - margins.top - margins.bottom,
	vis, vis_group, aspect

var index = d3.range(24),
	data = [
		{
			'name': 'Bob',
			'age': 52
		},
		{
			'name': 'Sara',
			'age': 33
		},
		{
			'name': 'Tommy',
			'age': 26
		},
		{
			'name': 'Sara',
			'age': 33
		}
	]

data.sort(function(a, b) {
	return d3.ascending(a.age, b.age);
})

// var data = index.map(d3.random.normal())

var x = d3.scale.linear()
	.domain([0, d3.max(data)])
	.range([0, width])

var y = d3.scale.ordinal()
	.domain(index)
	.rangeRoundBands([0, height], .1)

console.log(data)

vis = d3.select('#stuff').append('svg')
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

var bar = vis_group.selectAll('.bar')
		.data(data)
	.enter().append('g')
		.attr({
			'class': 'bar',
			'transform': function(d, i) {
				return 'translate(0,' + y(i) + ')';
			}
		})

bar.append('rect')
	.attr({
		'height': y.rangeBand(),
		'width': width
	})

bar.append('text')
	.attr({
		'text-anchor': 'end',
		'x': width - 30,
		// 'x': function(d) {
		// 	return x(d) - 6
		// },
		'y': y.rangeBand() / 2,
		'dy': '.35em',

	})
	.text(function(d, i) {
		// return i
		return d.name
	})

var sort = false

$('button').on('click', function(){
	var sort = $(this).data('sort')
	d3.select(this)
		.property('sort', sort)
		.each(change)
})

function change() {
	if(this.sort == 'desc'){
		index.sort(function(a, b) {
			// return d3.descending(a.visitors, b.visitors);
			return data[a] - data[b]
		})
	} else if(this.sort == 'asc'){
		index = d3.range(24)
	}

	y.domain(index)

	bar.transition()
		.duration(750)
		.delay(function(d, i) {
			return i * 50;
		})
		.attr({
			'transform': function(d, i) {
				return 'translate(0,' + y(i) + ')'
			}
		})
}

// setInterval(function() {

  

// }, 3000)




