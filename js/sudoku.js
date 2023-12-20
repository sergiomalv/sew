"use strict";
class Sudoku {

    /* Constuctor de la clase*/
    constructor(rows, columns, gameString) {
        this.rows = rows;
        this.columns = columns;

        this.cells = new Array(rows);
        for (let i = 0; i < rows; i++) {
            this.cells[i] = new Array(columns);
        }
        this.start(gameString);

    }

    /**
     * Inicializa el juego en función del string que se le pasa
     * @param {*} gameString Juego inicial en formato string
     */
    start(gameString) {
        // Inicializamos el array de celdas y le asociamos el valor
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (gameString[i * this.columns + j] == '.') {
                    this.cells[i][j] = 0;
                } else {
                    this.cells[i][j] = gameString[i * this.columns + j];
                }
            }
        }
    }

    /**
     * Método para la creación de la estructura del sudoku en el HTML
     */
    createStructure() {
        const main = document.querySelector('main');

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let p = document.createElement('p');
                main.appendChild(p);
            }
        }
    }

    /**
     * Método para pintar el sudoku en el HTML
     */
    paintSudoku() {
        this.createStructure();
        let all = document.querySelectorAll('p');
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let p = all[i * this.columns + j];
                if (this.cells[i][j] === 0) {
                    p.textContent = "";
                    p.setAttribute("data-state", "init");
                    p.addEventListener("click", () => {
                        if (document.querySelector('[data-state="clicked"]') != null) {
                            document.querySelector('[data-state="clicked"]').setAttribute("data-state", "init");
                        }
                        p.setAttribute("data-state", "clicked");
                    });
                } else {
                    p.textContent = this.cells[i][j];
                    p.setAttribute("data-state", "blocked");
                }
                p.setAttribute("data-row", i);
                p.setAttribute("data-column", j);
            }
        }
    }

    /**
     * Método con la lógica a seguir cuando se introduce un número
     * @param {*} number Número que se introduce
     */
    introduceNumber(number) {
        // Comprombar que se ha seleccionado una casilla
        if (document.querySelector('[data-state="clicked"]') == null) {
            alert("Selecciona una casilla");
            return;
        }

        // Se obtiene la celda y la columna del número seleccionado
        let row = document.querySelector('[data-state="clicked"]').getAttribute("data-row");
        let column = document.querySelector('[data-state="clicked"]').getAttribute("data-column");

        // Comprobamos que es un número válido	
        // Check horizontal
        for (let i = 0; i < this.rows; i++) {
            if (this.cells[row][i] === number) {
                alert("Ya existe ese número en la fila");
                return;
            }
        }

        // Check vertical
        for (let i = 0; i < this.columns; i++) {
            if (this.cells[i][column] === number) {
                alert("Ya existe ese número en la columna");
                return;
            }
        }

        // Check de casilla
        let squareRow = Math.floor(row / 3) * 3;
        let squareColumn = Math.floor(column / 3) * 3;
        for (let i = squareRow; i < squareRow + 3; i++) {
            for (let j = squareColumn; j < squareColumn + 3; j++) {
                if (this.cells[i][j] === number) {
                    alert("Ya existe ese número en la cuadrícula");
                    return;
                }
            }
        }

        // Si todo es correcto, se introduce el número
        let p = document.querySelector('[data-state="clicked"]');
        p.textContent = number
        p.setAttribute("data-state", "correct");
        this.cells[row][column] = number;

        // Comprobamos que hemos finalizado el juego
        checkSudoku();
    }

    /**
     * Método para comprobar si se ha ganado el juego
     */
    checkSudoku() {

        let correct = true;
        let p = document.querySelectorAll('p');
        for (let i = 0; i < p.length; i++) {
            if (p[i].getAttribute("data-state") == "init") {
                correct = false;
            }
        }

        if (correct) {
            alert("Has ganado");
        }
    }

}

var sudoku = new Sudoku(9, 9,
    "3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6");
sudoku.paintSudoku();

addEventListener("keydown", (event) => {
    if (event.key >= 1 && event.key <= 9)
        sudoku.introduceNumber(event.key);
});