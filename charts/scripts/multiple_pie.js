var container_parent = $('.display') ,
    chart_container = $('#chart'),
    width = container_parent.width(),
    height = width,
    vis, vis_group, aspect

var padding = 10,
    radius = (width / 5) / 2

var color = d3.scale.category20b()

var arc = d3.svg.arc()
    .outerRadius(radius)
    .innerRadius(radius - 50)

var pie = d3.layout.pie()
    .sort(null)
    .value(function(d){
        return d.population
    })

var tooltip = d3.select('body').append('div')
    .attr({
        'class': 'tooltip',
        'opacity': 1e-6
    })

d3.csv('data/states_by_age.csv', function(error, data){
    console.log('data csv: ', data)
    var ageNames = d3.keys(data[0]).filter(function(key){
        return key!== 'State'
    })

    color.domain(d3.keys(data[0]).filter(function(key){
        return key !== 'State'
    }))

    data.forEach(function(d){
        d.ages = color.domain().map(function(name){
            return {
                name: name,
                population: +d[name]
            }
        })
        d.state = d.State
    })

    vis = d3.select('#chart').selectAll('pie')
        .data(data)
            .enter().append('svg')
        .attr({
            'class': 'pie',
            'width': radius * 2,
            'height': radius * 2
        })
        
    vis_group = vis.append('g')
        .attr({
            'class': 'vis_group',
            'transform': 'translate(' + radius + ', ' + radius + ') scale(.9)'
        })

    aspect = chart_container.width() / chart_container.height()

    vis_group.selectAll('.arc')
        .data(function(d){
            return pie(d.ages)
        })
            .enter().append('path')
        .attr({
            'class': 'arc',
            'd': arc,
            'fill': function(d){
                return color(d.data.name)
            }
        })
        .on('mouseover', user_interaction)
        .on('mouseout', user_interaction)

    vis_group.append('text')
        .attr({
            'class': 'pie_label',
            'dy': '.35em',
            'text-anchor': 'middle'
        })
        .text(function(d){
            return d.State
        })

    // legend
    var legend = d3.select('#chart').selectAll('.legend')
        .data(ageNames.slice().reverse())
            .enter().append('svg')
        .attr({
            'class': 'legend',
            'width': width / 7,
            'height': 25,
            'transform': function(d, i){
                return 'translate(0, ' + (i * 20) + ')'
            }
        })

    legend.append('rect')
        .attr({
            'width': 18,
            'height': 18,
            'fill': color
        })

    legend.append('text')
        .attr({
            'width': 180,
            'x': 24,
            'y': 9,
            'dy': '.35em',
            // 'text-anchor': 'end'
        })
        .text(function(d){
            return d
        })

})

function user_interaction(d){
    var tooltip_opacity = d3.event.type == 'mouseover' ? 1 : 0
    var stroke_width = d3.event.type == 'mouseover' ? 1 : 0

    d3.select(this)
        .transition()
            .duration(200)
            .attr({
                'stroke': 'black',
                'stroke-width': stroke_width
            })
        .style({
            'cursor': 'pointer'
        })

    d3.select('.tooltip')
        .html(function(){
            return '<span>' + d.value + '</span>'
        })
        .style({
            'left': (d3.event.pageX) + 'px',
            'top': (d3.event.pageY - 28) + 'px'
        })
        .transition()
            .duration(200)
            .style({
                'opacity': tooltip_opacity
            })
}
