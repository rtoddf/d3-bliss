// http://bl.ocks.org/mbostock/3884955

(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 80, bottom: 30, left: 50},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom,
		vis, vis_group, aspect

	var parseDate = d3.time.format('%Y%m%d').parse

	var xScale = d3.time.scale()
		.range([ 0, width ])

	var yScale = d3.scale.linear()
		.range([ height, 0 ])

	var color = d3.scale.category10()

	var xAxis = d3.svg.axis()
		.scale(xScale)
		.orient('bottom')

	var yAxis = d3.svg.axis()
		.scale(yScale)
		.orient('left')

	vis = d3.select('#example')
		.append('svg')
		.attr({
			'width': width + margins.left + margins.right,
			'height': height + margins.top + margins.bottom,
			'preserveAspectRatio': 'xMinYMid',
			'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
		})

	vis_group =  vis.append('g')
		.attr({
			'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
		})

	aspect = chart_container.width() / chart_container.height()

	d3.tsv('data/example04a.tsv', function(error, data){
		color.domain(d3.keys(data[0]).filter(function(key){
			return key !== 'date'
		}))

		data.forEach(function(d){
			d.date = parseDate(d.date)
		})

		var cities = color.domain().map(function(name){
			return {
				name: name,
				values: data.map(function(d){
					return {
						data: d.date,
						temperature: + d[name]
					}
				})
			}
		})

		xScale.domain(d3.extent(data, function(d){
			return d.date
		}))

		yScale.domain([
			d3.min(cities, function(c){
				return d3.min(c.values, function(v){
					return v.temperature
				})
			}),
			d3.max(cities, function(c){
				return d3.max(c.values, function(v){
					return v.temperature
				})
			})
		])

		vis_group.append('g')
			.attr({
				'class': 'x axis',
				'transform': 'translate(0, ' + height + ')'
			})
			.call(xAxis)

		vis_group.append('g')
			.attr({
				'class': 'y axis'
			})
			.call(yAxis)
				.append('text')
				.attr({
					'transform': 'rotate(-90)',
					'y': 6,
					'dy': '.71em'
				})
				.style({
					'text-anchor': 'end'
				})
				.text('Temperature (ºF)')

		var city = vis_group.selectAll('.city')
			.data(cities)
				.enter().append('g')
			.attr({
				'class': 'city'
			})

		city.append('text')
			.datum(function(d){
				return {
					name: d.name,
					value: d.values[d.values.length - 1]
				}
			})
			.attr({
				'transform': function(d){
					return 'translate(' + xScale(d.value.date) + ', ' + yScale(d.value.temperature) + ')'
				},
				'x': 3,
				'dy': '.35em'
			})
			.text(function(d){
				return d.name
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