var State = function(stats){
	this.stats = isDefined(stats)
	this.longName = isDefined(stats.state_name)
	this.shortName = isDefined(stats.short_name)
}

d3.json('data/state_labor_stats.json', function(error, response){
	var stats = []
	var year = 2014

	$.each(response, function(key, val){
		var lastestStats = val[year][val[year].length - 1]
		var state = new State(lastestStats)
		stats.push(state)
	})

	stats = _.sortBy(stats, function(a){
		return (a['longName']).split(' ')
	})

	$('.month').html(stats[0].stats.periodName)
	$('.year').html(stats[0].stats.year)

	x.domain(stats.sort(function(a, b) {
		return d3.ascending(a.shortName, b.shortName);
	})
	.map(function(d) {
		return d.shortName;
	}))

	y.domain([0, d3.max(stats, function(d) {
		return parseInt(d.stats.unemployment_percent) + 1
	})])

	var max_percentage = d3.max(stats, function(d){
		return d.stats.unemployment_percent
	})

	var min_percentage = d3.min(stats, function(d){
		return d.stats.unemployment_percent
	})

	vis_group.append('g')
		.attr({
			'class': 'x axis',
			'transform': 'translate(0,' + height + ')'
		})
		.call(xAxis)
			.append('text')
			.attr({
				'x': width/2,
				'y': margins.bottom,
                'class': 'chart-label'
			})
			.text('State')

	vis_group.append('g')
		.attr({
			'class': 'y axis'
		})
		.call(yAxis)
			.append('text')
			.attr({
                'class': 'chart-label',
				'transform': 'rotate(-90)',
				'x': -40,
				'y': -30
			})
			.text('Unemployment Rate %')

	var bars = vis_group.selectAll('.bar')
		.data(stats)
			.enter().append('rect')
		.attr({
            'x': function(d){
                return x(d.shortName)
            },
            'y': function(d){
                return height
            },
            'width': x.rangeBand(),
            'height': function(d){
                return 0
            },
			'fill': function(d){
				return 'rgb(126,126,126)'
			},
            'class': 'bar',
            'opacity': .6
		})

		bars.transition()
    		.delay(function(d, i){
    			return i * 4
    		})
    		.ease('cubic')
    		.attr({
    			'y': function(d){
    				return y(d.stats.unemployment_percent)
    			},
    			'height': function(d){
	    			return height - y(d.stats.unemployment_percent)
	    		}
	    	})
		
		bars.on('mouseover', function(d) {
			d3.select(this)
				.transition()
				.duration(200)
				.attr({
					'fill': 'rgb(126,126,126)',
					'opacity': 1,
				})
                .style({
                    'cursor': 'pointer'
                })

			d3.select('.tooltip')
                .html(function(){
                    return '<span>' + d.longName + ': ' + d.stats.unemployment_percent + '%</span>'
                })
    			.style({
                    'left': (d3.event.pageX + 15) + 'px',
                    'top': (d3.event.pageY) + 'px'
                })
                .transition()
                    .duration(200)
                    .attr({
                        'opacity': 1
                    })
		})

		bars.on('mouseout', function(d) {
			d3.select(this)
				.transition()
				.duration(200)
				.attr({
					'fill': function(d){
						return 'rgb(126,126,126)'
					},
					'opacity': .6,
				})
		})

		vis_group
			.on('mouseout', function(d){
				tooltip
					.attr({
						'opacity': 0
					})
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
			var x0 = x.domain(stats.sort(function(a, b) {
				return b.stats.unemployment_percent - a.stats.unemployment_percent;
			})
			.map(function(d) {
				return d.shortName;
			}))
			.copy()
		} else if(this.sort == 'asc'){
			var x0 = x.domain(stats.sort(function(a, b) {
				return a.stats.unemployment_percent - b.stats.unemployment_percent;
			})
			.map(function(d) {
				return d.shortName;
			}))
			.copy()
		} else if(this.sort == 'alpha_asc'){
			var x0 = x.domain(stats.sort(function(a, b) {
				return d3.ascending(a.shortName, b.shortName);
			})
			.map(function(d) {
				return d.shortName;
			}))
			.copy()
		} else{
			var x0 = x.domain(stats.sort(function(a, b) {
				return d3.descending(a.shortName, b.shortName);
			})
			.map(function(d) {
				return d.shortName;
			}))
			.copy()
		}

		var transition = vis_group.transition().duration(750),
			delay = function(d, i) {
				return i * 30;
			};

		transition.selectAll('.bar')
			.delay(delay)
			.ease('cubic')
			.attr('x', function(d) {
				return x0(d.shortName);
			});

		transition.select('.x.axis')
			.call(xAxis)
				.selectAll('g')
					.delay(delay);
	}
})
