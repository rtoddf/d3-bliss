(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 5, right: 5, bottom: 5, left: 5},
		width = container_parent.width() - margins.left - margins.right,
		height = width - margins.top - margins.bottom,
		vis, vis_group, aspect,
		image = 'images/zquinto.jpg',
		strokeColor = 'rgb(255,255,255)',
		strokeWidth = 1

	var colorOne = d3.rgb(strokeColor) // d3_rgb object
	var colorTwo = d3.hsl(strokeColor) // d3_hsl object

	// .brighter(2)
	// .darker(2)
	// .toString()

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

	var photo_group = vis_group.append('g')
		.attr({ 
			'class': 'photo'
		})

	var grid_group = vis_group.append('g')
		.attr({
			'class': 'grid'
		})

	photo_group.append('image')
		.attr({
			'width': width,
			'height': height,
			'x': 0,
			'y': 0,
			'xlink:href': image,
		})

	var xAxisCoordData = d3.range(25, height, 25)
	var yAxisCoordData = d3.range(25, width, 25)

	grid_group.selectAll('line.horizontal')
		.data(xAxisCoordData)
			.enter().append('line')
		.attr({
			'x1': 0,
			'y1': function(d){
				return d
			},
			'x2': width,
			'y2': function(d){
				return d
			},
			'stroke': strokeColor,
			'stroke-width': strokeWidth,
			'class': 'horizontal',
			'opacity': 1
		})

	grid_group.selectAll('line.vertical')
		.data(yAxisCoordData)
			.enter().append('line')
		.attr({
			'x1': function(d){
				return d
			},
			'y1': 0,
			'x2': function(d){
				return d
			},
			'y2': height,
			'stroke': strokeColor,
			'stroke-width': strokeWidth,
			'class': 'vertical',
			'opacity': 1
		})

	photo_group.append('rect')
		.attr({
			'width': width,
			'height': height,
			'stroke': strokeColor,
			'stroke-width': 3,
			'fill': 'none'
		})

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()