class Fondo {
    constructor(name, capital, coordinates) {
        this.name = name;
        this.capital = capital;
        this.coordinates = coordinates;
        this.getPhoto();
    }

    getPhoto() {
        var flickrAPI = "http://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";
        
        $.getJSON(flickrAPI, 
                {
                    tags: this.name + "," + this.capital,
                    tagmode: "any",
                    format: "json"
                })
            .done(function(data) {
                $.each(data.items, function(i, item) {
                    if (i === 6) {
                        $('body').css('background-image', 'url(' + item.media.m + ')')
                        .css('background-size', 'cover');
                    }
                });
            });
    }
}

var fondo = new Fondo("Eslovaquia", "Bratislava", "48.148596,17.107748");