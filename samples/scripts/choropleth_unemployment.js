// http://bl.ocks.org/mbostock/4060606
var rateById = d3.map();

var quantize = d3.scale.quantize()
	.domain([ 0, .15 ])
	.range(d3.range(9).map(function(i) {
		return 'q' + i + '-9'
	}))

vis = d3.select('#chart').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

queue()
	.defer(d3.json, 'data/us.json')
	.defer(d3.tsv, 'data/unemployment.tsv', function(d) {
		rateById.set(d.id, +d.rate)
	})
	.await(ready)

function ready(error, us) {
	vis_group.append('g')
		.attr('class', 'counties')
		.selectAll('path')
			.data(topojson.feature(us, us.objects.counties).features)
		.enter().append('path')
			.attr({
                'class': function(d) {
    				return quantize(rateById.get(d.id))
    			},
                'd': path
            })

	vis_group.append('path')
        .datum(topojson.mesh(us, us.objects.states, function(a, b) {
            return a !== b
        }))
        .attr({
            'd': path,
            'fill': 'none'
        })
}
