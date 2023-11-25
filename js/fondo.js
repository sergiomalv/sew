class Fondo {
    constructor(name, capital, coordinates) {
        this.name = name;
        this.capital = capital;
        this.coordinates = coordinates;
        this.getPhoto();
    }

    getPhoto() {
        var flickrAPI = "https://api.flickr.com/services/feeds/photos_public.gne?jsoncallback=?";

        $.getJSON(flickrAPI,
            {
                tags: this.name + "," + this.capital,
                tagmode: "any",
                format: "json"
            })
            .done(function (data) {
                $('body').css('background-image', 'url(' + data.items[0].media.m + ')')
                    .css('background-size', 'cover');
            });
    }
}

var fondo = new Fondo("Eslovaquia", "Bratislava", "48.148596,17.107748");