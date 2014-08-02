var width = 600,
	height = 200

var svgContainer = d3.select('#example').append('svg')
		.attr({
			'width': width,
			'height': height
		})

var mySquare = svgContainer.append('rect')
		.attr({
			"x": 60,
			'y': 60,
			'width': 100,
			'height': 100,
			'fill': 'red'
		})

// var mySquare=svg.append("rect")

//   .attr("width",60)
//   .attr("height",60);

$('#click').bind('click', function(){
	mySquare
		.transition()
		.attr({
			"width": 320
		});
})