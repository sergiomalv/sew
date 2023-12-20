"use strict";
class Agenda {

    /* Constructor de la clase */
    constructor() {
        this.url = "https://ergast.com/api/f1/current"

        // Comprobar que la petición ha sido realizada hace más de 10 minutos
        this.last_api_call = null
        // Resultado de la última petición a la API
        this.last_api_result = null
    }

    /**
     * Retorna la información de la agenda de Fórmula 1, en el caso de que la petición haya sido realizada 
     * hace más de 10 minutos, se realiza una nueva petición a la API
     */
    getData() {
        // Comprobamos que la petición ha sido realizada hace más de 10 minutos
        if (this.last_api_call === null){
            this.last_api_call = new Date().getTime();
        } else {
            let actual = new Date().getTime();
            if (actual - this.last_api_call < 600000){
                alert("¡La petición se ha realizado hace menos de 10 minutos!");
                return;
            } 
        }

        $.ajax({
            dataType: "xml",
            url: this.url,
            method: 'GET',
            success: function (datos) {
                // Guardamos la última llamada a la API y su estampa de tiempo
                this.last_api_result = datos;
                this.last_api_call = new Date().getTime();

                const title = $("<h2>Agenda de Fórmula 1</h2>");
                const section = $("<section></section>").attr("data-type", "races");
                title.appendTo(section);

                var carreras = $('RaceTable', datos).children();

                var result = "";
                for (let i = 0; i < carreras.length; i++) {
                    const article = $("<article></article>").attr("data-type", "race");
                    result += "<h3>" + $('RaceName', carreras[i]).text() + "</h3>";
                    result += "<ul>";

                    result += "<li> Circuito: " + $('Circuit', carreras[i]).children('CircuitName').text() + "</li>";
                    result += "<li> Coordenadas: " + $('Circuit', carreras[i]).children('Location').attr("lat") + ", " +
                        $('Circuit', carreras[i]).children('Location').attr("long") + "</li>";
                    result += "<li> Fecha: " + $('Date', carreras[i]).first().text() + "</li>";
                    result += "<li> Hora: " + $('Time', carreras[i]).first().text().slice(0, -4) + "</li>";

                    result += "</ul>";

                    article.append(result).appendTo(section);
                    result = "";
                }

                section.appendTo("body");
            },
            error: function () {
                const title = $("<h2>Agenda de Fórmula 1</h2>");
                const fail = $("<section></section>").attr("data-type", "error");
                title.appendTo(fail);
                fail.append("<p>Algo ha ido mal</p>").appendTo("body");
            }
        });
    }

}

var agenda = new Agenda();
