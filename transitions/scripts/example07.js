// add svg tag
var visWidth = $('#example').width(),
		visHeight = visWidth * .33

var vis = d3.select('#example')
	.append('svg')
		.attr({
			'width': visWidth,
			'height': visHeight
		})

// add defs tag
var defs = vis
	.append('defs')

// moon //
// blur
var moonFill = 'beige',
		moonCx = visWidth - 50,
		moonCy = 50,
		moonRadius = 40,
		moonBlurAmount = 5,
		moonInterval = 12000,
		moonDuration = 6000

var moonBlur = defs	
	.append('filter')
		.attr({
			'id': 'moon_blur'
		})
		.append('feGaussianBlur')
			.attr({
				'stdDeviation': moonBlurAmount
			})

// sky //
// sky gradient
var skyColors = [ { 'stop': 0, 'color': 'rgba(0,50,100,1)' }, { 'stop': 1, 'color': 'rgba(0,0,0,1)' } ]

var skyGradient = defs
	.append('linearGradient')
		.attr({
			'id': 'three_stop'
		})

// sky gradient stops
skyGradient.selectAll('stop')
		.data(skyColors).enter()
	.append('stop')
		.attr({
			'offset': function(d){
				return d.stop
			}
		})
		.style({
			'stop-color': function(d){
				return d.color
			}
		})

// sky gradient direction
var skyGradientDirection = defs
	.append('linearGradient')
		.attr({
			'id': 'gradient_diagonal',
			'xlink:href': '#three_stop',
			'x1': 0,
			'y1': 0,
			'x2': 1,
			'y2': 1
		})
var sky = vis
	.append('rect')
		.attr({
			'width': visWidth,
			'height': visHeight,
			'fill': 'url(#gradient_diagonal)'
		})

var moon = vis
	.append('circle')
		.attr({
			'id': 'moon',
			'cx': moonCx,
			'cy': moonCy,
			'r': moonRadius,
			'fill': moonFill
		})
	.style({
		'filter': 'url(#moon_blur)'
	})

// moonshine animation
var moonShine = function moonShine() {
	vis.selectAll('#moon')
		.transition()
			.duration(moonDuration)
	    .ease('linear')
	    .attr('r', function() {
		  	var moonRadius = $('#moon').attr('r')
		  	return moonRadius * 1.2
			})
			.each('end', function(){
				d3.select(this)
					.transition()
						.duration(moonDuration)
						.ease('linear')
				    .attr('r', function() {
					  	var moonRadius = $('#moon').attr('r')
					  	return moonRadius * .833
						})
	  	})

	return function() {
		d3.timer(moonShine(), moonInterval)
		return true
	}
}

// cityscape
var cityscapeSource = 'images/cityscape.svg',
		cityscapeInterval = 7470,
		cityscapeDuration  = 15000

var cityscapeScroll = function cityscapeScroll() {
	var background = vis
		.append('image')
			.attr({
				'xlink:href': cityscapeSource,
				'x': function(d){
					return -(visWidth)
				},
				'width': visWidth,
				'height': visHeight  
			})
			.transition()
				.duration(cityscapeDuration)
		    .ease('linear')
		    .attr('transform', function(){
		    	return 'translate(' + (visWidth * 2) + ')'
		  	})
	  	.each('end', function(){
	  		d3.select(this)
	  			.remove()
	  	})
			
  return function() {
      d3.timer(cityscapeScroll(), cityscapeInterval)
      return true
  }
}

// animation calls
d3.timer(moonShine(), moonInterval)
d3.timer(cityscapeScroll(), cityscapeInterval)