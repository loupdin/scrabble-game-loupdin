import { useState, useEffect } from 'react';

export default function ScrabbleGame() {
  const getRandomLetter = () => {
    const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
    return letters[Math.floor(Math.random() * letters.length)];
  };

  const generateTiles = (num = 7) => Array.from({ length: num }, () => getRandomLetter());

  const [tiles, setTiles] = useState(generateTiles(7));
  const [board, setBoard] = useState(Array.from({ length: 15 }, () => Array(15).fill(null)));
  const [selectedTile, setSelectedTile] = useState(null);
  const [placedTiles, setPlacedTiles] = useState([]);

  const handleTileSelect = (tile, index) => {
    setSelectedTile({ tile, index });
  };

  const handleBoardClick = (row, col) => {
    if (selectedTile) {
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(rowArr => [...rowArr]);
        newBoard[row][col] = selectedTile.tile;
        return newBoard;
      });

      setPlacedTiles(prev => [...prev, { row, col, tile: selectedTile.tile }]);

      setTiles(prevTiles => prevTiles.filter((_, i) => i !== selectedTile.index));
      setSelectedTile(null);
    }
  };

  const commitMove = () => {
    if (placedTiles.length === 0) return;

    setPlacedTiles([]);
    setTiles(prevTiles => [...prevTiles, ...generateTiles(placedTiles.length)]);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Loupdin Scrabble Game</h1>

      {/* Game Board */}
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 40px)', gap: '2px', backgroundColor: '#c2a87e', padding: '10px', borderRadius: '8px', boxShadow: '0 4px 8px rgba(0,0,0,0.2)' }}>
        {board.map((row, rowIndex) =>
          row.map((cell, colIndex) => (
            <div
              key={`${rowIndex}-${colIndex}`}
              style={{
                width: '40px',
                height: '40px',
                border: '1px solid #333',
                backgroundColor: cell ? '#ddd' : '#fff',
                display: 'flex',
                alignItems: 'center',
                justifyContent: 'center',
                fontSize: '1.2rem',
                fontWeight: 'bold',
                cursor: 'pointer'
              }}
              onClick={() => handleBoardClick(rowIndex, colIndex)}
            >
              {cell}
            </div>
          ))
        )}
      </div>

      {/* Letter Tiles */}
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        {tiles.map((tile, index) => (
          <button key={index} onClick={() => handleTileSelect(tile, index)} style={{
            padding: '10px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '2px solid #444',
            borderRadius: '5px',
            cursor: 'pointer',
            backgroundColor: selectedTile?.index === index ? '#f5c518' : '#eee',
            transition: '0.2s ease-in-out'
          }}>
            {tile}
          </button>
        ))}
      </div>

      {/* Commit Move Button */}
      <button onClick={commitMove} style={{
        marginTop: '20px',
        padding: '10px 20px',
        fontSize: '16px',
        fontWeight: 'bold',
        backgroundColor: '#4CAF50',
        color: 'white',
        border: 'none',
        borderRadius: '5px',
        cursor: 'pointer',
        transition: '0.2s ease-in-out'
      }}>
        Commit Move
      </button>
    </div>
  );
}
