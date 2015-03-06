var container_parent = $('.display'),
    chart_container = $('#chart'),
    margins = {top: 20, right: 20, bottom: 40, left: 40},
    width = container_parent.width() - margins.left - margins.right,
    height = (width * 0.3) - margins.top - margins.bottom,
    vis, vis_group, aspect

var color = d3.scale.category10();

var names = {}

var x = d3.scale.ordinal()
    .rangeRoundBands([0, width], .1)

var y = d3.scale.linear()
    .range([height, 0])

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom')

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left')
    .tickSize(-width)
    // .tickFormat(formatPercent)

vis = d3.select('#chart').append('svg')
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

d3.tsv('data/us-state-names.tsv', function(tsv){
    tsv.forEach(function(d, i){
        names[d.id] = {
            'name': d.name,
            'code': d.code
        }
    })
})

d3.csv('data/bad-drivers/bad-drivers.csv', function(error, data){
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
                    code: d.Code,
                    id: d.ID,
                    premium: d['Car Insurance Premiums ($)']
                }
            })
        }
    })

    states = states[0].values

    console.log(states)

    x.domain(states.sort(function(a, b) {
        return d3.ascending(a.state, b.state);
    })
    .map(function(d) {
        // console.log('d: ', names[d.state].code)
        return d.code;
    }))

    y.domain([0,
        // d3.min(states, function(d) {
        //     return parseInt(d.premium)
        // }),
        d3.max(states, function(d) {
            return parseInt(d.premium)
        })
    ])

    vis_group.append('g')
        .attr({
            'class': 'x axis',
            'transform': 'translate(0,' + height + ')'
        })
        .call(xAxis)
            .append('text')
            .attr({
                'x': width/2,
                'y': margins.bottom
            })
            .style({
                'fill': 'rgba(0,0,0,.6)',
                'text-anchor': 'middle',
                'font-size': '12px',
                'font-weight': 'bold'
            })
            .text('State')

    vis_group.append('g')
        .attr({
            'class': 'y axis'
        })
        .call(yAxis)
            .append('text')
            .attr({
                'transform': 'rotate(-90)',
                'x': -40,
                'y': -30
            })
            .style({
                'fill': 'rgba(0,0,0,.6)',
                'text-anchor': 'end',
                'font-size': '12px',
                'font-weight': 'bold'
            })
            .text('Insurance Premium ($)')

    var bars = vis_group.selectAll('.bar')
        .data(states)
            .enter().append('rect')
        .attr({
            'class': 'bar',
            'fill': function(d){
                if(d.premium > 1200){
                    return 'red'
                } else if (d.premium > 1000 && d.premium <= 1200){
                    return 'orange'
                } else if (d.premium > 800 && d.premium <= 1000){
                    return 'yellow'
                } else {
                    return 'green'
                }
                
            },
            'opacity': .6,
            'x': function(d){
                return x(d.code)
            },
            'width': x.rangeBand(),
            'y': function(d){
                return height
            },
            'height': function(d){
                return 0
            }
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
