var container_parent = $('.display') ,
    chart_container = $('#map'),
    margins = {top: 20, right: 20, bottom: 20, left: 20},
    width = container_parent.width() - margins.left - margins.right,
    height = width,
    vis, vis_group, aspect,
    translate = [ width/2, height/2 ]

var defaults = {
    colors: {
        none: 'none',
        land: '#baba71',
        water: 'rgba(87,146,174,.5)',
        stroke: '#333',
        strokeWidth: .5,
        strokeOpacity: .5
    }
}

var projection = d3.geo.orthographic()
    .scale(255)
    .rotate([-270, 0])
    .translate(translate)
    .clipAngle(90)
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

vis_group
    .append('defs')
        .append('path')
            .datum({
                type: 'Sphere'
            })
            .attr({
                'id': 'sphere',
                'd': path
            })

vis_group.append('use')
    .attr({
        'xlink:href': '#sphere',
        'fill': defaults.colors.water
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

d3.json('../data/world-50m.json', function(error, topology){
    var countries = topojson.feature(topology, topology.objects.countries).features,
        neighbors = topojson.neighbors(topology.objects.countries.geometries)

    vis_group.selectAll('path')
        .data(countries)
            .enter().append('path')
        .attr({
            'd': path,
            'fill': defaults.colors.land
        })

    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.countries), function(a, b){
            return a !== b
        })
        .attr({
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
