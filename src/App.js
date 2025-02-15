import { useState } from 'react';

export default function ScrabbleGame() {
  const [tiles, setTiles] = useState(['A', 'E', 'I', 'O', 'U', 'T', 'N']);
  const [board, setBoard] = useState(Array.from({ length: 15 }, () => Array(15).fill(null)));
  const [selectedTile, setSelectedTile] = useState(null);

  const handleTileSelect = (tile) => {
    setSelectedTile(tile);
  };

  const handleBoardClick = (row, col) => {
    if (selectedTile) {
      setBoard(prevBoard => {
        const newBoard = prevBoard.map(rowArr => [...rowArr]);
        newBoard[row][col] = selectedTile;
        return newBoard;
      });
      setSelectedTile(null);
    }
  };

  return (
    <div style={{ textAlign: 'center', padding: '20px' }}>
      <h1 style={{ fontSize: '24px', fontWeight: 'bold', marginBottom: '10px' }}>Loupdin Scrabble Game</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 40px)', gap: '4px', justifyContent: 'center' }}>
        {board.map((row, rowIndex) => (
          <div key={rowIndex} style={{ display: 'flex' }}>
            {row.map((cell, colIndex) => (
              <div
                key={colIndex}
                style={{
                  width: '40px',
                  height: '40px',
                  border: '1px solid #ccc',
                  display: 'flex',
                  alignItems: 'center',
                  justifyContent: 'center',
                  backgroundColor: cell ? '#ddd' : '#fff',
                  fontSize: '1.2rem',
                  fontWeight: 'bold',
                  cursor: 'pointer'
                }}
                onClick={() => handleBoardClick(rowIndex, colIndex)}
              >
                {cell}
              </div>
            ))}
          </div>
        ))}
      </div>
      <div style={{ marginTop: '10px', display: 'flex', justifyContent: 'center', gap: '10px' }}>
        {tiles.map((tile, index) => (
          <button key={index} onClick={() => handleTileSelect(tile)} style={{
            padding: '10px',
            fontSize: '16px',
            fontWeight: 'bold',
            border: '1px solid #ccc',
            cursor: 'pointer'
          }}>
            {tile}
          </button>
        ))}
      </div>
    </div>
  );
}
