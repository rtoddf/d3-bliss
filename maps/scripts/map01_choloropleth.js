var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width(),
	height = (width * 0.66) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	scale_amount = '.85',
	rateById = d3.map()

// look up d3.scale.quantize()
var quantize = d3.scale.quantize()
		.domain([0, .15])
		.range(d3.range(9).map(function(i){
			return 'q' + i + '-9'
		}))

var path = d3.geo.path()

vis = d3.select('#example').append('svg')
	.attr({
		'width': width,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
	.attr({
        'transform': 'scale(' + scale_amount + ')'
    })

aspect = chart_container.width() / chart_container.height()

// look up queue and all its methods
queue()
	.defer(d3.json, '../data/us.json')
	.defer(d3.tsv, '../data/unemployment.tsv', function(d){ 
		rateById.set(d.id, +d.rate)
	})
	.await(ready)

function ready(error, us){
	vis_group.append('g')
		.attr({
			'class': 'counties'
		})
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
		.datum(topojson.mesh(us, us.objects.states, function(a, b){
			return a !== b
		}))
		.attr({
			'class': 'states',
			'd': path
		})
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})