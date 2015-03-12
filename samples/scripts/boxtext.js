// http://bl.ocks.org/mbostock/7341714
// http://www.d3noob.org/2013/02/update-d3js-data-dynamically.html
// http://strongriley.github.io/d3/tutorial/bar-2.html
// http://bost.ocks.org/mike/path/
// http://pothibo.com/2013/09/d3-js-how-to-handle-dynamic-json-data/

// WORDCLOUD: http://www.brettdangerfield.com/post/realtime_data_tag_cloud/

var container_parent = $('.display') ,
    chart_container = $('#stuff'),
    margins = {top: 0, right: 20, bottom: 20, left: 0},
    width = container_parent.width(),
    height = (width * .6),
    vis, vis_group, aspect

vis = d3.select('#stuff').append('svg')
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

var color = d3.scale.ordinal()
    .domain(["foo", "bar"])
    .range(["#000","#333"]);

var barHeight = 40

d3.json('data/boxtext.json', function(error, data){
	console.log('data: ', data)

	var bar = vis_group.selectAll('g')
			.data(data)
		.enter().append('g')
      		.attr({
      			'transform': function(d, i) {
	      			return 'translate(0,' + i * barHeight + ')'
	      		}
	      	})

	bar.append('rect')
		.attr({
			'width': width,
			'height': 40,
			'fill': function(d){
                return color(d.i)
            },
			'opacity': .5
		})

	bar.append('text')
		.attr({
			'x': 20,
			'y': barHeight / 2,
			'dy': '.35em',
			'font-size': 18,
			'fill': '#fff'
		})
		.text(function(d) {
			return d.visitors
		})

	bar.append('text')
		.attr({
			'x': 80,
			'y': barHeight / 2,
			'dy': '.35em',
			'font-size': 18,
			'fill': '#fff'
		})
		.text(function(d) {
			return d.i
		})
})