// http://bl.ocks.org/KoGor/5994804

var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.7) - margins.top - margins.bottom,
	vis, vis_group, aspect

var sens = 0.25, focused

var defaults = {
	water: {
		fill: 'rgba(0,32,64,.25)'
	}
}

var projection = d3.geo.orthographic()
	.scale(175)
	.rotate([ 0, 0 ])
	.translate([ width/2, height/2 ])
	.clipAngle(90)

var path = d3.geo.path()
	.projection(projection)

vis = d3.select('#example').append('svg')
	.attr({
		'width': width,
		'height': height,
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width) + ' ' + (height)
	})

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

vis_group.append('path')
	.datum({
		type: 'Sphere'
	})
	.attr({
		'd': path,
		'fill': defaults.water.fill
	})

var tooltip = d3.select('body').append('div')
	.attr({	'class': 'tooltip' })

countryList = d3.select('#countries').append('select')
	.attr({
		'name': 'countries'
	})

function country(){
	var select = countryList[0][0]
	var option_user_selection = select.options[select.selectedIndex].text
	var option_user_value = select.options[select.selectedIndex].value

	var filtered = _(countries).find(function(s){
		if(s.id == option_user_value){
			return s
		}
	})
	return filtered
}

queue()
	.defer(d3.json, '../data/world-110m.json')
	.defer(d3.tsv, '../data/world-110m-country-names.tsv')
	.await(ready)

function ready(error, world, countryData){
	var countryById = {}
	countries = topojson.feature(world, world.objects.countries).features

	countryData.forEach(function(d){
		countryById[d.id] = d.name
		option = countryList.append('option')
		option.text(d.name)
		option.property('value', d.id)
	})

	countries.map(function(d){
		d.name = countryById[d.id]
	})

	console.log('countries: ', countries)

	var world = vis_group.selectAll('path.land')
		.data(countries)
			.enter().append('path')
		.attr({
			'd': path,
			'class': 'land'
		})

	.call(d3.behavior.drag()
		.origin(function(){
			var r = projection.rotate()
			return {
				x: r[0]/sens,
				y: -r[1]/sens
			}
		})
		.on('drag', function(){
			var rotate = projection.rotate()
			projection.rotate([ d3.event.x * sens, -d3.event.y * sens, rotate[2] ])
			vis_group.selectAll('path.land')
				.attr({
					'd': path
				})
			vis_group.selectAll('.focused')
				.classed({
					'focused': focused = false
				})
		}))
	.on('mouseover', function(d){
		// focusedCountry = country(countries, countryById[d.id])
		// console.log(countryById[d.id])
		tooltip.text(function(){
			return d.name
		})
		.style({
			'left': (d3.event.pageX + 7) + 'px',
			'top': (d3.event.pageY -15) + 'px',
			'display': 'block',
			'opacity': 1
		})
	})
	.on('mouseout', function(d){
		tooltip.style({
			'display': 'none',
			'opacity': 0
		})
	})
	.on('mousemove', function(d){
		tooltip
			.style({
				'left': (d3.event.pageX + 7) + 'px',
				'top': (d3.event.pageY -15) + 'px'
			})
	})
	.on('click', function(d){
		console.log('d: ', d)
		// tooltip
		// 	.style({
		// 		'left': (d3.event.pageX + 7) + 'px',
		// 		'top': (d3.event.pageY -15) + 'px'
		// 	})
	})

	d3.select('select')
		.on('change', function(){
			var rotate = projection.rotate(),
			focusedCountry = country(),
			p = d3.geo.centroid(focusedCountry)

			vis_group.selectAll('.focused')
				.classed({
					'focused': focused = false
				});

			(function transition(){
				d3.transition()
					.duration(2500)
					.tween('rotate', function(){
						var r = d3.interpolate(projection.rotate(), [ -p[0], -p[1] ])
						return function(t){
							projection.rotate(r(t))
							vis_group.selectAll('path')
								.attr({
									'd': path
								})
								.classed('focused', function(d, i){
									return d.id == focusedCountry.id ? focused = d : false
								})
						}
					})
			})()

		})
}