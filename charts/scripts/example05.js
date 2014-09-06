var dataset = [ 5, 10, 13, 19, 21, 25, 22, 18, 15, 13, 11, 12, 15, 20, 18, 17, 16, 18, 23, 25 ];

var svgHeight = 200
var svgWidth  = 500
var barPadding = 1

var svg = d3.select('#example')
						.append('svg')
						.attr('height', svgHeight)
						.attr('width', svgWidth)

svg.selectAll('rect')
	.data(dataset)
	.enter()
	.append('rect')
	.attr('x', function(d, i){
		// dynamically set the x position of the rects so it spans the whole width
		// of the svg
		return i * (svgWidth / dataset.length)
	})
	.attr('y', function(d){
		// you have to set the y position of the rects to the bottom
		// since 0, 0 is top left
		return svgHeight - (d * 4)
	})
	.attr('width', function(d, i){
		// dynamically set the width of each bar no matter how many data objects
		return (svgWidth / dataset.length) - barPadding
	})
	.attr('height', function(d){
		// * 4 just makes it higher and easier to see
		return d * 4
	})
	.attr('fill', function(d){
		return 'rgba(0,50,100,.' + (d + 15) + ')'
	})

svg.selectAll('text')
	.data(dataset)
	.enter()
	.append('text')
	.text(function(d){
		return d
	})
	.attr('text-anchor', 'middle')
	.attr('x', function(d, i){
		// huh?
		return i  * (svgWidth / dataset.length ) + (svgWidth / dataset.length - barPadding) / 2
	})
	.attr('y', function(d){
		return svgHeight - (d * 4) + 14
	})
	.attr('font-family', 'Arial')
	.attr('fill', 'white')
	.attr('font-size', '12')