(function () {
	var container_parent = $('.display') ,
		chart_container = $('#example'),
		margins = {top: 30, right: 30, bottom: 30, left: 30},
		width = container_parent.width() - margins.left - margins.right,
		height = width - margins.top - margins.bottom,
		vis, vis_group, aspect

	var circle_fill = '#fd8d3c', rect_fill = "#000", rect_opacity = .3
		
	var circle_data = [ width / 2, height / 2, 120 ],
		polygon_data = [ [300, 200], [500, 200], [500, 350], [300, 350] ]

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

	var circle = vis_group.append('circle')
		.attr({
			'class': 'circle intersects'
		})
		.datum(circle_data)
		.call(positionCircle)
		.attr({
			'r': function(d){
				return d[2]
			}
		})

	var polygon = vis_group.append('g')
		.attr({
			'class': 'polygon'
		})
		.datum(polygon_data)

	polygon.append('path')
		.call(positionPath)

	polygon.selectAll('circle')
			.data(function(d){
				return d
			})
		.enter().append('circle')
		.call(positionCircle)
		.attr({
			'r': 4.5
		})
		.call(d3.behavior.drag()
			.origin(function(d){
				return {x: d[0], y: d[1]}
			})
			.on('drag', function(d){
				d[0] = d3.event.x, d[1] = d3.event.y
				d3.select(this).call(positionCircle)
				polygon.select('path').call(positionPath)
				circle.classed('intersects', intersects(circle.datum(), polygon.datum()))
			})
		)

	function positionCircle(circle){
		circle
			.attr({
				'cx': function(d){
					return d[0]
				},
				'cy': function(d){
					return d[1]
				}
			})
	}

	function positionPath(path){
		path
			.attr({
				'd': function(d){
					return 'M' + d.join('L') + 'Z'
				}
			})
	}

	function intersects(circle, polygon){
		return pointInPolygon(circle, polygon)
			|| polygonEdges(polygon).some(function(line){
				return pointLineSegmentDistance(circle, line) < circle[2]
			})
	}

	function polygonEdges(polygon){
		return polygon.map(function(p, i){
			return i ? [polygon[i - 1], p] : [polygon[polygon.length - 1], p]
		})
	}

	function pointInPolygon(point, polygon){
		for(var n = polygon.length, i = 0, j = n-1, x = point[0], y = point[1], inside = false; i < n; j = i++){
			var xi = polygon[i][0], yi = polygon[i][1]
			var xj = polygon[j][0], yj = polygon[j][1]
			if((yi < y ^ yj > y) && (x < (xj - xi) * (y - yi) / (yj - yi) + xi)) inside = !inside
		}
		return inside
	}

	function pointLineSegmentDistance(point, line){
		var v = line[0], w = line[1], d, t;
		return Math.sqrt(pointPointSquaredDistance(point, (d = pointPointSquaredDistance(v, w))
		? ((t = ((point[0] - v[0]) * (w[0] - v[0]) + (point[1] - v[1]) * (w[1] - v[1])) / d) < 0 ? v
		: t > 1 ? w
		: [v[0] + t * (w[0] - v[0]), v[1] + t * (w[1] - v[1])])
		: v));
	}

	function pointPointSquaredDistance(v, w){
		var dx = v[0] - w[0], dy = v[1] - w[1];
		return dx * dx + dy * dy;
	}

	$(window).on('resize', function() {
		var targetWidth = container_parent.width()
		vis.attr({
			'width': targetWidth,
			'height': Math.round(targetWidth / aspect)
		})
	})

})()