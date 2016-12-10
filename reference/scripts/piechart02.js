(function () {
	var apiBase = 'http://api.usatoday.com/open/',
		api = 'census/',
		apiType = 'rac',
		sumlevid = '&sumlevid=2',
		apiKey = '&api_key=cnuurrmbcaya2snguar74zkv',
		callback = '&callback=?',
		keypat = '?keypat=GA'

	// var searchString = apiBase + api + apiType + keypat + sumlevid + apiKey + callback

	// d3.json(searchString, function(error, data){
	// 	console.log(data)
	// })

	// set global vars
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 0, right: 20, bottom: 0, left: 20},
		width = (container_parent.width() / 2) - margins.left - margins.right,
		height = width - margins.top - margins.bottom,
		vis, vis_group, aspect, legend,
		radius = Math.min(width, height) / 2

	var color = d3.scale.category20()

	var arc = d3.svg.arc()
		.outerRadius(radius - 10)
		.innerRadius(0)

	var pie = d3.layout.pie()
		.sort(null)
		.value(function(d){
			return d.percentage
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
			'transform': 'translate(' + (width/2 + margins.left) + ', ' + (height/2 + margins.top) + ')'
		})

	legend = d3.select('#legend').append('div')

	aspect = chart_container.width() / chart_container.height()

	d3.json('data/example05b.json', function(error, data){
		var data = data.datum

		data.forEach(function(d){
			d.percentage = +d.percentage
		})

		var g = vis_group.selectAll('.arc')
			.data(pie(data))
				.enter().append('g')
			.attr({
				'class': 'arc'
			})

		g.append('path')
			.attr({
				'd': arc,
				'fill': function(d){
					return color(d.data.race)
				}
			})

		drawLegend(data)

	})

	function drawLegend(data){
		var total = d3.sum(data, function(d){
			return d['percentage']
		})		

		var result = legend.selectAll('div')
			.data(data)
				.enter().append('div')
			.attr({
				'class': function(d, i){
					return 'legend-result p' + i
				}
			})

		result.append('span')
			.attr({
				'class': 'legend_box'				
			})
			.style({
				'background-color': function(d){
					return color(d.race)
				}
			})

		result.append('span')
			.attr({
				'class': 'race'
			})
			.text(function(d) {
				return d.race
			})
			.style({
				'color': function(d){
					return color(d.race)
				}
			})

		result.append('span')
			.attr({
				'class': 'percentage'
			})
			.text(function(d) {
				return ((d['percentage']/total) * 100).toFixed(2) + '%'
			})
			.style({
				'color': function(d){
					return color(d.race)
				}
			})
	}

	$(window).on('resize', function() {
		var targetWidth = width
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()