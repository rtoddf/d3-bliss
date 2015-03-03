var container_parent = $('.display'),
    chart_container = $('#chart'),
    margins = {top: 20, right: 20, bottom: 40, left: 40},
    width = container_parent.width() - margins.left - margins.right,
    height = (width * 0.6) - margins.top - margins.bottom,
    vis, vis_group, aspect

vis = d3.select('#chart').append('svg')
    .attr({
        'width': width + margins.left + margins.right,
        'height': height + margins.top + margins.bottom,
        'class': 'chart',
        'preserveAspectRatio': 'xMinYMid',
        'viewBox': '0 0 ' + (width + margins.left + margins.right) + ' ' + (height + margins.top + margins.bottom)
    })

vis_group = vis.append('g')
        .attr({
            'transform': 'translate(' + margins.left + ', ' + margins.top + ')'
        })

aspect = chart_container.width() / chart_container.height()

var parseDate = d3.time.format('%Y%m%d').parse;

var x = d3.time.scale()
    .range([0, width]);

var y = d3.scale.linear()
    .range([height, 0]);

var color = d3.scale.category10();

var xAxis = d3.svg.axis()
    .scale(x)
    .orient('bottom');

var yAxis = d3.svg.axis()
    .scale(y)
    .orient('left');

var line = d3.svg.line()
    .interpolate('basis')
    .x(function(d) {
        return x(d.date)
    })
    .y(function(d) {
        return y(d.temperature)
    })

d3.tsv('data/multi-temps.tsv', function(error, data) {
    console.log('data: ', data)

    color.domain(d3.keys(data[0])
        .filter(function(key) {
            return key !== 'date'
        })
    )

    data.forEach(function(d) {
        d.date = parseDate(d.date)
    })

    var cities = color.domain().map(function(name) {
        return {
            name: name,
            values: data.map(function(d) {
                return {
                    date: d.date,
                    temperature: +d[name]
                }
            })
        }
    })

    console.log('cities: ', cities)

    x.domain(d3.extent(data, function(d) {
        return d.date
    }))

    y.domain([
        d3.min(cities, function(c) {
            return d3.min(c.values, function(v) {
                return v.temperature
            })
        }),
        d3.max(cities, function(c) {
            return d3.max(c.values, function(v) {
                return v.temperature
            })
        })
    ])


    vis_group.append('g')
        .attr({
            'class': 'x axis',
            'transform': 'translate(0,' + height + ')'
        })
        .call(xAxis)

    vis_group.append('g')
        .attr({
            'class': 'y axis'
        })
        .call(yAxis)
            // .append("text")
            //     .attr("transform", "rotate(-90)")
            //     .attr("y", 6)
            //     .attr("dy", ".71em")
            //     .style("text-anchor", "end")
            //     .text("Temperature (ºF)");

})




















