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
            'fill': 'none',
            'stroke': defaults.land.stroke,
            'stroke-width': defaults.land.strokeWidth
        })

    .selectAll('path')
        .data(topojson.feature(topology, topology.objects.states).features)
    .enter().append('path')

    // draw the districts
    var disctrict = vis_group.selectAll('path')
        .data(topojson.feature(congress, congress.objects.districts).features)
            .enter().append('path')
        .attr({
            'd': path,
            'fill': defaults.land.fill,
            'stroke': defaults.land.stroke,
            'stroke-width': .25
        })
        .on('mouseover', function(d){
            console.log('this: ', d)
            d3.select(this)
                .transition()
                .duration(200)
                .attr({
                    'fill': 'white'
                })
                .style({
                    'cursor': 'pointer'
                })
        })
        .on('mouseout', function(){
            d3.select(this)
                .transition()
                .duration(200)
                .attr({
                    'fill': defaults.land.fill
                })
        })

    // disctrict
    //     .on('mouseover', function(){
    //         console.log('over')
    //         d3.select(this)
    //             .transition()
    //             .duration(200)
    //             .attr({
    //                 'fill': 'red'
    //             })
    //             .style({
    //                 'cursor': 'pointer'
    //             })
    //     })

    // draws the state outlines
    vis_group.append('path')
        .datum(topojson.mesh(topology, topology.objects.states, function(a, b){
            return a !== b
        }))
        .attr({
            'd': path,
            'fill': 'none',
            'stroke': '#fff',
            'stroke-width': 1
        })
}

d3.select(self.frameElement).style('height', height + 'px');
