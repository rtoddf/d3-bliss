// https://groups.google.com/forum/#!topic/d3-js/d2ceKITfTx0

var container_parent = $('.display') ,
    chart_container = $('#example'),
    margins = {top: 40, right: 40, bottom: 40, left: 40},
    width = container_parent.width(),
    height = (width * .7),
    vis, vis_group, aspect,
    padding = 20,
    blurAmount = 8

var isDefined = function(obj){
    return typeof(obj) !== 'undefined' && obj !== null ? obj : ''
}

var pack = d3.layout.pack()
    .size([width, height])
    .padding(padding)

$(document).ready(function(){
    Count.menuSetUp()
})

$('.book_menu').on('click', function(e){
    var book = $(e.target).data('book')
    var color = e.target.style.background
    if(book !== ''){
        Count.visSetUp()
        Count.get(book, color)
    }
})

function Book(book){
    this.title = isDefined(book.title)
    this.author = isDefined(book.author)
    this.color = isDefined(book.color)
    this.book = isDefined(book.book)
}

var Count = new function(){

    var bubble_color

    this.menuSetUp = function(){
        var books = [];
        d3.json('data/books.json', function(error, datum){      

            datum.forEach(function(title){
                var book = new Book(title)
                books.push(book)
            })

            var menu_raw = '<div class="btn-group" role="group"> \
                <% for(var i=0; i < books.length; i++){ %> \
                    <a href="javascript:void(0)" class="btn" role="button" data-book="<%= books[i].book %>"> \
                        <p class="title"><%= books[i].title %></p> \
                        <p class="author"><%= books[i].author %></p> \
                    </a> \
                <% } %> \
            </div> '

            var menu_compiled = _.template(menu_raw, {
                books: books
            })
            $('.book_menu').html(menu_compiled)
            
        })
    }

    this.visSetUp = function(){
        $('#example').html('')

        vis = d3.select('#example').append('svg')
            .attr({
                'width': width,
                'height': height,
                'preserveAspectRatio': 'xMinYMid',
                'viewBox': '0 0 ' + (width) + ' ' + (height)
            })

        var defs = vis
            .append('defs')

        vis_group = vis.append('g')

        vis_group.append('rect')
            .attr({
                'width': width,
                'height': height,
                'fill': '#fff'
            })

        var blur = defs 
            .append('filter')
                .attr({
                    'id': 'blur'
                })
                .append('feGaussianBlur')
                    .attr({
                        'stdDeviation': blurAmount
                    })

        var blur = defs 
            .append('filter')
                .attr({
                    'id': 'blur2'
                })
                .append('feGaussianBlur')
                    .attr({
                        'stdDeviation': 2
                    })


        aspect = chart_container.width() / chart_container.height()
    }

    this.get = function(b, c){
        bubble_color = c

        d3.json('data/wordcounts/' + b + '.json', function(error, data){
            var words = {
                name: 'words',
                children: function(){
                    var childs = []
                    for(var i = 0; i < data.length; i++){
                        if(data[i][0] !== ''){
                            childs.push({
                                name: isDefined(data[i][0]),
                                value: isDefined(data[i][1])
                            })
                        }
                    }
                    return childs
                }()
            }

            var nodes = pack.nodes(words)

            var nodesLength = nodes.length - 1,
                nodesHigh = nodesLength * .33,
                nodesMid = nodesLength * .66,
                strokeColor = 'white',
                strokeWidth = 1

            var node = vis_group.selectAll('.node')
                .data(nodes)
                    .enter().append('g')
                .attr({
                    'class': 'node',
                    'transform': function(d){
                        return 'translate(' + d.x + ', ' + d.y + ')'
                    }
                })

            node.append('circle')
                .attr({
                    'class': 'bubble-glow',
                    'r': function(d){
                        return d.r
                    },
                    'fill': function(d, i){
                        return 'rgba(255,255,255,1)'
                    },
                    'opacity': function(d){
                        return d.children ? 0 : 1
                    },
                    'stroke-width': 0
                })
                .style({
                    'filter': 'url(#blur)'
                })

            node.append('circle')
                .attr({
                    'class': 'bubble',
                    'r': function(d){
                        return d.r
                    },
                    'fill': function(d, i){
                        return bubble_color
                    },
                    'opacity': function(d){
                        return d.children ? 0 : .7
                    },
                    'stroke-width': 0
                })
                
            var original_radius
            var original_fontsize

            node.on('mouseover', function(d){
                original_radius = d.r

                d3.select(this).select('.bubble')
                    .transition()
                    .duration(100)
                    .ease('bounce')
                    .attr({
                        'r': d.r * 1.1,
                        "cy": function() {

                        }
                    })

                original_fontsize = d.r / 3
                d3.select(this).select('.bubble-text-glow')
                    .transition()
                    .duration(100)
                    .ease('bounce')
                    .attr({
                        'font-size': (d.r / 3) * 1.5,
                        'fill': '#000'
                    })

                d3.select(this).select('.bubble-text')
                    .transition()
                    .duration(100)
                    .ease('bounce')
                    .attr({
                        'font-size': (d.r / 3) * 1.5,
                        'fill': '#fff'
                    })
            })

            node.on('mouseout', function(d){

                d3.select(this).select('.bubble')
                    .transition()
                    .ease('bounce')
                    .duration(100)
                    .attr({
                        'r': original_radius
                    })

                d3.select(this).select('.bubble-text-glow')
                    .transition()
                    .ease('bounce')
                    .duration(100)
                    .attr({
                        'font-size': original_fontsize,
                        'fill': '#fff'
                    })

                d3.select(this).select('.bubble-text')
                    .transition()
                    .ease('bounce')
                    .duration(100)
                    .attr({
                        'font-size': original_fontsize,
                        'fill': '#000'
                    })
            })


            node.append('text')
                .text(function(d){
                    return d.children ? '' : d.name
                })
                .attr({
                    'class': 'bubble-text-glow',
                    'text-anchor': 'middle',
                    'dy': '.4em',
                    'fill': 'rgba(255,255,255,1)',
                    'font-size': function(d){
                        return d.r / 3                      
                    },
                    'opacity': 1
                })
                .style({
                    'filter': 'url(#blur2)'
                })

            node.append('text')
                .text(function(d){
                    return d.children ? '' : d.name
                })
                .attr({
                    'class': 'bubble-text',
                    'text-anchor': 'middle',
                    'dy': '.4em',
                    'fill': 'rgba(0,0,0,1)',
                    'font-size': function(d){
                        return d.r / 3
                    },
                    'opacity': 1
                })
        })

        $.get('data/books/' + b + '.html', function(book_data) {
            $('#text').html(book_data)
        })

    }

}

$(window).on('resize', function() {
    var targetWidth = container_parent.width()
    vis.attr({
        'width': targetWidth,
        'height': Math.round(targetWidth / aspect)
    })
})

var template_raw = '<table> \
    <tr><th>Word</th><th>Count</th></tr> \
    <% for(var i=0; i < data.length; i++){ %> \
    <tr><td><%= data[i].name %></td><td><%= data[i].value %></td></tr> \
    <% } %> \
    </table>'
