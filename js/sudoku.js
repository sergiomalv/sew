class Sudoku {

    /* Constuctor de la clase*/
    constructor(rows, columns, gameString) {
        this.rows = rows;
        this.columns = columns;

        this.cells = [];
        for (let i = 0; i < rows; i++) {
            this.cells[i] = new Array(columns);
        }
        this.start(gameString);

    }

    start(gameString) {
        /* Fill the cells with the data of gameString */
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

    createStructure() {
        const section = document.querySelector('main');

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let p = document.createElement('p');
                if (this.cells[i][j] === 0) {
                    p.textContent = "";
                    p.setAttribute("data-state", "init");
                    p.addEventListener("click", () => {
                        p.setAttribute("data-state", "clicked");
                    });
                } else {
                    p.textContent = this.cells[i][j];
                    p.setAttribute("data-state", "blocked");
                }
                p.setAttribute("data-row", i);
                p.setAttribute("data-column", j);

                section.appendChild(p);
            }
        }
    }

    paintSudoku() {
        this.createStructure();
    }

    introduceNumber(number) {
        if (document.querySelector('[data-state="clicked"]') == null) {
            alert("Selecciona una casilla");
            return;
        }

        /* Get the row and column of the selected cell */
        let row = document.querySelector('[data-state="clicked"]').getAttribute("data-row");
        let column = document.querySelector('[data-state="clicked"]').getAttribute("data-column");

        /* Check if the number is correct */
        /* Check if the number is in the row */
        for (let i = 0; i < this.rows; i++) {
            if (this.cells[row][i] == number) {
                alert("Número incorrecto");
                return;
            }
        }

        /* Check if the number is in the column */
        for (let i = 0; i < this.columns; i++) {
            if (this.cells[i][column] == number) {
                alert("Número incorrecto");
                return;
            }
        }

        /* Check if the number is in the square */
        let squareRow = Math.floor(row / 3) * 3;
        let squareColumn = Math.floor(column / 3) * 3;
        for (let i = squareRow; i < squareRow + 3; i++) {
            for (let j = squareColumn; j < squareColumn + 3; j++) {
                if (this.cells[i][j] == number) {
                    alert("Número incorrecto");
                    return;
                }
            }
        }


        let p = document.querySelector('[data-state="clicked"]');
        p.textContent = number
        p.setAttribute("data-state", "correct");

        checkSudoku();
    }

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