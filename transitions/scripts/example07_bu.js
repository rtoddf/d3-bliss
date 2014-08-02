var width = 600,
		height = 200,
		interval = 1000,
		duration  = 4000,
		imageSource = 'images/jglevitt.jpg'

var shape_width = 70

var svg = d3.select('#example')
	.append('svg')
		.attr({
			'width': width,
			'height': height
		})

// var background = svg
// 	.append('image')
// 		.attr({
// 			'xlink:href': imageSource,
// 			'width': width,
// 			'height': height
// 		})

var animation = function animation(){
	var background = svg
		.append('image')
			.attr({
				'xlink:href': imageSource,
				'x': function(d){
					return -(width)
				},
				'width': width,
				'height': height,
				'transform': 'translate(scale(2, 2))'     
			})
			.transition()
				.duration(duration)
		    .ease('linear')
		    .attr('transform', function(){
		    	return 'translate(' + (width + (width * 2)) + ')'
		  	})
	  	.each('end', function(){
	  		d3.select(this)
	  			.remove()
	  	})
setTimeout(function(){
         requestAnimationFrame(animation);
}, interval);


}

requestAnimationFrame(animation);

// timer example
var backgroundScroll = function() {

		// var circle = svg
		// 	.append('rect')
		// 		.attr({
		// 			'cx': function(d){
		// 				return -(shape_width)
		// 			},
		// 			'width': shape_width,
		// 			'height': height
		// 		})

	var background = svg
		.append('image')
			.attr({
				'xlink:href': imageSource,
				'x': function(d){
					return -(width)
				},
				'width': width,
				'height': height,
				'transform': 'translate(scale(2, 2))'     
			})
			.transition()
				.duration(duration)
		    .ease('linear')
		    .attr('transform', function(){
		    	return 'translate(' + (width + (width * 2)) + ')'
		  	})
	  	.each('end', function(){
	  		d3.select(this)
	  			.remove()
	  	})

    return function() {
        d3.timer(backgroundScroll(),interval)
        return true
    }
}

d3.timer(backgroundScroll(),interval)

// jglevitt.jpg

// setInterval(backgroundScroll, interval);

// function backgroundScroll(){
// 		var circle = svg
// 			.append('rect')
// 				.attr({
// 					'cx': function(d){
// 						return -(shape_width)
// 					},
// 					'cy': shape_width,
// 					'width': shape_width,
// 					'height': height
// 				})
// 				.transition()
// 				.duration(2000)
// 		    .ease('linear')
// 		    .attr('transform', function(){
// 		    	return 'translate(' + (width + (shape_width * 2)) + ')'
// 		  	})
		  	// .each('end', function(){
		  	// 	d3.select(this)
		  	// 		.remove()
		  	// })
// }

// detecting done
    // .each('end', function(d, i, a){
    // 	d3.select(this)
    // 			.attr({
    // 				'transform': 'translate(0)'
    // 			})
    // 			.transition()
				// 	.duration(2000)
			 //    .ease('linear')
    // 			.attr('transform', function(){
			 //    	return 'translate(' + (width + (shape_width * 2)) + ')'
			 //  	})
    // 	console.log('done')
    // })