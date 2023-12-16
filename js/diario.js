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

    /* Método para procesar la posición */
    posicionAccesible(posicion) {
        this.ubicacionInnacesible = false;
    }

    /* Método para procesar el error */
    procesarError(error) {
        alert('Error al obtener la localización, se usará la localización 0,0');
        this.ubicacionInnacesible = true;
    }

    /* Método para iniciar la base de datos */
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

        // Si la base de datos existe, la asignamos a this.db
        openRequest.onsuccess = (event) => {
            this.db = event.target.result;
        };

        // Si hay un error, lo mostramos en la consola
        openRequest.onerror = (event) => {
            alert("Error al abrir la base de datos");
        };
    }

    /* Método para añadir una entrada al diario */
    añadirEntrada(titulo, texto) {
        // Obtenemos la localización
        let long = 0.0;
        let lat = 0.0;
        if (!this.ubicacionInnacesible) {
            posicion = getLocalizacion();
            long = posicion.longitude;
            lat = posicion.latitude;


            // Creamos la entrada del diario
            let entrada = {
                date: new Date(),
                title: titulo,
                text: texto,
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
        }
    }

    /* Método para obtener todas las entradas del diario */
    getEntradas() {
        // Creamos una transacción de solo lectura y obtenemos todas las entradas del diario
        let transaction = this.db.transaction(['entradas'], 'readonly');
        let store = transaction.objectStore('entradas');
        let request = store.getAll();

        request.onsuccess = () => {
            console.log(request.result);
        };
    }

    /* Método para copiar una entrada */
    copiarTextoAlPortapapeles(texto) {
        navigator.clipboard.writeText(texto)
            .then(() => {
                alert('Texto copiado al portapapeles');
            })
            .catch(err => {
                alert('Error al copiar el texto al portapapeles');
            });
    }

    /* Método para obtener la localización */
    getLocalizacion() {
        posicion = navigator.geolocation.getCurrentPosition(this.getPosicion.bind(this));

        if (posicion) {
            return posicion.coords;
        } else {
            alert('Error al obtener la localización, se usará la localización 0,0');
            this.longitud = 0.0;
            this.latitud = 0.0;
        }
    }
}

let diario = new DiarioViaje('Diario de viaje');