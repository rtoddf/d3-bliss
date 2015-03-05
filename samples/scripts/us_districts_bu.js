vis = d3.select('#map').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
aspect = chart_container.width() / chart_container.height()

queue()
    .defer(d3.json, 'data/us.json')
    .defer(d3.json, 'data/us-congress-113.json')
    .await(ready);

function ready(error, topology, congress) {
    if (error) return console.error(error);

    var geometryCollection = congress.objects.districts,
        featureCollection = topojson.feature(congress, geometryCollection),
        features = featureCollection.features,
        neighbors = topojson.neighbors(geometryCollection.geometries);

    features.forEach(function(feature, i) {
        feature.centroid = path.centroid(feature);
        if (feature.centroid.some(isNaN)) feature.centroid = null; // off the map
        feature.neighbors = feature.centroid ? neighbors[i]
            .filter(function(j) {
                return j < i && features[j].centroid;
            })
            .map(function(j) {
                return features[j];
            }) : [];
    });

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
    // vis_group.append('path')
    //     .datum(topojson.mesh(topology, topology.objects.states, function(a, b){
    //         return a !== b
    //     }))
    //     .attr({
    //         'd': path,
    //         'fill': 'none',
    //         'stroke': defaults.states.stroke
    //     })

    // draw the district boundaries
    vis_group.append('path')
        .datum(topojson.mesh(congress, geometryCollection, function(a, b) {
            return a !== b
        }))
        .attr({
            'd': path,
            'fill': 'none',
            'stroke': defaults.districts.stroke,
            'stroke-width': defaults.districts.strokeWidth
        })
}

d3.select(self.frameElement).style('height', height + 'px');
