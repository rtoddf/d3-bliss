var container_parent = $('.display') ,
    chart_container = $('#chart'),
    margins = {top: 20, right: 20, bottom: 20, left: 20},
    width = container_parent.width(),
    height = (width * .6),
    vis, vis_group, aspect

var defaults = {
    land: {
        fill: '#baba71',
        stroke: '#61613b',
        strokeWidth: .5
    },
    states: {
        fill: '#baba71',
        stroke: '#61613b',
        strokeWidth: .5
    },
    districts: {
        fill: 'none',
        stroke: '#fff',
        strokeWidth: .5
    },
    counties: {
        fill: '#baba71',
        stroke: '#fff',
        strokeWidth: .5
    }
}

var projection = d3.geo.albersUsa()
    .scale(width)
    .translate([ width/2, height/2 ]);

var path = d3.geo.path()
    .projection(projection);
