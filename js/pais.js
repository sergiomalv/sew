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
        result += "<li> Población: " + this.get_poblacion() + " habitantes</li>";
        result += "<li> Forma de gobierno: " + this.get_forma_gobierno() + "</li>";
        result += "<li> Religión mayoritaria: " + this.get_religion_mayoritaria() + "</li>";
        result += "</ul>";

        return result
    }

    write_coordinates() {
        document.write("<p> Coordenadas del país: " + this.coordenadas_capital + "</p>");
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
                const title = $("<h3>Meteorología para los próximos 5 días</h3>");
                
                const weather = $("<section></section>").attr("data-type", "weather");
                title.appendTo(weather);

                for(let i = 0; i < datos.list.length; i++){
                    if (datos.list[i].dt_txt.includes("12:00:00")) {
                        const dayWeather = $("<article></article>").attr("data-type", "weather-day");
                        const title = $("<h4></h4>").text(datos.list[i].dt_txt.split(" ")[0]);
                        let result = "";

                        
                        let icon = datos.list[i].weather[0].icon;
                        result += " <img src='https://openweathermap.org/img/w/" + icon + ".png' alt='Icono meteorológico' />";
                        result += "<ul>";
                        result += "<li>Temperatura: " + datos.list[i].main.temp + "ºC </li>";
                        result += "<li>T. máxima: " + datos.list[i].main.temp_max + "ºC </li>";
                        result += "<li>T. mínima: " + datos.list[i].main.temp_min + "ºC </li>";
                        result += "<li>Humedad: " + datos.list[i].main.humidity + "% </li>";
                        

                        if (datos.list[i].weather.hasOwnProperty("rain"))
                            result += "<li>LLuvia: " + datos.list[i].weather.rain["3h"] + " mm </li>";
                        else
                            result += "<li>Lluvia: 0 mm</li>";
                        
                        result += "</ul>";
                        
                        dayWeather.append(title);
                        dayWeather.append(result);
                        weather.append(dayWeather);
                    }
                }
                weather.appendTo("body");
            },
            error:function(){
                const weather = $("<section></section>").attr("data-type", "weather");
                weather.append("Algo ha ido mal").appendTo("body");
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