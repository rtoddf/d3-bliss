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

d3.json('data/us.json', function(error, topology){
    // draw the US boundaries
    vis_group.append('path')
        .datum(topojson.feature(topology, topology.objects.land))
        .attr({
            'd': path,
            'fill': defaults.land.fill,
            'stroke': defaults.land.stroke
        })
})
