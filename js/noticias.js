class Noticias {

    constructor() {

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            this.readInputFile();
        }
        else document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
    }

    readInputFile(files) {
        var archivo = files[0];
        
    }
}