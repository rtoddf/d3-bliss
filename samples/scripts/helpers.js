Handlebars.registerHelper('artwork', function(art) {
    var newArt = (art).replace('100x100-75', '600x600-75')

    return newArt;
});
