vis = d3.select('#chart').append('svg')
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

function ready(error, us, congress) {
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
        .datum(topojson.feature(us, us.objects.land))
        .attr({
            'd': path,
            'fill': defaults.land.fill,
            
        })

    vis_group.append('path')
        .datum(topojson.mesh(congress, geometryCollection, function(a, b) {
            return a !== b
        }))
        .attr({
            'd': path,
            'fill': defaults.districts.fill,
            'stroke': defaults.districts.stroke,
        })
}

d3.select(self.frameElement).style('height', height + 'px');
