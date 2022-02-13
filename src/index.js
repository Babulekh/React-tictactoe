import React from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
    return (
        <button className={"square" + (props.isWinner ? " winner" : "")} onClick={props.onClick}>
            {props.value}
        </button>
    );
}

class Board extends React.Component {
    renderSquare(i, j, isWinner) {
        return <Square key={this.props.boardSize * i + j + 1} value={this.props.squares[i][j]} onClick={() => this.props.onClick(i, j)} isWinner={isWinner} />;
    }

    render() {
        let board = [];
        let isWinner;

        for (let i = 0; i < this.props.boardSize; i++) {
            let row = [];
            for (let j = 0; j < this.props.boardSize; j++) {
                isWinner = false;
                if (this.props.winnerCells && ((i === this.props.winnerCells[0][0] && j === this.props.winnerCells[0][1]) || (i === this.props.winnerCells[1][0] && j === this.props.winnerCells[1][1]) || (i === this.props.winnerCells[2][0] && j === this.props.winnerCells[2][1]))) {
                    isWinner = true;
                }
                row.push(this.renderSquare(i, j, isWinner));
            }

            board.push(
                <div key={(i + 1) * 10} className="board-row">
                    {row}
                </div>
            );
        }
        return <div>{board}</div>;
    }
}

class Game extends React.Component {
    constructor(props) {
        super(props);
        this.boardSize = 3;
        this.state = {
            history: [{ squares: Array(this.boardSize).fill(Array(this.boardSize).fill(null)), currentCell: [null, null] }],
            stepNumber: 0,
            xIsNext: true,
        };
    }

    handleClick(i, j) {
        const history = this.state.history.slice(0, this.state.stepNumber + 1);
        const current = history[history.length - 1];
        const squares = current.squares.map((row) => {
            return row.slice();
        });
        if (calculateWinner(squares) || squares[i][j]) {
            return;
        }
        squares[i][j] = this.state.xIsNext ? "X" : "O";
        this.setState({
            history: history.concat([
                {
                    squares: squares,
                    currentCell: [i, j],
                },
            ]),
            stepNumber: history.length,
            xIsNext: !this.state.xIsNext,
        });
    }

    jumpTo(step) {
        this.setState({
            stepNumber: step,
            xIsNext: step % 2 === 0,
        });
    }

    render() {
        const history = this.state.history;
        const current = history[this.state.stepNumber];
        const winner = calculateWinner(current.squares);

        const moves = history.map((step, move) => {
            const desc = move ? "Go to move #" + move : "Go to game start";
            const cellCoords = move ? ` | row:${step.currentCell[0] + 1}, col:${step.currentCell[1] + 1}` : "";
            let classList = ["move-button"];

            if (move == this.state.stepNumber) {
                classList.push("selected");
            }

            return (
                <li key={move}>
                    <button className={classList.join(" ")} onClick={() => this.jumpTo(move)}>
                        {desc} {cellCoords}
                    </button>
                </li>
            );
        });

        let status;
        let winnerCells = null;

        if (winner) {
            status = "Winner is: " + (this.state.xIsNext ? "O" : "X");
            winnerCells = winner;
        } else {
            if (this.state.stepNumber == this.boardSize * this.boardSize) {
                status = "No winner: Tie";
            } else {
                status = "Next player: " + (this.state.xIsNext ? "X" : "O");
            }
        }

        return (
            <div className="game">
                <div className="game-board">
                    <Board winnerCells={winnerCells} boardSize={this.boardSize} squares={current.squares} onClick={(i, j) => this.handleClick(i, j)} />
                </div>
                <div className="game-info">
                    <div>{status}</div>
                    <ol>{moves}</ol>
                </div>
            </div>
        );
    }
}

function calculateWinner(squares) {
    const lines = [
        [
            [0, 0],
            [0, 1],
            [0, 2],
        ],
        [
            [1, 0],
            [1, 1],
            [1, 2],
        ],
        [
            [2, 0],
            [2, 1],
            [2, 2],
        ],
        [
            [0, 0],
            [1, 0],
            [2, 0],
        ],
        [
            [0, 1],
            [1, 1],
            [2, 1],
        ],
        [
            [0, 2],
            [1, 2],
            [2, 2],
        ],
        [
            [0, 0],
            [1, 1],
            [2, 2],
        ],
        [
            [0, 2],
            [1, 1],
            [2, 0],
        ],
    ];

    for (let i = 0; i < lines.length; i++) {
        const [a, b, c] = lines[i];
        if (squares[a[0]][a[1]] && squares[a[0]][a[1]] === squares[b[0]][b[1]] && squares[b[0]][b[1]] === squares[c[0]][c[1]]) {
            return lines[i];
        }
    }
    return null;
}

// ========================================

ReactDOM.render(
    <React.StrictMode>
        <Game />
    </React.StrictMode>,
    document.getElementById("root")
);
