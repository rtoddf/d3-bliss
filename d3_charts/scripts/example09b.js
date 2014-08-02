(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 20, right: 20, bottom: 20, left: 30},
		width = container_parent.width() - margins.left - margins.right,
		height = (width * 0.66) - margins.top - margins.bottom,
		vis, vis_group, aspect

	// var lineData

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

	var startLine
	var endLine

	var lineFunction = d3.svg.line()
		.x(function(d){ return d.x })
		.y(function(d){ return d.y })
		.interpolate('cardinal')

	d3.json('data/example09a.json', function(data){
		startLine = data
		setStuff()
	})

	d3.json('data/example09ab.json', function(data){
		endLine = data
	})

	function setStuff(){
		var line_graph = vis_group.append('path')
			.attr({
				'class': 'the_line',
				'd': lineFunction(startLine),
				'stroke': 'black',
				'stroke-width': 1,
				'fill': 'none'
			})
	}

	function animate(){
		var duration = 1500

		d3.selectAll('.the_line').transition()
			.duration(duration)
			.attr({
				'd': function(d){
					return lineFunction(endLine)
				}
			})
			.style({
				'stroke': '#003264'
			})
	}

	$('.animate').on('click', function(){
		animate(this)
	})

})()