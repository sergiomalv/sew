class Crucigrama {

    /* Constructor de la clase */
    constructor(columns, rows, board) {
        this.columns = columns;
        this.rows = rows;
        this.board = board

        this.cells = [];
        for (let i = 0; i < rows; i++) {
            this.cells[i] = new Array(columns);
        }

        this.start(board);
    }

    start(board) {
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
        this.init_time = new Date();
        
    }
}

var crucigrama = new Crucigrama(9, 11, "4,*,.,=,12,#,#,#,5,#,#,*,#,/,#,#,#,*,4,-,.,=,.,#,15,#,.,*,#,=,#,=,#,/,#,=,.,#,3,#,4,*,.,=,20,=,#,#,#,#,#,=,#,#,8,#,9,-,.,=,3,#,.,#,#,-,#,+,#,#,#,*,6,/,.,=,.,#,#,#,.,#,#,=,#,=,#,#,#,=,#,#,6,#,8,*,.,=,16");