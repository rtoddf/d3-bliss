// http://www.webelements.com/

var defaults = {
	box: {
		width: (width - margins.left - margins.right) / 17,
		height: (height - margins.top - margins.bottom) / 17,
		stroke: 'rgba(0,0,0,1)'
	},
	symbol: {
		fill: 'rgba(0,0,0,1)',
		anchor: 'middle'
	}
}

aspect = chart_container.width() / chart_container.height()

d3.json('data/periodic_table.json', function(error, data){
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
				console.log(d.classification)
				var fill_color = 'url(#' + d.classification + ')'
				return fill_color
			},
			'stroke': defaults.box.stroke
		})
		.on('mouseover', function(d){
			d3.select(this)
				.transition()
					.attr({
						'transform': function(){
							return 'scale(1.2)'
						}
					})
		})
		.on('mouseout', function(d){
			d3.select(this)
				.transition()
					.attr({
						'transform': function(){
							return 'scale(1)'
						}
					})
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

})