(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 40, bottom: 30, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.70) - margins.top - margins.bottom,
		barWidth  = Math.floor(width / 19) - 1,
		vis, vis_group, aspect

	var x = d3.scale.linear()
		.range([ barWidth / 2, width - barWidth / 2 ])

	var y = d3.scale.linear()
		.range([ height, 0 ])

	var yAxis = d3.svg.axis()
		.scale(y)
		.orient('right')
		.tickSize(-width)
		.tickFormat(function(d){
			return Math.round(d / 1e6) + 'M'
		})

	vis = d3.select('#example').append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})
		
	vis_group = vis.append('g')
			.attr({
				'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
			})

	aspect = chart_container.width() / chart_container.height()

	// A sliding container to hold the bars by birthyear.
	var birthyears = vis_group.append('g')
		.attr({
			'class': 'birthyears'
		})

	// Title - current year
	var title = vis_group.append('text')
		.attr({
			'class': 'title',
			'dy': '.71em'
		})
		.text(2000)

	d3.csv('data/example01h.csv', function(error, data){
		// console.log(data)

		data.forEach(function(d){
			d.people = +d.people
		    d.year = +d.year
		    d.age = +d.age
		})

		//compute the extent of the data set in age and years
		var age1 = d3.max(data, function(d){
				return d.age
			}),
			year0 = d3.min(data, function(d){
				return d.year
			}),
			year1 = d3.max(data, function(d){
				return d.year
			}),
			year = year1

		// update the scale domains
		x.domain([ year1 - age1, year1 ])
		y.domain([ 0, d3.max(data, function(d){
			return d.people
		})])

		// produce a map from year and birthyear to [male, female]
		data = d3.nest()
			.key(function(d){
				return d.year
			})
			.key(function(d){
				return d.year - d.age
			})
			.rollup(function(v){
				return v.map(function(d){
					return d.people
				})
			})
			.map(data)

		console.log('mapped data: ', data)

		// add an axis to show the population values
		vis.append('g')
			.attr({
				'class': 'y axis',
				'transform': 'translate(' + width + ', 0)'
			})
			.call(yAxis)
			.filter(function(value){
				return !value
			})
				.classed('zero', true)

		// add labled rects for each birthyear (so that no enter or exit is required)
		var birthyear = birthyears.selectAll('.birthyear')
			.data(function(d){
				console.log('range: ', d3.range(year0 - age1, year1 + 1, 5))
				return d3.range(year0 - age1, year1 + 1, 5)
			})
				.enter().append('g')
			.attr({
				'class': 'birthyear',
				'transform': function(birthyear){
					return 'translate(' + x(birthyear) + ', 0)'
				}
			})

		birthyear.selectAll('rect')
			.data(function(birthyear){
				return data[year][birthyear] || [0, 0]
			})
				.enter().append('rect')
			.attr({
				'x': -barWidth /2,
				'width': barWidth,
				'y': y,
				'height': function(value){
					return height - y(value)
				}
			})

		// add labels to show birthyear
		birthyear.append('text')
			.attr({
				'y': height - 4
			})
			.text(function(birthyear){
				return birthyear
			})








	})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})
	
})()