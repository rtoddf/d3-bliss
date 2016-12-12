var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * .3) - margins.top - margins.bottom,
	vis, vis_group, aspect

var data = [5, 25, 80],
	fill_color = 'rgba(0,50,100,.5)',
	rect_width = 50,
	rect_height = 50

vis = d3.select('#example')
	.append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})
	.style('border', '1px solid black')

vis_group = vis.append('g')
	.attr({
        'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
    })

aspect = chart_container.width() / chart_container.height()

vis_group.selectAll('rect')
	.data(data)
		.enter().append('rect')
	.attr({
		'x': function(d, i){
			return Object(d, i)
			// return d
		},
		'y': Object,
		'width': rect_width,
		'height': rect_height,
		'fill': fill_color
	})

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})

// Multiple select operations can be on one line
// Modifying operations on a selection are indented four spaces and get their own line
// Pair enter and append together on one line with a two-space indent

// This makes it obvious operations are on a new set of nodes, not the original selection
// Only have one selectAll per statement

// .attr('x', Object)
// is equivalent to:
// .attr('x', function(d, i) { return Object(d, i); })
// and also to:
// .attr('x', function(d, i) { return d; })