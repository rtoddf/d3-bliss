var container_parent = $('.display') ,
	chart_container = $('#chart'),
	margins = {top: 0, right: 0, bottom: 0, left: 0},
	width = container_parent.width() - margins.left - margins.right,
	height = (width) - margins.top - margins.bottom,
	color = d3.scale.category20c(),
	vis, vis_group, aspect

var x = d3.scale.linear()
	.range([ 0, width ])

var y = d3.scale.ordinal()
	.rangeRoundBands([ 0, height], .1)

vis = d3.select('#chart').append('svg')
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

d3.json('data/us_census.json', function(error, data){
	console.log(data)

	x.domain([ 0, d3.max(data, function(d){
		return parseInt(d.pop)
	})])

    y.domain(data.sort(function(a, b) {
        return d3.descending(a.pop, b.pop);
    })
    .map(function(d) {
        return d.placename;
    }))

    var bar = vis_group.selectAll('.bar')
			.data(data)
		.enter().append('g')
			.attr({
				'class': 'bar',
				'transform': function(d, i) {
					return 'translate(0,' + y(d.placename) + ')';
				}
			})

	bar.append('rect')
		.attr({
			'height': y.rangeBand(),
			'width': width,
			'fill': 'orange'
		})

	bar.append('text')
		.attr({
			'text-anchor': 'end',
			'x': width - 30,
			'y': y.rangeBand() / 2,
			'dy': '.35em',
			'fill': 'white'
		})
		.text(function(d){
			console.log(d)
			return d.pop
		})

	$('button').on('click', function(){
        var sort = $(this).data('sort')
        d3.select(this)
            .property('sort', sort)
            .each(change)
    })

    function change() {
        // Copy-on-write since tweens are evaluated after a delay.
        if(this.sort == 'desc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.descending(a.pop, b.pop);
            })
            .map(function(d) {
                return d.placename;
            }))
            .copy()
        } else if(this.sort == 'asc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.ascending(a.pop, b.pop);
            })
            .map(function(d) {
                return d.placename;
            }))
            .copy()
        } else if(this.sort == 'alpha_asc'){
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.ascending(a.placename, b.placename);
            })
            .map(function(d) {
                return d.placename;
            }))
            .copy()
        } else{
            var y0 = y.domain(data.sort(function(a, b) {
                return d3.descending(a.placename, b.placename);
            })
            .map(function(d) {
                return d.placename;
            }))
            .copy()
        }

        var transition = vis_group
        	.transition()
        	.duration(750),
            delay = function(d, i) {
                return i * 30;
            };

        transition.selectAll('.bar')
            .delay(delay)
            .ease('cubic')
            .attr({
            	'transform': function(d, i) {
					return 'translate(0,' + y(d.placename) + ')';
				}
			});

        // this works
        // transition.select('.y.axis')
        //     .call(yAxis)
        //         .selectAll('g')
        //             .delay(delay);
    }

})












