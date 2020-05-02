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
        key={i}
        value={this.props.squares[i]}
        onClick={() => this.props.onClick(i)}
      />
    );
  }

  fillBoard = () => {
    //make an empty array for storing the rows
    let rows = [];
    //a function scoped counter for keeping track of current square
    let counter = 0;
    for (let x = 0; x < 3; x++) {
      //create an array to store each child of board-row (square)
      let rowSquares = [];
      for (let y = 0; y < 3; y++) {
        //fill the second array with the children (squares)
        rowSquares.push(this.renderSquare(counter));
        //increase function scoped variable to track current square
        counter++;
      }
      //push each row object into the first array with the children array included
      rows.push(
        <div className="board-row" key={x}>
          {rowSquares}
        </div>
      );
    }
    //return the rows array
    return rows;
  };

  render() {
    return <div>{this.fillBoard()}</div>;
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
      switch: true,
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
    let moves = history.map((step, index) => {
      const desc = index
        ? "Go to move #" +
          index +
          " Player clicked column: " +
          movesy[index].move[0] +
          " row: " +
          movesy[index].move[1]
        : "Go to game start";

      let isBold = null;
      isBold = index === this.state.stepNumber ? "bolded" : null;

      return (
        <li key={index}>
          <button className={isBold} onClick={() => this.jumpTo(index)}>
            {desc}
          </button>
        </li>
      );
    });

    let status;
    if (winner) {
      status = "Winner: " + winner;
    } else {
      status = "Next player: " + (this.state.turn ? "X" : "O");
    }

    moves = this.state.switch ? moves : moves.reverse();
    const reverse = this.state.switch ? null : "reversed";

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
          <ol reversed={reverse}> {moves}</ol>
        </div>
        <div>
          <button
            onClick={() => {
              this.setState({ switch: !this.state.switch });
            }}
          >
            Something
          </button>
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
