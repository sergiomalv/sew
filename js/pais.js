"use strict";
class Pais {

    constructor(pais, capital, poblacion) {
        this.pais = pais;
        this.capital = capital;
        this.poblacion = poblacion;

    }

    fill_data(forma_gobierno, coordenadas_capital, religion_mayoritaria) {
        this.forma_gobierno = forma_gobierno;
        this.coordenadas_capital = coordenadas_capital;
        this.religion_mayoritaria = religion_mayoritaria;
    }

    get_pais() {
        return this.pais;
    }

    get_capital() {
        return this.capital;
    }

    get_poblacion() {
        return this.poblacion;
    }

    get_forma_gobierno() {
        return this.forma_gobierno;
    }

    get_coordenadas_capital() {
        return this.coordenadas_capital;
    }

    get_religion_mayoritaria() {
        return this.religion_mayoritaria;
    }

    get_info_list() {
        var result = "";

        result += "<ul>";
        result += "<li> Población: " + this.get_poblacion() + "</li>";
        result += "<li> Forma de gobierno: " + this.get_forma_gobierno() + "</li>";
        result += "<li> Religión mayoritaria: " + this.get_religion_mayoritaria() + "</li>";
        result += "</ul>";

        return result
    }

    write_coordinates() {
        document.write("<p>" + this.coordenadas_capital + "</p>");
    }

    getWeather() {
        var API_KEY = "36c03ab57467d8c7424b4a7948d090e4";

        var data = this.coordenadas_capital.split(",");

        const url = "https://api.openweathermap.org/data/2.5/forecast?" +
            "lat=" + data[1] + "&lon=" + data[0] + "&units=metric&appid=" + API_KEY;


        $.ajax({
            dataType: "json",
            url: url,
            method: 'GET',
            success: function (datos) {
                var result = "<h3> Meteorología para los próximos 5 días </h3>";
                result += "<ul>";
                
                let counter = 1;
                for(let i = 0; i < datos.list.length; i+=8){
                    result += "<li> Previsión para dentro de " + counter + (counter == 1 ? " día": " días") + ": " + datos.list[i].main.temp + "ºC </li>";
                    counter++;
                }

                result += "</ul>";
                
                const weather = $("<section></section>").attr("data-type", "weather");
                
                weather.append(result).appendTo("body");
            },
            error:function(){
                $("p").html("Algo ha ido mal!");
            }
        });
    }
}

var pais = new Pais("Eslovaquia", "Bratislava", 5428792);
pais.fill_data("República parlamentaria", "17.1067400,48.1481600", "Cristianismo");

document.write("<h2>" + pais.get_pais() + "</h2>");
document.write(pais.get_info_list());
pais.write_coordinates();
pais.getWeather();