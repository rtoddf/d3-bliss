/* stand alone function - no need to change */
(function(){
    var cmg = window.cmg || (window.cmg = {});

    cmg.svgSetUp = function(div, aspect_ratio){
        if(typeof div === 'undefined'){
            div = '.svg';
        } 
        var chart_container = div.jquery ? div : $(div);
        var container_parent = chart_container.closest('.article, .cmArticle');
        var ratio = aspect_ratio || 1;
        var width = container_parent.width(), height = width * ratio;

        return {
            'chart_container': chart_container,
            'container_parent': container_parent,
            'width': width,
            'height': height,
            'ratio': ratio
        };
    };
})();

(function(){
    /* BEGIN SCRIPTS THE SITES WILL NEED TO ADD */
    /* pass the ratio of height to width - if nothing is passed, the default is 1 */
    var ratio = .5;
    /*  pass the id or class that the svg tag will be appended to
        these formats are valid - $('.svg') or '.svg' or $('.svg')[0]
        if nothing is passed, the default is '.svg' */
    var div = $('.sig')[0];

    /* this can also be passed if needed. Need to ask sites
    https://developer.mozilla.org/en-US/docs/Web/SVG/Attribute/preserveAspectRatio */
    var aspect_ratio = 'xMinYMid';

    // call to setup
    var setup = cmg.svgSetUp(div);

    // returned for setup
    var width = setup.width,
        height = setup.height,
        chart_container = setup.chart_container,
        container_parent = setup.container_parent,
        ratio = setup.ratio;

    // on window resize, reset the with and height of the svg tag
    $(window).on('resize', function() {
        var targetWidth = container_parent.width();
        var targetHeight = container_parent.width() * ratio;
        
        vis.attr({
            'width': targetWidth,
            'height': targetHeight
        });
    });
    /* END SCRIPTS THE SITES WILL NEED TO ADD */

    // this is the drawing script, which can be different per script
    var vis = d3.select(chart_container.get(0)).append('svg')
        .attr({
            'width': width,
            'height': height,
            'preserveAspectRatio': aspect_ratio,
            'viewBox': '0 0 ' + width + ' ' + height
        });

    var cx = width / 2,
        cy = height / 2,
        radius = height / 3,
        color = 'rgba(0,50,100,.25)';

    var circle = vis.append('circle')
        .attr({
            'cx': cx,
            'cy': cy,
            'r': radius,
            'fill': color
        });
})()