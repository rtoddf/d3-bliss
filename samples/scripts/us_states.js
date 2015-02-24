var tooltip = d3.select('body').append('div')
    .attr('class', 'tooltip')
    .style('opacity', 1e-6)

vis = d3.select('#chart').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()
var names = {}

d3.tsv('data/us-state-names.tsv', function(tsv){
    tsv.forEach(function(d, i){
        names[d.id] = {
            'name': d.name,
            'code': d.code
        }
    })
})

d3.json('data/us.json', function(error, topology){
    // draw the US boundaries
    // vis_group.append('path')
    //     .datum(topojson.feature(topology, topology.objects.land))
    //     .attr({
    //         'd': path,
    //         'fill': defaults.land.fill,
    //         'stroke': defaults.land.stroke
    //     })

    
    // draws the state shapes
    vis_group.selectAll('path')
            .data(topojson.feature(topology, topology.objects.states).features)
        .enter().append('path')
        .attr({
            'd': path,
            'fill': defaults.states.fill,
            'stroke': defaults.states.stroke,
            'strokeWidth': defaults.states.strokeWidth,
        })
        .style('cursor', 'pointer')
        .on('mouseover', function(d) {
            tooltip
                .html( '<span>' + names[d.id]['code'] + ': ' + names[d.id]['name'] + '</span>' )
                .style({
                    'left': (d3.event.pageX) + 'px',
                    'top': (d3.event.pageY - 28) + 'px'
                })
                .transition()
                    .duration(500)
                    .style('opacity', 1) 
        })
        .on('mouseout', function(d) {
            tooltip
                .transition()
                    .duration(200)
                    .style('opacity', 0) 
        })

    // draws just the state borders - doesn't double up
    // vis_group.append('path')
    //     .datum(topojson.mesh(topology, topology.objects.states, function(a, b){
    //         return a !== b
    //     }))
    //     .attr({
    //         'd': path,
    //         'fill': 'none',
    //         'stroke': defaults.states.stroke,
    //     })
})
