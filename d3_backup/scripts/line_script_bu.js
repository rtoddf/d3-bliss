var margins = {top: 20, right: 50, bottom: 30, left: 90};

var chart_type = "line";
var x_axis_column = "Year";
var y_axis_columns = ["Expense: Parks & Recreation", "Expense: Public Safety", "Expense: Public Works", "Expense: Social Services", "Revenue: Personal Property: Inc. Businesses", "Revenue: Personal Property: Uninc. Businesses"];
var color_palette = ["#225533", "#44bbcc", "#88dddd", "#bbeeff", "#0055bb", "#334433", "#6699aa", "#88aaaa", "#aacccc", "#447799"];
var vis, legend;

function getTargetWidth() {
    // this will have to be done by responsive.js - hardcoded for now
    return 972;
}

function getTargetHeight() {
    // this will have to be done by responsive.js - hardcoded for now
    return 400;
}

var nest = d3.nest()
    .key(function(d) { return d[x_axis_column]; });

function setup_chart() {
    var $ = cmg.query;
    var data_list = cmg.display.data[0];

    var dataByGroup = nest.entries(data_list);

    for (i = 0; i < data_list.length; i++) {
        // console.log('data_list[i]: ',  data_list[i])
        // console.log('length: ',  data_list[i]['Expense: Economic Development'])
    }   

    // dataByGroup.forEach(function(d, i){
    //     console.log('dataByGroup[i].values[0]: ', dataByGroup[i].values[0])
    //     y_axis_columns.forEach(function(key){
    //         console.log('key: ', key)
    //     })
    // })

    // Assemble the data arrays.
    // First, create an object for each Y axis being displayed.
    // data = [];
    // for (i = 0; i < y_axis_columns.length; i++) {
    //     data.push([]);
    // }

    // // Now, loop through the rows and add them to the series.
    // for (i = 0; i < data_list.length; i++) {
    //     var row = data_list[i];
    //     var x_value = row[x_axis_column];

    //     for (j = 0; j < y_axis_columns.length; j++) {
    //         var value = row[y_axis_columns[j]];
    //         data[j].push( [x_value, cmg.display.parse_float_liberally(value)] );
    //     }
    // }

    // Data has been assembled.  Now let's prepare the chart element and then draw it.
    vis = d3.select("#dataVizChart")
        .append("svg")
        .attr({
            "preserveAspectRatio": "xMidYMid",
            "width": getTargetWidth(),
            "height": getTargetHeight()
        });

    drawLineChart(vis, data_list, y_axis_columns);
}

function drawLineChart(vis, data, y_axis_columns) {
    console.log('data: ', data)

    var xdata = []
    for (var i = 0; i < data.length; i++) {
        xdata.push(data[i][x_axis_column]);
    }

    var ydata = []
    for (var i = 0; i < data.length; i++) {
        for (var j = 0; j < y_axis_columns.length; j++) {
            ydata.push(parseFloat(data[i][y_axis_columns[j]].replace('$', '')))
        }
    }

    // Figure out minimum, maximum data points.
    // var xdata = [], ydata = [];
    // var xMin, xMax, yMin, yMax;
    // for (i = 0; i < data.length; i++) {
    //     for(j = 0; j < data[i].length; j++) {
    //         var pair = data[i][j];
    //         xdata.push(pair[0]);
    //         ydata.push(pair[1]);
    //     }
    // }

    // xMin = d3.min(xdata);
    // xMax = d3.max(xdata);
    // yMin = d3.min(ydata);
    // yMax = d3.max(ydata);

    console.log('xdata: ', xdata)
    console.log('ydata: ', ydata)
    console.log('ydata: ', ydata.length)

    // Draw the axes
    var xScale = d3.scale.ordinal()
        .domain(xdata)
        .rangePoints([ margins.left, getTargetWidth() - (margins.left + margins.right) ])
        // .range([ margins.left, getTargetWidth() - (margins.left + margins.right) ])

    var yScale = d3.scale.ordinal()
        .domain([ d3.min(ydata), d3.max(ydata) ])
        .range([ getTargetHeight() - margins.bottom, margins.top ])

    var xAxis = d3.svg.axis()
        .scale(xScale)

    var yAxis = d3.svg.axis()
        .scale(yScale)
        .orient('left')

    vis.append('g')
        .attr({
          'class': 'x axis',
          'transform': 'translate(0,' +  (getTargetHeight() - margins.bottom) + ')'
        })
        .call(xAxis)

    vis.append('g')
        .attr({
          'class': 'y axis',
          'transform': 'translate(' + margins.left + ', 0)'
        })
        .call(yAxis)

    // var lineFunction = d3.svg.line()
    //     .x(function(d, i){ 
    //         // console.log('d[i][0]: ', d[i][0])
    //         return xScale(d[i][0]);
    //     })
    //     .y(function(d, i){
    //         // console.log('d[i][1]: ', d[i][1])
    //         return yScale(d[i][1]);
    //     })
    //     .interpolate('linear');

    // var lineStuff = vis.selectAll('.line')
    //     .data(data)
    // .enter().append('g')
    //     .attr({
    //         'class': 'line'
    //     })

    // lineStuff.append('path')
    //     .attr({
    //       'd': lineFunction(data),
    //       'stroke': '#444',
    //       // 'stroke': color_palette[colorIndex],
    //       'stroke-width': '2',
    //       'fill': 'none'
    //       });        


    // Render each series of data
    // for(i = 0; i < data.length; i++) {
    //     var series = data[i];
    //     var colorIndex = i % color_palette.length;

    //     // XXX need to make this append circles instead of selecting them all.
    //     var circles = vis.selectAll('circle')
    //     .data(series).enter()
    //         .append('circle')
    //         .attr({
    //             'cx': function(t){ 
    //                 return xScale(t[0]) 
    //             },
    //             'cy': function(t){ 
    //                 return yScale(t[1]) 
    //             },
    //             'r': 5,
    //             'fill': color_palette[colorIndex]
    //         })

    //     // var lineFunction = d3.svg.line()
    //     //     .x(function(t){ return xScale(t[0]); })
    //     //     .y(function(t){ return yScale(t[1]); })
    //     //     .interpolate('linear');

    //     // var line = vis.append('path')
    //     //     .attr({
    //     //       'd': lineFunction(series),
    //     //       'stroke': color_palette[colorIndex],
    //     //       'stroke-width': '2',
    //     //       'fill': 'none'
    //     //       });
    // }
}

cmg.query(function () {
    cmg.display.read_data(setup_chart, null);
});