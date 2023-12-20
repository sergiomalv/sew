class Noticias {

    constructor() {

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            const main = $("main");
            const label = $("<label for='files'>Selecciona un fichero de texto </label>");
            const input = $("<input type='file' name='files' id='files' onchange='noticias.readInputFile(this.files);'/>");
            main.append(label).append(input);
        }
        else document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
    }

    /**
     * Lee un conjunto de noticias de un fichero de texto
     * @param {*} file Archivo que se lee
     */
    readInputFile(file) {
        let archivo = file[0];

        let tipoTexto = /text.*/;

        if (archivo.type.match(tipoTexto)) {
            let lector = new FileReader();
            lector.onload = function (evento) {
                let text = lector.result.split("\n");

                const main = $("main");

                for (let i = 0; i < text.length; i++) {
                    let noticia = text[i].split("_");
                    let title = $("<h3></h3>").text(noticia[0]);
                    let entradilla = $("<h4></h4>").text(noticia[1]);
                    let content = $("<p></p>").text(noticia[2] + ".");
                    let author = $("<em></em>").text(noticia[3]);

                    main.append(title).append(entradilla).append(content).append(author);
                }
            }
            lector.readAsText(archivo);
        } else {
            alert("El archivo seleccionado no es un texto");
        }
    }

    /**
     * Formulario para introducir nuevas noticias
     */
    addNoticia() {
        const main = $("main");

        let form = document.querySelector("form");
        let titleValue = form.elements['title'].value;
        let entradillaValue = form.elements['entradilla'].value;
        let contentValue = form.elements['content'].value;
        let authorValue = form.elements['author'].value;

        let titleElement = $("<h3></h3>").text(titleValue);
        let entradillaElement = $("<h4></h4>").text(entradillaValue);
        let contentElement = $("<p></p>").text(contentValue);
        let authorElement = $("<em></em>").text(authorValue);

        main.append(titleElement).append(entradillaElement).append(contentElement).append(authorElement);
    }

}

var noticias = new Noticias();
