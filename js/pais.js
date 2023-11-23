"use strict";
class Pais {

    constructor (pais, capital, poblacion){
        this.pais = pais;
        this.capital = capital;
        this.poblacion = poblacion;

    }

    fill_data(forma_gobierno, coordenadas_capital, religion_mayoritaria){
        this.forma_gobierno = forma_gobierno;
        this.coordenadas_capital = coordenadas_capital;
        this.religion_mayoritaria = religion_mayoritaria;
    }

    get_pais(){
        return this.pais;
    }

    get_capital(){
        return this.capital;
    }

    get_poblacion(){
        return this.poblacion;
    }

    get_forma_gobierno(){
        return this.forma_gobierno;
    }

    get_coordenadas_capital(){
        return this.coordenadas_capital;
    }

    get_religion_mayoritaria(){
        return this.religion_mayoritaria;
    }

    get_info_list(){
        var result = "";

        result += "<ul>";
        result += "<li> Población: " + this.get_poblacion() + "</li>";
        result += "<li> Forma de gobierno: " + this.get_forma_gobierno() + "</li>";
        result += "<li> Religión mayoritaria: " + this.get_religion_mayoritaria() + "</li>";
        result += "</ul>";

        return result
    }

    write_coordinates(){
        document.write("<p>" + this.coordenadas_capital + "</p>");
    }

    getWeather() {
        API_KEY = "36c03ab57467d8c7424b4a7948d090e4";

        const url = "https://api.openweathermap.org/data/2.5/weather?q=" + 
            this.capital + ",SVK&units=metric&lang=es&APPID=" + API_KEY;

        $.ajax({
            dataType: "json",
            url: this.url,
            method: 'GET',
            success: function(datos){
                    $("pre").text(JSON.stringify(datos, null, 2));
            }
        });

    }
}
