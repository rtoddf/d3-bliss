(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 20},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.8) - margins.top - margins.bottom,
		vis, vis_group, aspect

	var padding = 10,
		radius = 74

	var color = d3.scale.category20b()

	var arc = d3.svg.arc()
		.outerRadius(radius)
		.innerRadius(radius - 30)

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d){
			return d.population
		})

	d3.csv('data/example05d.csv', function(error, data){
		color.domain(d3.keys(data[0]).filter(function(key){
			return key !== 'State'
		}))

		data.forEach(function(d){
			d.ages = color.domain().map(function(name){
				return {
					name: name,
					population: +d[name]
				}
			})
		})

		vis = d3.select('#example').selectAll('pie')
			.data(data)
				.enter().append('svg')
			.attr({
				'class': 'pie',
				'width': radius * 2,
				'height': radius * 2
			})
			
		vis_group = vis.append('g')
			.attr({
				'transform': 'translate(' + radius + ', ' + radius + ')'
			})

		aspect = chart_container.width() / chart_container.height()

		vis_group.selectAll('.arc')
			.data(function(d){
				return pie(d.ages)
			})
				.enter().append('path')
			.attr({
				'class': 'arc',
				'd': arc,
				'fill': function(d){
					return color(d.data.name)
				}
			})

		vis_group.append('text')
			.attr({
				'class': 'pie_label',
				'dy': '.35em',
				'text-anchor': 'middle'
			})
			.text(function(d){
				return d.State
			})
	})

	// $(window).on('resize', function() {
	// 	var targetWidth = container_parent.width()
	// 	vis.attr({
	// 		'width': targetWidth,
	// 		'height': Math.round(targetWidth / aspect)
	// 	})
	// })

})()