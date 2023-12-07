class Crucigrama {

    /* Constructor de la clase */
    constructor(columns, rows, board) {
        this.columns = columns;
        this.rows = rows;
        this.board = board;
        this.init_time;
        this.end_time;

        this.cells = [];
        for (let i = 0; i < rows; i++) {
            this.cells[i] = new Array(columns);
        }

        this.start(board);
    }

    start(board) {
        /* Split the board in an array */
        board = board.split(',');

        /* Fill the cells with the data of board */
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (board[i * this.columns + j] == '.') {
                    this.cells[i][j] = 0;
                } else if (board[i * this.columns + j] == '#') {
                    this.cells[i][j] = -1;
                } else {
                    this.cells[i][j] = board[i * this.columns + j];
                }
            }
        }
    }

    paintMathword() {
        const section = document.querySelector('main');

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let p = document.createElement('p');
                /* Mover esta parte a la función de abajo */
                if (this.cells[i][j] === 0) {
                    p.textContent = "";
                    p.setAttribute("data-state", "init");
                    p.addEventListener("click", () => {
                        p.setAttribute("data-state", "clicked");
                    });
                } else if (this.cells[i][j] === -1) {
                    p.textContent = "";
                    p.setAttribute("data-state", "empty");
                } else {
                    p.textContent = this.cells[i][j];
                    p.setAttribute("data-state", "blocked");
                }
                p.setAttribute("data-row", i);
                p.setAttribute("data-column", j);

                section.appendChild(p);
            }
        }
        this.init_time = new Date();

    }

    check_win_condition() {
        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                if (this.cells[i][j] === 0) {
                    return false;
                }
            }
        }
        return true;
    }

    calculate_date_difference() {
        let result = this.end_time - this.init_time;

        let h = Math.floor(result / (1000 * 60 * 60));
        let m = Math.floor((result % (1000 * 60 * 60)) / (1000 * 60));
        let s = Math.floor((result % (1000 * 60)) / 1000);

        return h + ":" + m + ":" + s;
    }

    introduceElement(element) {
        if (document.querySelector('[data-state="clicked"]') == null) {
            alert("Selecciona una casilla");
            return;
        }

        let expression_row = true;
        let expression_col = true;

        /* Get the row and column of the selected cell */
        const row = document.querySelector('[data-state="clicked"]').getAttribute("data-row");
        const column = document.querySelector('[data-state="clicked"]').getAttribute("data-column");


        this.cells[row][column] = element;


        /* Check horizontal */
        if (this.cells[row][column + 1] != -1) {
            let counter = 0;
            while (this.cells[row][column + counter] != "=" && counter < 3) {
                console.log(this.cells[row][column + counter]);
                counter++;
            }

            let first_number = this.cells[row][column + counter - 3];
            let second_number = this.cells[row][column + counter - 1];
            let expression = this.cells[row][column + counter - 2];
            let result = this.cells[row][column + counter + 1];

            if (first_number != 0 && second_number != 0 && result != 0 && expression != 0) {
                const elements = [first_number, expression, second_number];
                expression_row = result == eval(elements.join(''));
            }
        }


        /* Check vertical */
        if (this.cells[row + 1][column] != -1) {
            let counter = 0;
            while (this.cells[row + counter][column] != "=") {
                counter++;
            }

            let first_number = this.cells[row + counter - 3][column];
            letsecond_number = this.cells[row + counter - 1][column];
            let expression = this.cells[row + counter - 2][column];
            let result = this.cells[row + counter + 1][column];

            if (first_number != 0 && second_number != 0 && result != 0 && expression != 0) {
                const elements = [first_number, expression, second_number];
                expression_col = result == eval(elements.join(''));
            }
        }


        if (expression_row && expression_col) {
            let p = document.querySelector('[data-state="clicked"]');
            p.textContent = element
            p.setAttribute("data-state", "correct");
        } else {
            this.cells[row][column] = 0;
            p.setAttribute("data-state", "init");
            alert("El número introducido es incorrecto");

        }

        if (this.check_win_condition()) {
            this.end_time = new Date();
            alert("Has ganado en " + this.calculate_date_difference());
        }

    }
}

// var crucigrama = new Crucigrama(9, 11, "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16");
var crucigrama = new Crucigrama(9, 11, "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32")
crucigrama.paintMathword();

addEventListener("keydown", (event) => {
    if (/^[1-9+\-*\/]$/.test(event.key)) {
        crucigrama.introduceElement(event.key);
    }
});