(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 5, right: 5, bottom: 5, left: 5},
		width = container_parent.width() - margins.left - margins.right,
		height = width - margins.top - margins.bottom,
		vis, vis_group, aspect

	var color = d3.scale.category20b(),
		stroke_color = 'black',
		stroke_width = 4

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

	var rects = [
		{x: width * 0.00, y: height * 0.00, w: width * 0.33, h: height * 0.33},
		{x: width * 0.00, y: height * 0.33, w: width * 0.33, h: height * 0.33},
		{x: width * 0.00, y: height * 0.66, w: width * 0.33, h: height * 0.33},
		{x: width * 0.66, y: height * 0.00, w: width * 0.165, h: height * 0.165},
		{x: width * 0.825, y: height * 0.00, w: width * 0.165, h: height * 0.165},
		{x: width * 0.66, y: height * 0.165, w: width * 0.165, h: height * 0.160},
		{x: width * 0.825, y: height * 0.165, w: width * 0.165, h: height * 0.160},
		{x: width * 0.66, y: height * 0.325, w: width * 0.165, h: height * 0.165},
		{x: width * 0.825, y: height * 0.325, w: width * 0.165, h: height * 0.165},
		{x: width * 0.66, y: height * 0.49, w: width * 0.165, h: height * 0.17},
		{x: width * 0.825, y: height * 0.49, w: width * 0.165, h: height * 0.17},
		{x: width * 0.33, y: height * 0.00, w: width * 0.33, h: height * 0.66},
		{x: width * 0.33, y: height * 0.66, w: width * 0.66, h: height * 0.33} 
	]

	vis_group.selectAll('.rectangles')
		.data(rects)
			.enter().append('rect')
		.attr({
			'class': 'rectangles',
			'x': function(d, i){
				return d.x
			},
			'y': function(d, i){
				return d.y
			},
			'width': function(d, i){
				return d.w
			},
			'height': function(d, i){
				return d.h
			},
			'fill': function(d, i){
				return color(i)
			},
			'stroke-width': stroke_width,
			'stroke': stroke_color,
			'opacity': function(d, i){
				if(i % 2 !== 0){
					return .75
				} else {
					return 1
				}
			}
		})
		.on('mouseover', function(){
			var _this = d3.select(this)
			over(_this)
		})
		.on('mouseout', function(){
			var _this = d3.select(this)
			out(_this)
		})

	function over(t){
		t.attr({
			opacity: .5
		})
	}

	function out(t){
		t.attr({
			opacity: 1
		})
	}

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()