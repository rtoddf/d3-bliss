var container_parent = $('.display'),
	chart_container = $('#comic_characters'),
	margins = {top: 20, right: 50, bottom: 40, left: 50},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.5) - margins.top - margins.bottom,
	vis, vis_group, aspect

vis = d3.select('#comic_characters').append('svg')
	.attr({
		'width': width + margins.left + margins.right,
		'height': height + margins.top + margins.bottom,
		'class': 'chart',
		'preserveAspectRatio': 'xMinYMid',
		'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
	})

vis_group = vis.append('g')
	.attr({
		'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
	})

aspect = chart_container.width() / chart_container.height()


d3.csv('data/comic-characters/marvel-wikia-data.csv', function(error, data){
	console.log('data: ', data)
})