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
        const main = $("main");

        for (let i = 0; i < this.rows; i++) {
            for (let j = 0; j < this.columns; j++) {
                let p = $("<p></p>");
                /* Mover esta parte a la función de abajo */
                if (this.cells[i][j] === 0) {
                    p.attr("data-state", "init");
                    p.on("click", () => {
                        if ($('p[data-state="clicked"]') != null) {
                            $('p[data-state="clicked"]').attr("data-state", "init");
                        }
                        p.attr("data-state", "clicked");
                    });
                } else if (this.cells[i][j] === -1) {
                    p.attr("data-state", "empty");
                } else {
                    p.text(this.cells[i][j]);
                    p.attr("data-state", "blocked");
                }
                p.attr("data-row", i);
                p.attr("data-column", j);

                main.append(p);
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
    
        // Añadir un cero al principio si el número es menor que 10
        h = h < 10 ? '0' + h : h;
        m = m < 10 ? '0' + m : m;
        s = s < 10 ? '0' + s : s;
    
        return h + ":" + m + ":" + s;
    }
    

    introduceElement(element) {
        if ($('p[data-state="clicked"]') == null) {
            alert("Selecciona una casilla");
            return;
        }

        let expression_row = true;
        let expression_col = true;

        /* Get the row and column of the selected cell */
        const row = parseInt($('p[data-state="clicked"]').attr("data-row"));
        const column = parseInt($('p[data-state="clicked"]').attr("data-column"));

        this.cells[row][column] = element;


        /* Check horizontal */
        if (column < this.columns -1 && this.cells[row][column + 1] != -1) {
            let counter = 0;
            while (this.cells[row][column + counter] != "=") {
                counter++;
            }

            let first_number = this.cells[row][column + counter - 3];
            let second_number = this.cells[row][column + counter - 1];
            let expression = this.cells[row][column + counter - 2];
            let result = this.cells[row][column + counter + 1];

            if (first_number != 0 && second_number != 0 && result != 0 && expression != 0) {
                const elements = [first_number, expression, second_number];
                try {
                    expression_col = result == eval(elements.join(''));
                } catch (error) {
                    expression_col = false;
                }
            }
        }


        /* Check vertical */
        if (row < this.rows -1 && this.cells[row + 1][column] != -1) {
            let counter = 0;
            while (this.cells[row + counter][column] != "=") {
                counter++;
            }

            let first_number = this.cells[row + counter - 3][column];
            let second_number = this.cells[row + counter - 1][column];
            let expression = this.cells[row + counter - 2][column];
            let result = this.cells[row + counter + 1][column];

            if (first_number != 0 && second_number != 0 && result != 0 && expression != 0) {
                const elements = [first_number, expression, second_number];
                try {
                    expression_col = result == eval(elements.join(''));
                } catch (error) {
                    expression_col = false;
                }
            }
        }

        let p = $('p[data-state="clicked"]');
        if (expression_row && expression_col) {
            p.text(element);
            p.attr("data-state", "correct");
        } else {
            this.cells[row][column] = 0;
            p.attr("data-state", "init");
            alert("El elemento introducido es incorrecto");

        }

        if (this.check_win_condition()) {
            this.end_time = new Date();
            alert("Has ganado en " + this.calculate_date_difference());
        }

    }
}

var crucigrama = new Crucigrama(9, 11, "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16");
// var crucigrama = new Crucigrama(9, 11, "12,*,.,=,36,#,#,#,15,#,#,*,#,/,#,#,#,*,.,-,.,=,.,#,55,#,.,*,#,=,#,=,#,/,#,=,.,#,15,#,9,*,.,=,45,=,#,#,#,#,#,=,#,#,72,#,20,-,.,=,11,#,.,#,#,-,#,+,#,#,#,*,56,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,12,#,16,*,.,=,32")
// var crucigrama = new Crucigrama(9, 11, "4,.,.,=,36,#,#,#,25,#,#,*,#,.,#,#,#,.,.,-,.,=,.,#,15,#,.,*,#,=,#,=,#,.,#,=,.,#,18,#,6,*,.,=,30,=,#,#,#,#,#,=,#,#,56,#,9,-,.,=,3,#,.,#,#,*,#,+,#,#,#,*,20,.,.,=,18,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,18,#,24,.,.,=,72");
crucigrama.paintMathword();

addEventListener("keydown", (event) => {
    if (/^[1-9+\-*\/]$/.test(event.key)) {
        crucigrama.introduceElement(event.key);
    }
});