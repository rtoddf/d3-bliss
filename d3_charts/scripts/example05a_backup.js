var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.8) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	radius = Math.min(width, height) / 2.5

var color = d3.scale.ordinal()
	.range(['#b024e4', '#6420c1', '#c78721', '#003264', '#8a0600', '#baba71', '#666666'])

var duration = 300,
	easeType = 'back'
	scale = 1,
	opacity = 1,
	opacityAmount = .5,
	scaleAmount = 1.3,
	diffFromCenter = radius / 20

var arc = d3.svg.arc()
	.outerRadius(radius)
	.innerRadius(radius - 100)

var vis = d3.select('#example').append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})

vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + (width/2 + margins.left) + ', ' + (height/2 + margins.top) + ')'
	})

aspect = chart_container.width() / chart_container.height();

(function () {
	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d){
			return d.population
		})

	d3.json('data/example05a.json', function(error, data){
		var datum = data.datum

		datum.forEach(function(d){
			d.population = +d.population
		})

		var g = vis_group.selectAll('.arc')
			.data(pie(datum))
				.enter().append('g')
			.attr({
				'class': 'arc'
			})

		g.append('path')
			.attr({
				'd': arc,
				'fill': function(d){
					return color(d.data.age)
				}
			})
			.style({
				'opacity': opacity
			})

		var total = d3.sum(pie(datum), function(d){
            return d.value;
        });

		g.on('mouseover', function(){
			console.log(this)
			var bardiv = d3.select(this)
			d3.select(this).call(over, bardiv)
		})			

			
				

			// vis_group.append('text')
			// 	.attr({
			// 		'class': 'percentage',
			// 		'x': radius / 20,
			// 		'y': radius / 20 + 10,
			// 		'text-anchor': 'middle',
			// 		'font-size': radius / 3
			// 	})
			// 	.text(function(t){
			// 		console.log('d: ', d)
			// 		// console.log(total)
			// 		return ((d.data.population/total) * 100).toFixed(0) + '%'
			// 	})
		// })

		g.on('mouseout', out)

		g.append('text')
			.attr({
				'class': 'pie_label',
				'dy': '.35em',
				'transform': function(d) {
                    var c = arc.centroid(d),
                    x = c[0],
                    y = c[1],
                    // pythagorean theorem for hypotenuse
                    h = Math.sqrt(x*x + y*y)
                    return 'translate(' + (x/h * (radius - radius/5)) +  ',' + (y/h * (radius - radius/5)) +  ')'
                },
                'text-anchor': function(d) {
	                // are we past the center?
	                return (d.endAngle + d.startAngle) / 2 > Math.PI ? 'middle' : 'middle';
                },
                'fill': function(d){
					return 'black'
				}
			})
			.text(function(d){
				return d.data.age
			})
			.style({
				'fill': '#fff',
				'opacity': 0
			})

		// var percent = vis_group.selectAll('text')
		// 	.data(pie(datum))
		// 		.enter().append('text')
		// 	.attr({
		// 		'class': 'precentage',
		// 		'x': radius / 20,
		// 		'y': radius / 20 + 10,
		// 		'text-anchor': 'middle',
		// 		'font-size': radius / 3
		// 	})
		// 	.text(function(d){
		// 		console.log(d.value)
		// 		console.log(total)
		// 		return ((d.value/total) * 100).toFixed(0) + '%'
		// 	})
	})

})()

var over = function(pie_label){
	console.log('pie_label: ', pie_label)
	d3.selectAll('.arc')
		.transition()
			.duration(duration)
			.ease(easeType)
			.attr({
				'transform': function(d) {
					var c = arc.centroid(d),
					x = c[0],
					y = c[1],
					// pythagorean theorem for hypotenuse
					h = Math.sqrt(x*x + y*y)
					return 'translate(' + (x/h * diffFromCenter) +  ',' + (y/h * diffFromCenter) +  ') scale(' + scaleAmount + ')'
				}
			})
			.style({
				'opacity': opacityAmount	
			})

	d3.selectAll('text')
		.transition()
		.duration(duration)
		.ease(easeType)
		.style({
			'opacity': opacity
		})
}

var out = function(){
	d3.selectAll('.arc')
		.transition()
			.duration(duration)
			.attr({
				'transform': 'translate(0, 0) scale(' + scale + ')'
			})
			.style({
				'opacity': opacity
			})

	d3.select('.percentage').remove()

	d3.selectAll('text')
		.transition()
		.duration(duration)
		.ease(easeType)
		.style({
			'opacity': 0
		})
}

$(window).on('resize', function() {
	var targetWidth = container_parent.width()
	vis.attr({
		'width': targetWidth,
		'height': Math.round(targetWidth / aspect)
	})
})