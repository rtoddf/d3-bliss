// http://bl.ocks.org/KoGor/5994804

var container_parent = $('.display') ,
	chart_container = $('#example'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.7) - margins.top - margins.bottom,
	vis, vis_group, aspect

var sens = 0.25,
	focused

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
	.attr({
		'class': 'tooltip'
	})

var countryList = d3.select('#countries').append('select')
	.attr({
		'name': 'countries'
	})

queue()
	.defer(d3.json, '../data/world-110m.json')
	.defer(d3.tsv, '../data/world-110m-country-names.tsv')
	.await(ready)

function ready(error, world, countryData){
	console.log('world: ', world)
	console.log('countryData: ', countryData)

	var countryById = {}

	countryData.forEach(function(d){
		countryById[d.id] = d.name
		option = countryList.append('option')
		option.text(d.name)
		option.property('value', d.id)
	})
}



















