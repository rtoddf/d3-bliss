// http://www.webelements.com/

var container_parent = $('.display'),
	chart_container = $('#periodic_table'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = width - margins.top - margins.bottom,
	vis, vis_group, aspect

var defaults = {
	box: {
		width: (width - margins.left - margins.right) / 17,
		height: (height - margins.top - margins.bottom) / 17,
		stroke: 'rgba(0,0,0,1)'
	},
	colors: ['rgba(102,153,255,1)', 'rgba(255,204,0,1)', 'rgba(255,153,153,1)', 'rgba(0,204,51,1)'],
	symbol: {
		fill: 'rgba(0,0,0,1)',
		anchor: 'middle'
	}
}

var 

vis = d3.select('#periodic_table').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
	.attr({
		// 'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	})

aspect = chart_container.width() / chart_container.height()

d3.json('../data/periodic_table.json', function(error, data){
	var elements = data.elements

	var box = vis_group.selectAll('g')
		.data(elements)
			.enter().append('g')

	var rect = box.append('rect')	
		.attr({
			'class': 'box',
			'width': defaults.box.width,
			'height': defaults.box.height,
			'x': function(d){
				return defaults.box.width * d.position[0] + 1
			},
			'y': function(d){
				return defaults.box.height * d.position[1] + 1
			},
			'fill': function(d){
				return defaults.colors[d.color]
			},
			'stroke': defaults.box.stroke
		})
			
	var symbol = box.append('text')
		.attr({
			'class': 'symbol',
			'x': function(d){
				return (defaults.box.width * d.position[0]) + defaults.box.width / 2
			},
			'y': function(d){
				return (defaults.box.height * d.position[1]) + 1 + defaults.box.height / 2
			},
			'text-anchor': defaults.symbol.anchor,
			'fill': defaults.symbol.fill
		})
		.text(function(d){
			return d.symbol
		})

	// var thisBoxWidth = rect.attr('width'),
	// 	thisBoxHeight = rect.attr('height')

	// rect
	// 	.on('mouseover', function(){
	// 		d3.select(this)
	// 			.transition()
	// 				.duration(200)
	// 				.ease('back')
	// 				.attr({
	// 					'width': thisBoxWidth * 1.5,
	// 					'height': thisBoxHeight * 1.5
	// 				})
	// 	})
	// 	.on('mouseout', function(){
	// 		d3.select(this)
	// 			.transition()
	// 				.duration(200)
	// 				.attr({
	// 					'width': thisBoxWidth,
	// 					'height': thisBoxHeight
	// 				})
	// 	})

})