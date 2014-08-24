function CalculateStarPoints(centerX, centerY, arms, innerRadius) {
	var results = ''
	var angle = Math.PI / arms

	// the outerRadius is always 2.5 times the inner if we want a perfect nautical star
	var outerRadius = innerRadius * 2.5

	for (var i = 0; i < 2 * arms; i++) {
		// Use outer or inner radius depending on what iteration we are in.
		var r = (i & 1) == 0 ? outerRadius : innerRadius

		var currX = centerX + Math.cos(i * angle) * r
		var currY = centerY + Math.sin(i * angle) * r

		// Our first time we simply append the coordinates, subsequet times
		// we append a ", " to distinguish each coordinate pair.
		if (i == 0) {
			results = currX + ',' + currY
		} else {
			results += ',' + currX + ',' + currY
		}
	}

	return results
}