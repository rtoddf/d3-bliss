var width = 960,
    height = 600;

var projection = d3.geo.albersUsa()
    .scale(1280)
    .translate([width / 2, height / 2]);

var path = d3.geo.path()
    .projection(projection);

var svg = d3.select("#chart").append("svg")
    .attr("width", width)
    .attr("height", height);

queue()
    .defer(d3.json, "data/us.json")
    .defer(d3.json, "data/us-congress-113.json")
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
        .filter(function(j) { return j < i && features[j].centroid; })
        .map(function(j) { return features[j]; }) : [];
  });

  svg.append("path")
      .attr("class", "land")
      .datum(topojson.feature(us, us.objects.land))
      .attr("d", path);

  svg.append("path")
      .attr("class", "border")
      .datum(topojson.mesh(congress, geometryCollection, function(a, b) { return a !== b; }))
      .attr("d", path);
}

d3.select(self.frameElement).style("height", height + "px");
