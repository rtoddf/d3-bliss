// http://www.webelements.com/

var defaults = {
	box: {
		width: 60,
		height: 60,
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
		.attr({
			'transform': function(d){
				return 'translate(' + defaults.box.width * d.position[0] + ', ' + defaults.box.height * d.position[1] + ')'
			}
		})

	var rect = box.append('rect')	
		.attr({
			'class': 'box',
			'width': defaults.box.width,
			'height': defaults.box.height,
			'fill': function(d){
				// console.log(d.classification)
				var fill_color = 'url(#' + d.classification + ')'
				return fill_color
			},
			'stroke': defaults.box.stroke
		})
		.on('mouseover', function(d){
			// console.log(getCentroid(d3.select(this)))
			d3.select(this)
				// .moveToFront()	
				.transition()
					.duration(200)
					.attr({
						'transform': 'translate(-5, -5)',
						'width': defaults.box.width + 10,
						'height': defaults.box.height + 10
					})
				.style({
					'cursor': 'pointer'
				})

			d3.select(this.nextElementSibling)
				// .moveToFront()
                .transition()
                    .duration(200)
                    .attr({
                    	'font-size': '32px',
                        'transform': 'translate(0, 10)',
                        'fill': 'white'
                    })
		})
		.on('mouseout', function(d){
			d3.select(this)
				.transition()
					.duration(200)
					.attr({
						'transform': 'translate(0, 0)',
						'width': defaults.box.width,
						'height': defaults.box.height
					})

			d3.select(this.nextElementSibling)
                .transition()
                    .duration(200)
                    .attr({
                        'transform': 'translate(0, 0)',
                        'fill': 'black',
						'font-size': '14px'
                    })
		})
			
	var symbol = box.append('text')
		.attr({
			'class': 'symbol',
			'x': function(d){
				return defaults.box.width / 2
			},
			'y': function(d){
				return defaults.box.height / 2
			},
			'text-anchor': defaults.symbol.anchor,
			'fill': 'black'
		})
		.text(function(d){
			return d.symbol
		})

})

d3.selection.prototype.moveToFront = function() {
  return this.each(function(){
    this.parentNode.appendChild(this);
  });
};


function getCentroid(selection) {
	// get the DOM element from a D3 selection
	// you could also use "this" inside .each()
	var element = selection.node(),
		// use the native SVG interface to get the bounding box
		bbox = element.getBBox();
	// return the center of the bounding box
	return [bbox.x + bbox.width/2, bbox.y + bbox.height/2];
}
