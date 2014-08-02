var width = 600,
		height = 200,
		interval = 1300,
		duration  = 3000,
		imageSource = 'images/jglevitt.jpg'

var svg = d3.select('#example')
	.append('svg')
		.attr({
			'width': width,
			'height': height
		})

var backgroundScroll = function backgroundScroll(){
	var background = svg
		.append('image')
			.attr({
				'xlink:href': imageSource,
				'x': function(d){
					return -(width)
				},
				'width': width,
				'height': height  
			})
			.transition()
				.duration(duration)
		    .ease('linear')
		    .attr('transform', function(){
		    	return 'translate(' + (width * 2) + ')'
		  	})
	  	.each('end', function(){
	  		d3.select(this)
	  			.remove()
	  	})
			
			setTimeout(function(){
				requestAnimationFrame(backgroundScroll)
			}, interval)
}

requestAnimationFrame(backgroundScroll)