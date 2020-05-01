import React, { Component } from "react";
import ReactDOM from "react-dom";
import "./index.css";

function Square(props) {
  return (
    <button className="square" onClick={props.onClick}>
      {props.value}
    </button>
  );
}

class Board extends React.Component {
  renderSquare(i) {
    return (
      <Square
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  render() {
    return (
      <div>
        <div className="board-row">
          {this.renderSquare(0)}
          {this.renderSquare(1)}
          {this.renderSquare(2)}
        </div>
        <div className="board-row">
          {this.renderSquare(3)}
          {this.renderSquare(4)}
          {this.renderSquare(5)}
        </div>
        <div className="board-row">
          {this.renderSquare(6)}
          {this.renderSquare(7)}
          {this.renderSquare(8)}
        </div>
      </div>
    );
  }
}

class Game extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      history: [
        {
          squares: Array(9).fill(null),
        },
      ],
      turn: true,
      stepNumber: 0,
      moveHistory: [{ move: [null, null] }],
    };
  }

  handleClick = (i) => {
    const history = this.state.history.slice(0, this.state.stepNumber + 1);
    const current = history[history.length - 1];
    const array = [...current.squares];
    const moveHistory = this.state.moveHistory.slice(
      0,
      this.state.stepNumber + 1
    );
    const currentMove = moveHistory[moveHistory.length - 1];
    let movement = [...currentMove.move];

    let col = "";
    let row = "";
    if (i === 0 || i === 3 || i === 6) {
      col = "1";
    } else if (i === 1 || i === 4 || i === 7) {
      col = "2";
    } else {
      col = "3";
    }
    if (i === 0 || i === 1 || i === 2) {
      row = "1";
    } else if (i === 3 || i === 4 || i === 5) {
      row = "2";
    } else {
      row = "3";
    }

    movement = [row, col];

    if (calculateWinner(array) || array[i]) {
      return;
    }
    array[i] = this.state.turn ? "X" : "O";

    const turn = this.state.turn;
    this.setState({
      history: history.concat([{ squares: array }]),
      turn: !turn,
      stepNumber: history.length,
      moveHistory: moveHistory.concat([{ move: movement }]),
    });
  };

  jumpTo = (step) => {
    this.setState({
      stepNumber: step,
      turn: step % 2 === 0,
    });
  };

  render() {
    const history = this.state.history;
    const current = history[this.state.stepNumber];
    const winner = calculateWinner(current.squares);

    const movesy = this.state.moveHistory;
    const moves = history.map((step, index) => {
      const desc = index
        ? "Go to move #" +
          index +
          " Player clicked column: " +
          movesy[index].move[0] +
          " row: " +
          movesy[index].move[1]
        : "Go to game start";
      return (
        <li key={index}>
          <button onClick={() => this.jumpTo(index)}>{desc}</button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.turn ? "X" : "O");
    }

    return (
      <div className="game">
        <div className="game-board">
          <Board
            squares={current.squares}
            onClick={(i) => this.handleClick(i)}
          />
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
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
  ];
  for (let i = 0; i < lines.length; i++) {
    const [a, b, c] = lines[i];
    if (squares[a] && squares[a] === squares[b] && squares[a] === squares[c]) {
      return squares[a];
    }
  }
  return null;
}

// ========================================

ReactDOM.render(<Game />, document.getElementById("root"));
