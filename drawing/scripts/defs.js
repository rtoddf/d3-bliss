function setGradient(color1, color2) {
	var gradientColorStops = [
		{
			'stop': .5,
			'color': color1
		},
		{
			'stop': 1,
			'color': color2
		}
	]

	var linearGradient = defs
		.append('linearGradient')
			.attr({
				'id': 'stripe_gradient'
			})

	linearGradient.selectAll('stop')
			.data(gradientColorStops).enter()
		.append('stop')
			.attr({
				'offset': function(d){ return d.stop }
			})
			.style({
				'stop-color': function(d){ return d.color }
			})

	var gradientDirection = defs
	.append('linearGradient')
		.attr({
			'id': 'vertical_gradient',
			'xlink:href': '#stripe_gradient',
			'x1': 0,
			'y1': 0,
			'x2': 0,
			'y2': 1
		})

	var radialGradient = defs
	.append('radialGradient')
		.attr({
			'id': 'radial'
		})

	radialGradient.selectAll('stop')
		.data(gradientColorStops).enter()
		.append('stop')
			.attr({
				'offset': function(d){ return d.stop },
			})
			.style({
				'stop-color': function(d){ return d.color }
			})

	var gradientColorOffsetStops = [
		{
			'stop': 0,
			'color': color1
		},
		{
			'stop': 1,
			'color': color2
		}
	]

	var radialGradientOffset = defs
	.append('radialGradient')
		.attr({
			'id': 'radial_offset',
			'fx': '25%',
			'fy': '25%',
		})

	radialGradientOffset.selectAll('stop')
		.data(gradientColorOffsetStops).enter()
		.append('stop')
			.attr({
				'offset': function(d){ return d.stop },
			})
			.style({
				'stop-color': function(d){ return d.color }
			})

	var glowGradient = defs
		.append('svg:filter')
		    .attr({
		      'id': 'blur'
		    })
		.append('feGaussianBlur')
		    .attr({
		      'stdDeviation': 10
		    })

	var snowFlake = defs
		.append('svg:filter')
		    .attr({
		      'id': 'snow_flake'
		    })
		.append('feGaussianBlur')
		    .attr({
		      'stdDeviation': 5
		    })

}