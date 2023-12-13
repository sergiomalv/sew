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
        console.log(this.getLatitud(), this.getLongitud());
        var zoom = "&zoom=15";
        var tamaño = "&size=800x600";
        var marcador = "&markers=color:red%7Clabel:S%7C" + this.getLatitud() + "," + this.getLongitud();
        var sensor = "&sensor=false";

        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;

        const section = $("<section></section>");
        const map = $("<img src='" + this.imagenMapa + "' alt='mapa estático google' />");

        map.appendTo(section);
        section.insertAfter("section:first");
    }

    getMapaDinamicoGoogle() {
        var centro = { lat: 43.3672702, lng: -5.8502461 };
        var mapaGeoposicionado = new google.maps.Map(document.getElementById('mapa'), {
            zoom: 8,
            center: centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        this.mapaGeoposicionado = mapaGeoposicionado;

        var infoWindow = new google.maps.InfoWindow;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                var pos = {
                    lat: position.coords.latitude,
                    lng: position.coords.longitude
                };

                infoWindow.setPosition(pos);
                infoWindow.setContent('Localización encontrada');
                infoWindow.open(mapaGeoposicionado);
                mapaGeoposicionado.setCenter(pos);
            }, function () {
                tratamientoErrores(true, infoWindow, mapaGeoposicionado.getCenter());
            });
        } else {
            tratamientoErrores(false, infoWindow, mapaGeoposicionado.getCenter());
        }
    }

    tratamientoErrores(browserHasGeolocation, infoWindow, pos) {
        infoWindow.setPosition(pos);
        infoWindow.setContent(browserHasGeolocation ?
            'Error: Ha fallado la geolocalización' :
            'Error: Su navegador no soporta geolocalización');
        infoWindow.open(mapaGeoposicionado);
    }

    readXML(file) {
        var archivo = file[0];

        var tipoXML = /xml.*/;

        if (archivo.type.match(tipoXML)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                var xml = lector.result;
                const section = $("section:first")

                $(xml).find('ruta').each(function () {
                    var rutaName = $(this).attr('nombre');
                    var rutaType = $(this).attr('tipo');
                    var medioTransporte = $(this).find('medio-transporte').text();
                    var inicioRuta = $(this).find('inicio-ruta').text();
                    var horaInicio = $(this).find('hora-inicio').text();
                    var duracion = $(this).find('duracion').text();
                    var agencia = $(this).find('agencia').text();
                    var descripcion = $(this).find('descripcion').text();
                    var personasAdecuadas = $(this).find('personas-adecuadas').text();
                    var lugarInicio = $(this).find('lugar-inicio').text();
                    var direccionInicio = $(this).find('direccion-inicio').text();
                    var coordenadas = $(this).find('coordenadas');
                    var longitud = coordenadas.attr('longitud');
                    var latitud = coordenadas.attr('latitud');
                    var altitud = coordenadas.attr('altitud');
                    var recomendacion = $(this).find('recomendacion').text();

                    const title = $("<h3>" + rutaName + "</h3>");
                    const list = $("<ul></ul>");
                    list.append("<li> Tipo: " + rutaType + "</li>");
                    list.append("<li> Medio de transporte: " + medioTransporte + "</li>");
                    list.append("<li> Inicio de ruta: " + inicioRuta + "</li>");
                    list.append("<li> Hora de inicio: " + horaInicio + "</li>");
                    list.append("<li> Duración: " + duracion + "</li>");
                    list.append("<li> Agencia: " + agencia + "</li>");
                    list.append("<li> Descripción: " + descripcion + "</li>");
                    list.append("<li> Personas adecuadas: " + personasAdecuadas + "</li>");
                    list.append("<li> Lugar de inicio: " + lugarInicio + "</li>");
                    list.append("<li> Dirección de inicio: " + direccionInicio + "</li>");
                    list.append("<li> Longitud: " + longitud + "</li>");
                    list.append("<li> Latitud: " + latitud + "</li>");
                    list.append("<li> Altitud: " + altitud + "</li>");
                    list.append("<li> Recomendación: " + recomendacion + "</li>");

                    title.appendTo(section);
                    list.appendTo(section);

                    $(this).find('referencias-bibliografia').each(function () {
                        var referencia = $(this).find('referencia-bibliografia').text();
                    });


                    $(this).find('hito').each(function () {
                        var nombreHito = $(this).find('nombre-hito').text();
                        var descripcionHito = $(this).find('descripcion-hito').text();
                        var coordenadas = $(this).find('coordenadas');
                        var longitud = coordenadas.attr('longitud');
                        var latitud = coordenadas.attr('latitud');
                        var altitud = coordenadas.attr('altitud');
                        var distancia = $(this).find('distancia').text();

                        const title = $("<h4> Hito: " + nombreHito + "</h4>");
                        const list = $("<ul></ul>");
                        list.append("<li> Descripción: " + descripcionHito + "</li>");
                        list.append("<li> Longitud: " + longitud + "</li>");
                        list.append("<li> Latitud: " + latitud + "</li>");
                        list.append("<li> Altitud: " + altitud + "</li>");
                        list.append("<li> Distancia: " + distancia + "</li>");

                        title.appendTo(section);
                        list.appendTo(section);

                        var existFoto = true;
                        $(this).find('fotografia').each(function () {
                            if (existFoto) {
                                const title = $("<h5>Galería de imágenes</h5>");
                                existFoto = false;
                                title.appendTo(section);
                            }
                            var foto = $(this).text();
                            var fotoContent = $("<img src='xml/multimedia/" + foto + "' alt=" + foto + "/>");
                            fotoContent.appendTo(section);

                        });

                        var existVideo = true;
                        $(this).find('video').each(function () {
                            if (existVideo) {
                                const title = $("<h5>Galería de vídeos</h5>");
                                existVideo = false;
                                title.appendTo(section);
                            }
                            var video = $(this).text();
                            var videoContent = $("<video src='xml/multimedia/" + video + "' controls></video>");
                            videoContent.appendTo(section);
                        });
                    });
                });
            }
        }
        lector.readAsText(archivo);
    }

    readKML(files) {
        const nFiles = files.length;

        for (let i = 0; i < nFiles; i++) {
            let archivo = files[i];
            let lector = new FileReader();

            lector.onload = function (event) {
                var kml = lector.result;
                var coordenadas = $(kml).find('coordinates').text();
                var cleanCoordenadas = coordenadas.trim().split('\n');
                var points = [];
                for (let j = 0; j < cleanCoordenadas.length; j++) {
                    var coordenada = cleanCoordenadas[j].split(',');
                    var latitud = coordenada[1];
                    var longitud = coordenada[0];
                    points.push({ lat: parseFloat(latitud), lng: parseFloat(longitud) });
                }

                var ruta = new google.maps.Polyline({
                    path: points,
                    strokeColor: "#FF0000",
                    strokeOpacity: 1.0,
                    strokeWeight: 2
                });
                ruta.setMap(this.mapaGeoposicionado);
            }.bind(this);

            lector.readAsText(archivo);
        }

    }

    readSVG(files) {
        const nFiles = files.length;

        for (let i = 0; i < nFiles; i++) {
            let archivo = files[i];
            let lector = new FileReader();

            var tipoSVG = /svg.*/;

            if (archivo.type.match(tipoSVG)) {
                lector.onload = function (event) {
                    var svg = lector.result;

                    var result = $($.parseXML(svg)).find('svg');

                    result.removeAttr('xmlns').removeAttr('version');

                    result.appendTo("section:first");
                }.bind(this);
                lector.readAsText(archivo);
            }
        }

    }
}

var viajes = new Viajes();
