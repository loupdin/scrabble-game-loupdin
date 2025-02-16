import React, { useState } from "react";
import "./App.css";

const letterPoints = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1,
  J: 8, K: 5, L: 1, M: 3, N: 1, O: 1, P: 3, Q: 10, R: 1,
  S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10,
};

const getRandomLetters = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return Array.from({ length: 7 }, () => letters[Math.floor(Math.random() * letters.length)]);
};

const App = () => {
  const [playerTiles, setPlayerTiles] = useState(getRandomLetters());
  const [board, setBoard] = useState(Array(15).fill().map(() => Array(15).fill(null)));
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);
  const [draggedTile, setDraggedTile] = useState(null);

  const handleDragStart = (e, tile, index) => {
    setDraggedTile({ tile, fromRack: true, index });
  };

  const handleDragOver = (e) => {
    e.preventDefault();
  };

  const handleDrop = (e, row, col) => {
    if (!draggedTile) return;
    
    const newBoard = [...board.map(row => [...row])];
    if (newBoard[row][col] === null) {
      newBoard[row][col] = draggedTile.tile;
      setBoard(newBoard);
      
      if (draggedTile.fromRack) {
        const newPlayerTiles = [...playerTiles];
        newPlayerTiles.splice(draggedTile.index, 1);
        setPlayerTiles(newPlayerTiles);
      }
    }
    setDraggedTile(null);
  };

  const handleTileRackDrop = (e) => {
    if (!draggedTile || draggedTile.fromRack) return;
    
    setPlayerTiles([...playerTiles, draggedTile.tile]);
    const newBoard = [...board.map(row => [...row])];
    newBoard.forEach((r, rowIndex) => {
      r.forEach((cell, colIndex) => {
        if (cell === draggedTile.tile) {
          newBoard[rowIndex][colIndex] = null;
        }
      });
    });
    setBoard(newBoard);
    setDraggedTile(null);
  };

  const commitMove = () => {
    let newScore = 0;
    board.forEach(row => {
      row.forEach(cell => {
        if (cell) newScore += letterPoints[cell] || 0;
      });
    });
    setPlayerScore(playerScore + newScore);
    setPlayerTiles(getRandomLetters());
  };

  return (
    <div className="game-container">
      <div className="score-container">
        <span>Player Score: {playerScore}</span>
        <span>Opponent Score: {opponentScore}</span>
      </div>
      <h1>Loupdin Scrabble Game</h1>
      <div className="board">
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              className="board-cell"
              onDragOver={handleDragOver}
              onDrop={(e) => handleDrop(e, rowIndex, colIndex)}
            >
              {cell && (
                <div className="tile" draggable onDragStart={(e) => handleDragStart(e, cell)}>
                  {cell} <span className="tile-value">{letterPoints[cell]}</span>
                </div>
              )}
            </div>
          ))
        )}
      </div>
      <div className="tile-container" onDragOver={handleDragOver} onDrop={handleTileRackDrop}>
        {playerTiles.map((tile, index) => (
          <div
            key={index}
            className="tile"
            draggable
            onDragStart={(e) => handleDragStart(e, tile, index)}
          >
            {tile} <span className="tile-value">{letterPoints[tile]}</span>
          </div>
        ))}
      </div>
      <div className="buttons">
        <button className="commit-btn" onClick={commitMove}>Commit Move</button>
        <button className="skip-btn" onClick={() => setPlayerTiles(getRandomLetters())}>Skip Turn</button>
      </div>
    </div>
  );
};

export default App;
