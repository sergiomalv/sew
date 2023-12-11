class Noticias {

    constructor() {

        if (window.File && window.FileReader && window.FileList && window.Blob) {
            const main = $("main");
            const label = $("<label>Selecciona un archivo de texto: </label>");
            const input = $("<input type='file' name='files' onchange='noticias.readInputFile(this.files);'>");
            main.append(label).append(input);
        }
        else document.write("<p>¡¡¡ Este navegador NO soporta el API File y este programa puede no funcionar correctamente !!!</p>");
    }

    readInputFile(file) {
        var archivo = file[0];

        var tipoTexto = /text.*/;

        if (archivo.type.match(tipoTexto)) {
            var lector = new FileReader();
            lector.onload = function (evento) {
                var text = lector.result.split("\n");

                const main = $("main");

                for (var i = 0; i < text.length; i++) {
                    var noticia = text[i].split("_");
                    var title = $("<h3></h3>").text(noticia[0]);
                    var content = $("<p></p>").text(noticia[1] + ". " + noticia[2] + ".");
                    var author = $("<em></em>").text(noticia[3]);

                    main.append(title).append(content).append(author);
                }
            }
        }
        lector.readAsText(archivo);
    }

    addNoticia() {
        const main = $("main");

        var form = document.querySelector("form");
        var titleValue = form.elements['title'].value;
        var contentValue = form.elements['content'].value;
        var authorValue = form.elements['author'].value;

        var titleElement = $("<h3></h3>").text(titleValue);
        var contentElement = $("<p></p>").text(contentValue);
        var authorElement = $("<em></em>").text(authorValue);

        main.append(titleElement).append(contentElement).append(authorElement);
    }

}

var noticias = new Noticias();
