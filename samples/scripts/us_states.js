vis = d3.select('#chart').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

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

    // draws just the state borders - doesn't double up
    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.states, function(a, b){
            return a !== b
        }))
        .attr({
            'd': path,
            'fill': 'none',
            'stroke': defaults.states.stroke,
        })
})
