	var bars = vis.selectAll("rect")
		.data(data)
			.enter().append("rect")
		.attr({
			'x': function(d){
				var v = d.color[0].name
				console.log('v: ', v)
				return x1(d.color[0].name)
			},
			'y': function(d){
				return y(d[y_axis_columns])
			},
			'width': x1.rangeBand(),
			'height': function(d){
				return height - y(d[y_axis_columns])
			},
			'fill': function(d){
				return color(y(d[y_axis_columns]))
			}
		})x`