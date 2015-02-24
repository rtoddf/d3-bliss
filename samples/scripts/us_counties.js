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
    vis_group.append('path')
        .datum(topojson.feature(topology, topology.objects.land))
        .attr({
            'd': path,
            'fill': defaults.land.fill,
            'stroke': defaults.land.stroke,
            'stroke-width': defaults.land.strokeWidth
        })

    // draws the state outlines
    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.states, function(a, b){
            return a !== b
        }))
        .attr({
            'd': path,
            'fill': 'none',
            'stroke': defaults.states.stroke,
        })

    // draws the county borders
    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.counties, function(a, b){
            return a !== b && !(a.id / 1000 ^ b.id / 1000)
        }))
        .attr({
            'd': path,
            'fill': 'none',
            'stroke': defaults.counties.stroke,
            'stroke-width': defaults.counties.strokeWidth
        })
})
