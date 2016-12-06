var container_parent = $('.display') ,
    chart_container = $('#map'),
    margins = {top: 0, right: 0, bottom: 0, left: 0},
    width = container_parent.width() - margins.left - margins.right,
    height = (width * 0.5) - margins.top - margins.bottom,
    vis, vis_group, aspect

var defaults = {
    colors: {
        none: 'none',
        land: '#baba71',
        water: '#a8e1f8',
        stroke: '#333',
        strokeWidth: .5,
        strokeOpacity: .5
    }
}

var projection = d3.geo.equirectangular()
    .scale(153)
    .translate([ width / 2, height / 2 ])
    .precision(.1)

var path = d3.geo.path()
    .projection(projection)

var graticule = d3.geo.graticule()

vis = d3.select('#map').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')

aspect = chart_container.width() / chart_container.height()

d3.json('../data/world-50m.json', function(error, topology){
    vis_group.append('rect')
        .attr({
            'width': width - margins.left - margins.right,
            'height': height,
            'fill': defaults.colors.water
        })

    vis_group.append('path')
        .datum(topojson.feature(topology, topology.objects.land))
        .attr({
            'd': path,
            'fill': defaults.colors.land
        })

    vis_group.append('path')
        .datum(graticule)
        .attr({
            'd': path,
            'fill': defaults.colors.none,
            'stroke': defaults.colors.stroke,
            'stroke-width': defaults.colors.strokeWidth,
            'stroke-opacity': defaults.colors.strokeOpacity
        })

    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.countries))
        .attr({
            // 'class': 'boundary',
            'd': path,
            'stroke': defaults.colors.stroke,
            'stroke-width': defaults.colors.strokeWidth,
            'fill': defaults.colors.none
        })
})

$(window).on('resize', function() {
    var targetWidth = container_parent.width()
    vis.attr({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})
