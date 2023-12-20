"use strict";
class DiarioViaje {
    constructor(nombreBaseDatos) {
        // En primer lugar pedimos permisos para usar la ubicación y comprobamos que está disponible
        if ("geolocation" in navigator) {
            navigator.geolocation.getCurrentPosition(this.posicionAccesible.bind(this), this.procesarError.bind(this));
        } else {
            alert('La geolocalización no está disponible, se usarán las coordenadas 0,0');
            this.ubicacionInnacesible = true;
        }

        this.nombreBaseDatos = nombreBaseDatos;
        this.start();
    }

    /**
     * Método para comprobar que la ubicación está disponible
     * @param {*} posicion Datos sobre la posición del usuario
     */
    posicionAccesible(posicion) {
        this.ubicacionInnacesible = false;
    }

    /**
     * Método para comprabar que la ubicación no está disponible
     * @param {*} error Error que recibe el método
     */
    procesarError(error) {
        alert('Error al obtener la localización, se usará la localización 0,0');
        this.ubicacionInnacesible = true;
    }

    /**
     * Método para iniciar la base de datos 
     */
    start() {
        // Nos conectamos la base de datos 
        let openRequest = indexedDB.open(this.nombreBaseDatos);

        // Si la base de datos no existe, la creamos
        openRequest.onupgradeneeded = (event) => {
            this.db = event.target.result;
            // Creamos un almacén de objetos para contener las entradas del diario
            if (!this.db.objectStoreNames.contains('entradas')) {
                this.db.createObjectStore('entradas', { autoIncrement: true });
            }
        };

        // Si la base de datos existe, la asignamos a la variable this.db
        openRequest.onsuccess = (event) => {
            this.db = event.target.result;
        };

        // Si hay un error, lo mostramos en la consola
        openRequest.onerror = (event) => {
            alert("Error al abrir la base de datos");
        };
    }

    /**
     * Método para añadir una entrada al diario 
     */
    añadirEntrada() {
        // Obtenemos los valores del formulario
        let form = document.querySelector("form");
        let titulo = form.elements['title'].value;
        let contentValue = form.elements['content'].value;

        if (titulo === '' || contentValue === '') {
            alert('Debes rellenar todos los campos');
            return;
        }

        // Obtenemos la localización
        let long = 0.0;
        let lat = 0.0;
        if (!this.ubicacionInnacesible) {
            navigator.geolocation.getCurrentPosition(function (position) {
                long = position.coords.longitude;
                lat = position.coords.latitude;

                // Creamos la entrada del diario
                let entrada = {
                    date: new Date(),
                    title: titulo,
                    text: contentValue,
                    longitud: long,
                    latitud: lat
                };

                // Creamos una transacción de lectura/escritura y guardamos la entrada 
                let transaction = this.db.transaction(['entradas'], 'readwrite');
                let store = transaction.objectStore('entradas');
                let request = store.add(entrada);

                request.onsuccess = () => {
                    alert('Entrada añadida al diario');
                };

                request.onerror = (event) => {
                    alert('Error al añadir la entrada al diario');
                };
            }.bind(this));
        }
    }

    /**
     * Método para obtener todas las entradas del diari
     */
    getEntradas() {
        // Creamos una transacción de solo lectura y obtenemos todas las entradas del diario
        let transaction = this.db.transaction(['entradas'], 'readonly');
        let store = transaction.objectStore('entradas');
        let request = store.getAll();

        request.onsuccess = () => {
            const section = $('section:nth-of-type(2)');

            // Borramos el contenido de la sección
            section.empty();
            // Añadimos un título a la section
            section.append($('<h2>').text('Entradas del diario'));
            // Añadimos un boton a la section para recuerar las entradas
            section.append($('<button>').text('Recuperar entradas').on('click', () => {
                this.getEntradas();
            }));

            // Recorremos todas las entradas y las mostramos en la sección
            request.result.forEach((entrada) => {

                let titulo = $('<h3>').text(entrada.title);
                let texto = $('<p>').text(entrada.text);

                let fecha = new Date(entrada.date).toLocaleString();
                let localizacion = `Latitud: ${entrada.latitud}, Longitud: ${entrada.longitud}`;
                let info = $('<p>').html(`<em>${localizacion} - ${fecha}</em>`);

                let boton = $('<button>').text('Copiar el texto al portapapeles').on('click', () => {
                    this.copiarTextoAlPortapapeles(entrada.text);
                });

                section.append(titulo).append(texto).append(info);
                section.append(boton);
            });
        };
    }

    /**
     * Método para copiar una entrada al portapapeles
     * @param {*} texto Texto que copiamos al portapapeles
     */
    copiarTextoAlPortapapeles(texto) {
        navigator.clipboard.writeText(texto)
            .then(() => {
                alert('Texto copiado al portapapeles');
            })
            .catch(err => {
                alert('Error al copiar el texto al portapapeles');
            });
    }

}

var diario = new DiarioViaje('Diario de viaje');