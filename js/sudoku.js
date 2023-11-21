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

                section.appendChild(p);
            }
        }
    }

    paintSudoku() {
        this.createStructure();
    }

}

var sudoku = new Sudoku(9, 9,
    "3.4.69.5....27...49.2..4....2..85.198.9...2.551.39..6....8..5.32...46....4.75.9.6");
sudoku.paintSudoku();