var container_parent = $('.display'),
	chart_container = $('#chart'),
	margins = {top: 20, right: 20, bottom: 20, left: 20},
	width = container_parent.width() - margins.left - margins.right,
	height = (width * 0.8) - margins.top - margins.bottom,
	vis, vis_group, aspect,
	radius = Math.min(width, height) / 2.5

var defaults = {
    animation: {
        duration: 500,
        easeType: 'back',
        scale: 1,
        scaleAmount: 1.3,
        diffFromCenter: radius / 20
    },
    opacity: {
        off: 1,
        over: 1,
        out: 0
    }
}

var colors = ['#b024e4', '#6420c1', '#c78721', '#003264', '#8a0600', '#baba71', '#666666']

var color = d3.scale.ordinal()
	.range(colors)

var tooltip = d3.select('body').append('div')
	.attr({
		'class': 'tooltip',
		'opacity': 1e-6
	})