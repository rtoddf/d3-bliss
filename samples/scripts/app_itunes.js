(function ($, _, Backbone) {

    "use strict";

    var initialSearchTerm = $('#artist').find(':selected')[0].value;
    var ArtistCollection, ArtistModel, ArtistsView, ArtistView, ArtistSelectView

    ArtistModel = Backbone.Model.extend({
        idAttribute: 'trackId',

        defaults: {
            howdy: 'Bob'
        }
    })

    // TODO: try nested models inside models

    ArtistCollection = Backbone.Collection.extend({
        model: ArtistModel,

        urlRoot: 'http://itunes.apple.com/search?',
        searchTerm: initialSearchTerm,
        entity: 'musicTrack',
        responses: 12,
        url: function(){
            return this.urlRoot + 'term=' + this.searchTerm + '&entity=' + this.entity + '&limit=' + this.responses + '&callback=?'
        },

        parse: function(response) {
            return response.results;
        }
    })

    ArtistSelectView = Backbone.View.extend({
        // events hash ?????

        el: '#artist',
        // el: '#chris',

        events: {
            'change': 'selectArtist'
            // 'click': 'selectArtist',
        },

        selectArtist: function(){
            var artist_choice = this.$el.find(':selected')[0].value;
            console.log('huh: ', artist_choice)

            this.collection.searchTerm = artist_choice
            this.collection.fetch({
                reset: true
            })
        },
    })

    ArtistsView = Backbone.View.extend({
        tagName: 'div',
        className: 'artists-container',
        template: $('#artists_template').html(),

        render: function(){
            // tmpl is a function that takes a JSON object and returns html
            var templ = Handlebars.compile(this.template);
            // var templ = _.template(this.template);
            // this.el is what we defined
            this.$el.html(templ(this.model.toJSON()));

            return this;
        }
    })

    ArtistView = Backbone.View.extend({
        el: $('#artists'),

        initialize: function(){
            // this.listenTo(this.collection, 'reset', this.clearIt)
            this.listenTo(this.collection, 'reset sync', this.render);
            this.collection.fetch();
        },

        clearIt: function(){
            // this.$el.empty()
        },

        render: function(){
            this.$el.empty()
            _.each(this.collection.models, function(item){
                this.renderArtist(item)
            }, this)
        },

        renderArtist: function(item){
            var artistsView = new ArtistsView({
                model: item
            })

            this.$el.append(artistsView.render().el)
        }
    })

    var artistCollection = new ArtistCollection();

    var artistView = new ArtistView({
        collection: artistCollection
    });

    var artistSelectView = new ArtistSelectView({
        collection: artistCollection
    });

})(jQuery, _, Backbone);
