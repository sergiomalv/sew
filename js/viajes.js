"use strict";
class Viajes {

    /* Constructor de la clase */
    constructor() {
        navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this), this.verErrores.bind(this));

        this.slides = $("article").find("img");
        this.curSlide = 3;
        this.maxSlide = this.slides.length - 1;
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

    /**
     * Método para obtener la ubicación del usuario y pintarla en un mapa estático de Google
     * [ATENCIÓN] A veces no funciona de forma correcta en Firefox y arroja un error. Se ha probado en el
     * resto de navegadores y funciona correctamente.
     */
    getMapaEstaticoGoogle() {
        let apiKey = "&key=AIzaSyDNYwpCoKDYjjnqyD2f3N0dD_7c72ogl8Q";
        let url = "https://maps.googleapis.com/maps/api/staticmap?";
        let centro = "center=" + this.getLatitud() + "," + this.getLongitud();

        let zoom = "&zoom=15";
        let tamaño = "&size=800x600";
        let marcador = "&markers=color:red%7Clabel:S%7C" + this.getLatitud() + "," + this.getLongitud();
        let sensor = "&sensor=false";

        this.imagenMapa = url + centro + zoom + tamaño + marcador + sensor + apiKey;

        const section = $("<section></section>");
        const title = $("<h2>Mapa estático de Google</h2>");
        const map = $("<img src='" + this.imagenMapa + "' alt='mapa estático google' />");

        title.appendTo(section);
        map.appendTo(section);
        section.insertAfter("section:first");
    }

    /**
     * Método para obtener la ubicación del usuario y pintarla en un mapa dinámico de Google
     * [ATENCIÓN] Produce errores de validación, además en la consola a veces aparecen errores.
     */
    getMapaDinamicoGoogle() {
        let centro = { lat: 43.3672702, lng: -5.8502461 };
        let mapaGeoposicionado = new google.maps.Map(document.querySelector('main'), {
            zoom: 8,
            center: centro,
            mapTypeId: google.maps.MapTypeId.ROADMAP
        });

        this.mapaGeoposicionado = mapaGeoposicionado;

        let infoWindow = new google.maps.InfoWindow;
        if (navigator.geolocation) {
            navigator.geolocation.getCurrentPosition(function (position) {
                let pos = {
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

    /**
     * Método para leer la información de un fichero XML
     * @param {*} file Archivo que se lee
     */
    readXML(file) {
        let archivo = file[0];

        let tipoXML = /xml.*/;

        if (archivo.type.match(tipoXML)) {
            let lector = new FileReader();
            lector.onload = function (evento) {
                let xml = lector.result;
                const section = $("section:first")

                $(xml).find('ruta').each(function () {
                    let rutaName = $(this).attr('nombre');
                    let rutaType = $(this).attr('tipo');
                    let medioTransporte = $(this).find('medio-transporte').text();
                    let inicioRuta = $(this).find('inicio-ruta').text();
                    let horaInicio = $(this).find('hora-inicio').text();
                    let duracion = $(this).find('duracion').text();
                    let agencia = $(this).find('agencia').text();
                    let descripcion = $(this).find('descripcion').text();
                    let personasAdecuadas = $(this).find('personas-adecuadas').text();
                    let lugarInicio = $(this).find('lugar-inicio').text();
                    let direccionInicio = $(this).find('direccion-inicio').text();
                    let coordenadas = $(this).find('coordenadas');
                    let longitud = coordenadas.attr('longitud');
                    let latitud = coordenadas.attr('latitud');
                    let altitud = coordenadas.attr('altitud');
                    let recomendacion = $(this).find('recomendacion').text();

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

                    $(this).find('referencia-bibliografia').each(function () {
                        let referencia = $(this).text();
                        list.append("<li> Referencia bibliográfica: " + referencia + "</li>");
                    });
                    list.appendTo(section);


                    $(this).find('hito').each(function () {
                        let nombreHito = $(this).find('nombre-hito').text();
                        let descripcionHito = $(this).find('descripcion-hito').text();
                        let coordenadas = $(this).find('coordenadas');
                        let longitud = coordenadas.attr('longitud');
                        let latitud = coordenadas.attr('latitud');
                        let altitud = coordenadas.attr('altitud');
                        let distancia = $(this).find('distancia').text();

                        const title = $("<h4> Hito: " + nombreHito + "</h4>");
                        const list = $("<ul></ul>");
                        list.append("<li> Descripción: " + descripcionHito + "</li>");
                        list.append("<li> Longitud: " + longitud + "</li>");
                        list.append("<li> Latitud: " + latitud + "</li>");
                        list.append("<li> Altitud: " + altitud + "</li>");
                        list.append("<li> Distancia: " + distancia + "</li>");

                        title.appendTo(section);
                        list.appendTo(section);

                        let existFoto = true;
                        $(this).find('fotografia').each(function () {
                            if (existFoto) {
                                const title = $("<h5>Galería de imágenes</h5>");
                                existFoto = false;
                                title.appendTo(section);
                            }
                            let foto = $(this).text();
                            let fotoContent = $("<img src='xml/multimedia/" + foto + "' alt=" + foto + "/>");
                            fotoContent.appendTo(section);

                        });

                        let existVideo = true;
                        $(this).find('video').each(function () {
                            if (existVideo) {
                                const title = $("<h5>Galería de vídeos</h5>");
                                existVideo = false;
                                title.appendTo(section);
                            }
                            let video = $(this).text();
                            let videoContent = $("<video src='xml/multimedia/" + video + "' controls></video>");
                            videoContent.appendTo(section);
                        });
                    });
                });
            }        
            lector.readAsText(archivo);
        }
    }

    /**
     * Función para leer un archivo KML
     * [ATENCIÓN] En el caso de llamar a este método se debe mover el mapa hasta Eslovaquia para 
     * poder ver las rutas en el mapa
     * @param {*} files Archivo que se lee
     */
    readKML(files) {
        const nFiles = files.length;

        for (let i = 0; i < nFiles; i++) {
            let archivo = files[i];
            let lector = new FileReader();

            let tipoKML = /kml.*/;

            if (archivo.type.match(tipoKML) || archivo.name.match(tipoKML)) {
                lector.onload = function (event) {
                    let kml = lector.result;
                    let coordenadas = $(kml).find('coordinates').text();
                    let cleanCoordenadas = coordenadas.trim().split('\n');
                    let points = [];
                    for (let j = 0; j < cleanCoordenadas.length; j++) {
                        let coordenada = cleanCoordenadas[j].split(',');
                        let latitud = coordenada[1];
                        let longitud = coordenada[0];
                        points.push({ lat: parseFloat(latitud), lng: parseFloat(longitud) });
                    }

                    let ruta = new google.maps.Polyline({
                        path: points,
                        strokeColor: "#FF0000",
                        strokeOpacity: 1.0,
                        strokeWeight: 2
                    });
                    ruta.setMap(this.mapaGeoposicionado);
                }.bind(this);

                lector.readAsText(archivo);
            } else {
                alert("El archivo seleccionado no es de tipo KML");
            }
        }

    }

    /**
     * Función para leer un archivo SVG
     * @param {*} files Archivo que se lee
     */
    readSVG(files) {
        const nFiles = files.length;

        for (let i = 0; i < nFiles; i++) {
            let archivo = files[i];
            let lector = new FileReader();

            let tipoSVG = /svg.*/;

            if (archivo.type.match(tipoSVG)) {
                lector.onload = function (event) {
                    let svg = lector.result;

                    let result = $($.parseXML(svg)).find('svg');

                    // Se eliminan estos atributos para evitar problemas de validación
                    result.removeAttr('xmlns').removeAttr('version');
                    result.removeAttr('width').removeAttr('height');

                    result.appendTo("section:first");
                }.bind(this);
                lector.readAsText(archivo);
            }
        }

    }

    //-------------------- CÓDIGO DE CARRUSEL DE IMÁGENES --------------------
    nextSlide() {
        if (this.curSlide === this.maxSlide) {
            this.curSlide = 0;
        } else {
            this.curSlide++;
        }

        this.slides.each((indx, slide) => {
            let trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    }

    prevSlide() {
        if (this.curSlide === 0) {
            this.curSlide = this.maxSlide;
        } else {
            this.curSlide--;
        }

        this.slides.each((indx, slide) => {
            let trans = 100 * (indx - this.curSlide);
            $(slide).css('transform', 'translateX(' + trans + '%)')
        });
    }
}

var viajes = new Viajes();
