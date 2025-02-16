import React, { useState } from "react";
import "./App.css";

const letterValues = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

const generateRandomTiles = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length: 7 }, () => {
    const letter = letters[Math.floor(Math.random() * letters.length)];
    return { letter, value: letterValues[letter] };
  });
};

const App = () => {
  const [board, setBoard] = useState(Array(15).fill(null).map(() => Array(15).fill(null)));
  const [tiles, setTiles] = useState(generateRandomTiles());
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const handleDragStart = (e, tile, row = null, col = null) => {
    e.dataTransfer.setData("tile", JSON.stringify({ tile, row, col }));
  };

  const handleDrop = (e, row, col) => {
    e.preventDefault();
    const { tile, prevRow, prevCol } = JSON.parse(e.dataTransfer.getData("tile"));

    // If dragging from the board, clear previous position
    if (prevRow !== null && prevCol !== null) {
      const newBoard = board.map((r, rowIndex) =>
        r.map((c, colIndex) => (rowIndex === prevRow && colIndex === prevCol ? null : c))
      );
      setBoard(newBoard);
    }

    // If dropping onto an empty board space
    if (board[row][col] === null) {
      const newBoard = board.map((r, rowIndex) =>
        r.map((c, colIndex) => (rowIndex === row && colIndex === col ? tile : c))
      );
      setBoard(newBoard);

      // Remove tile from hand if it was originally there
      setTiles((prevTiles) => prevTiles.filter((t) => t.letter !== tile.letter));
    }
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleTileReturn = (e) => {
    e.preventDefault();
    const { tile, row, col } = JSON.parse(e.dataTransfer.getData("tile"));

    if (row !== null && col !== null) {
      setTiles((prevTiles) => [...prevTiles, tile]);

      const newBoard = board.map((r, rowIndex) =>
        r.map((c, colIndex) => (rowIndex === row && colIndex === col ? null : c))
      );
      setBoard(newBoard);
    }
  };

  const commitMove = async () => {
    const words = extractWords(board);
    let totalScore = 0;

    for (const word of words) {
      const isValid = await isValidWord(word);
      if (isValid) {
        totalScore += calculateWordScore(word);
      }
    }

    setPlayerScore((prevScore) => prevScore + totalScore);
    setTiles(generateRandomTiles());
  };

  const skipTurn = () => {
    setTiles(generateRandomTiles());
  };

  const extractWords = (board) => {
    let words = [];

    for (let row = 0; row < 15; row++) {
      let word = "";
      for (let col = 0; col < 15; col++) {
        if (board[row][col]) {
          word += board[row][col].letter;
        } else if (word.length > 1) {
          words.push(word);
          word = "";
        } else {
          word = "";
        }
      }
      if (word.length > 1) words.push(word);
    }

    for (let col = 0; col < 15; col++) {
      let word = "";
      for (let row = 0; row < 15; row++) {
        if (board[row][col]) {
          word += board[row][col].letter;
        } else if (word.length > 1) {
          words.push(word);
          word = "";
        } else {
          word = "";
        }
      }
      if (word.length > 1) words.push(word);
    }

    return words;
  };

  const isValidWord = async (word) => {
    const response = await fetch(
      `https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=YOUR_API_KEY`
    );
    const data = await response.json();
    return Array.isArray(data) && typeof data[0] === "string" ? false : true;
  };

  const calculateWordScore = (word) => {
    return word.split("").reduce((acc, letter) => acc + letterValues[letter], 0);
  };

  return (
    <div className="game-container">
      <h1>Loupdin Scrabble Game</h1>
      <div className="score-container">
        <div>Player Score: {playerScore}</div>
        <div>Opponent Score: {opponentScore}</div>
      </div>
      <div className="board">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="board-row">
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                className="board-cell"
                onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
                onDragOver={handleDragOver}
              >
                {cell ? (
                  <div
                    className="tile"
                    draggable
                    onDragStart={(e) => handleDragStart(e, cell, rowIndex, colIndex)}
                  >
                    {cell.letter}
                    <span className="tile-value">{cell.value}</span>
                  </div>
                ) : null}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div
        className="tile-container"
        onDrop={handleTileReturn}
        onDragOver={handleDragOver}
      >
        {tiles.map((tile, index) => (
          <div
            key={index}
            className="tile"
            draggable
            onDragStart={(e) => handleDragStart(e, tile)}
          >
            {tile.letter}
            <span className="tile-value">{tile.value}</span>
          </div>
        ))}
      </div>
      <div className="buttons">
        <button className="commit-btn" onClick={commitMove}>
          Commit Move
        </button>
        <button className="skip-btn" onClick={skipTurn}>
          Skip Turn
        </button>
      </div>
    </div>
  );
};

export default App;
