function random_matrix(size) {
    var matrix = [];
    for (var i=0; i<size; i++) {
        var row = [];
        for (var j=0; j<size; j++) {
            var num = Math.round(100*Math.pow(Math.random(),2)+1);
            row.push(num);
        }
        matrix.push(row);
    }
    return matrix;
};

var data = [
	[6,32,47,81,31,89,24,68,50,39],
	[37,83,57,80,87,7,85,7,68,17],
	[50,15,31,3,1,85,36,95,83,99],
	[37,25,37,81,72,98,32,13,70,25],
	[19,99,97,79,74,43,78,18,4,57],
	[77,2,87,41,93,52,6,42,11,76],
	[91,56,97,65,23,60,63,68,45,48],
	[97,50,79,52,85,31,85,21,79,44],
	[17,77,96,22,87,98,58,15,36,16],
	[44,54,60,69,36,44,76,58,50,16]
];

for (var i=1; i<=3; i++) {
	initChord(i);
}

function initChord(i) {
	fill = {
		1: d3.scale.category10(),
		2: d3.scale.category20b(),
		3: d3.scale.category20()
	}

	var chord = d3.chart.chord({
		container: "#chart" + i,
		fill: fill[i]
	});

	chord.update(data);

	d3.select("#update" + i).on("click", function() {
		var data = random_matrix(10);
		chord.update(data);
	});
	d3.select("#clear" + i).on("click", function() {
		chord.clear();
	});
	d3.select("#render" + i).on("click", function() {
		chord.render();
	});
	d3.select("#color" + i).on("click", function() {
		chord.flipColors();
	});
}