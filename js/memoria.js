"use strict";
class Memoria {

    /* JSON de elementos */
    elements = {
        "elements": [
            {
                "element": "HTML5",
                "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg",
                "data-state": "init"
            },
            {
                "element": "HTML5",
                "source": "https://upload.wikimedia.org/wikipedia/commons/3/38/HTML5_Badge.svg",
                "data-state": "init"
            },
            {
                "element": "CSS3",
                "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg",
                "data-state": "init"
            },
            {
                "element": "CSS3",
                "source": "https://upload.wikimedia.org/wikipedia/commons/6/62/CSS3_logo.svg",
                "data-state": "init"
            },
            {
                "element": "JS",
                "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg",
                "data-state": "init"
            },
            {
                "element": "JS",
                "source": "https://upload.wikimedia.org/wikipedia/commons/b/ba/Javascript_badge.svg",
                "data-state": "init"
            },
            {
                "element": "PHP",
                "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
                "data-state": "init"
            },
            {
                "element": "PHP",
                "source": "https://upload.wikimedia.org/wikipedia/commons/2/27/PHP-logo.svg",
                "data-state": "init"
            },
            {
                "element": "SVG",
                "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg",
                "data-state": "init"
            },
            {
                "element": "SVG",
                "source": "https://upload.wikimedia.org/wikipedia/commons/4/4f/SVG_Logo.svg",
                "data-state": "init"
            },
            {
                "element": "W3C",
                "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg",
                "data-state": "init"
            },
            {
                "element": "W3C",
                "source": "https://upload.wikimedia.org/wikipedia/commons/5/5e/W3C_icon.svg",
                "data-state": "init"
            }
        ]
    }

    /* Constructor de la clase */
    constructor() {
        this.hasFlippedCard = false;
        this.lockBoard = false;
        this.firstCard = null;
        this.secondCard = null;

        this.shuffleElements();
        this.createElements();
        this.addEventListeners();
    }

    /**
     * Método para barajar los elementos del JSON
     */
    shuffleElements() {
        // Algoritmo Durstenfeld
        let indiceActual = this.elements.elements.length;
        let indiceAleatorio;

        while (indiceActual > 0){
            // Seleccionamos un elemento aleatorio
            indiceAleatorio = Math.floor(Math.random() * indiceActual);
            indiceActual--;

            // Intercambiamos el elemento seleccionado con el actual
            [this.elements.elements[indiceActual], this.elements.elements[indiceAleatorio]] = 
            [this.elements.elements[indiceAleatorio], this.elements.elements[indiceActual]];

        }
    }

    /**
     * Método para voltear la carta seleccionada
     */
    unflipCards() {
        this.lockBoard = true;

        // Esperamos 1 segundo para dar tiempo a ver la segunda carta
        setTimeout(() => {
            this.firstCard.setAttribute("data-state", "init");
            this.secondCard.setAttribute("data-state", "init");
            this.resetBoard();
        }, 1000);
    }

    /**
     * Método para resetear el tablero
     */
    resetBoard(){
        this.firstCard = null;
        this.secondCard = null;
        this.hasFlippedCard = false;
        this.lockBoard = false;
    }

    /**
     * Método para comprobar si las cartas son iguales
     */
    checkForMatch(){
        this.firstCard.getAttribute("data-element") === this.secondCard.getAttribute("data-element") ? 
            this.disableCards() : this.unflipCards();
    }

    /**
     * Método para deshabilitar las cartas si son iguales
     */
    disableCards(){
        // Revelamos las dos cartas
        this.firstCard.setAttribute("data-state", "revealed");
        this.secondCard.setAttribute("data-state", "revealed");

        this.resetBoard();
    }

    /**
     * Método para crear las cartas del juego
     */
    createElements() {
        const section = document.querySelector('section:nth-of-type(2)');

        // Recorremos todos los elementos del JSON
        this.elements.elements.forEach(element => {
            const article = document.createElement('article');
            article.setAttribute("data-element", element.element);
            
            const title = document.createElement('h3');
            title.textContent = "Tarjeta de Memoria";

            const img = document.createElement('img');
            img.src = element.source;
            img.alt = element.element;

            article.appendChild(title);
            article.appendChild(img);

            section.appendChild(article);
        }
        );
    }

    addEventListeners() {
        const articles = document.querySelectorAll('article');
        articles.forEach(article => {
            article.addEventListener('click', this.flipCard.bind(article, this));
        });
    }

    /**
     * Lógica del juego cuando se voltean las cartas
     * @param {*} game Estado del juego
     */
    flipCard(game) {
        // Si el tablero está bloqueado, no hacemos nada
        if (game.lockBoard) return;

        // Si la carta ya está revelada, no hacemos nada
        if (this.getAttribute("data-state") === "revealed") return;

        if (this === game.firstCard) return;
        
        this.setAttribute("data-state", "flip");
        // Si es la primera carta que se voltea
        if (!game.hasFlippedCard) {
            game.hasFlippedCard = true;
            game.firstCard = this;
            return;
        }

        // Si es la segunda carta que se voltea
        game.hasFlippedCard = false;
        game.secondCard = this;
        // Comprobamos si hay match
        game.checkForMatch();
    }
}

var memoria = new Memoria();
