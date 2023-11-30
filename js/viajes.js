class Viajes {

    /* Constructor de la clase */
    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));
    }

    getPosicion(posicion) {
        this.longitud = posicion.coords.longitude;
        this.latitud = posicion.coords.latitude;
        this.altitud = posicion.coords.altitude;
    }

    verErrores(error) {
        switch (error.code) {
            case error.PERMISSION_DENIED:
                this.mensaje = "El usuario no permite la petición de geolocalización"
                break;
            case error.POSITION_UNAVAILABLE:
                this.mensaje = "Información de geolocalización no disponible"
                break;
            case error.TIMEOUT:
                this.mensaje = "La petición de geolocalización ha caducado"
                break;
            case error.UNKNOWN_ERROR:
                this.mensaje = "Se ha producido un error desconocido"
                break;
        }
    }
    getLongitud() {
        return this.longitud;
    }
    getLatitud() {
        return this.latitud;
    }
    getAltitud() {
        return this.altitud;
    }

    getMapaEstaticoGoogle() {
        var apiKey = "&key=AIzaSyDNYwpCoKDYjjnqyD2f3N0dD_7c72ogl8Q";
        var url = "https://maps.googleapis.com/maps/api/staticmap?";
        var centro = "center=" + this.getLatitud() + "," + this.getLongitud();
        var zoom = "&zoom=15";
        var tamaño = "&size=800x600";
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.getLatitud() + "," + this.getLongitud();
        var sensor = "&sensor=false";

        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;

        const section = $("<section></section>");
        const title = $("<h2>Ubicación estática del usuario</h2>");
        const map = $("<img src='" + this.imagenMapa + "' alt='mapa estático google' />");

        title.appendTo(section);
        map.appendTo(section);
        section.appendTo("body");
    }
}

var viajes = new Viajes();
viajes.getMapaEstaticoGoogle();