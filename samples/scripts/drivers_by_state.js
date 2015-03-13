d3.tsv('data/us-state-names.tsv', function(tsv){
    tsv.forEach(function(d, i){
        names[d.name] = {
            'code': d.code,
            'id': d.id
        }
    })
})

d3.csv('data/bad-drivers/bad-drivers.csv', function(error, data){
    console.log('data: ', data)

    color.domain(d3.keys(data[0])
        .filter(function(key) {
            return key == 'State'
        })
    )

    var states = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {
                    state: d.State,
                    code: names[d.State].code,
                    premium: d['Car Insurance Premiums ($)']
                }
            })
        }
    })

    states = states[0].values

    x.domain(states.sort(function(a, b) {
        return d3.ascending(a.state, b.state);
    })
    .map(function(d) {
        return d.code;
    }))

    y.domain([0,
        d3.max(states, function(d) {
            return parseInt(d.premium)
        })
    ])

    // domain/range for colors
    var yMax = d3.max(states, function(d){
        return d.premium
    })
    var yMin = d3.min(states, function(d){
        return d.premium
    })
    var colorScale = d3.scale.linear()
        .domain([ 0, yMax ])
        .range([ d3.rgb(maroon).brighter(), d3.rgb(maroon).darker() ])

    vis_group.append('g')
        .attr({
            'class': 'x axis',
            'transform': 'translate(0,' + height + ')'
        })
        .call(xAxis)
            .append('text')
            .attr({
                'class': 'chart-label',
                'x': width/2,
                'y': margins.bottom
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
                'y': -40
            })
            .text('Insurance Premium ($)')

    var bars = vis_group.selectAll('.bar')
        .data(states)
            .enter().append('rect')
        .attr({
            'x': function(d){
                return x(d.code)
            },
            'y': function(d){
                return height
            },
            'width': x.rangeBand(),
            'height': function(d){
                return 0
            },
            'fill': function(d){
                return colorScale(d.premium)
            },
            'opacity': .8
        })

    bars.transition()
        .delay(function(d, i){
            return i * 4
        })
        .ease('cubic')
        .attr({
            'y': function(d){
                return y(d.premium)
            },
            'height': function(d){
                return height - y(d.premium)
            }
        })

})
