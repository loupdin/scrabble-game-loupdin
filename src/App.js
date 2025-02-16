import { useState } from 'react';

const letterValues = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

const API_KEY = "5e5e356d-0af0-4e01-9d2d-f526be53b058";
const API_URL = "https://www.dictionaryapi.com/api/v3/references/collegiate/json/";

const getRandomLetter = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
};

const generateTiles = (num = 7) => Array.from({ length: num }, () => getRandomLetter());

export default function ScrabbleGame() {
  const [tiles, setTiles] = useState(generateTiles(7));
  const [board, setBoard] = useState(Array.from({ length: 15 }, () => Array(15).fill(null)));
  const [placedTiles, setPlacedTiles] = useState([]);
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const validateWord = async (word) => {
    try {
      const response = await fetch(`${API_URL}${word}?key=${API_KEY}`);
      const data = await response.json();
      return Array.isArray(data) && data.some(entry => entry.meta);
    } catch (error) {
      console.error("Error validating word:", error);
      return false;
    }
  };

  const commitMove = async () => {
    if (placedTiles.length === 0) return;
    
    const formedWord = placedTiles.map(tile => tile.tile).join("");
    const isValid = await validateWord(formedWord);
    if (!isValid) {
      alert(`'${formedWord}' is not a valid word!`);
      return;
    }

    const roundScore = placedTiles.reduce((total, tile) => total + letterValues[tile.tile], 0);
    setPlayerScore(prevScore => prevScore + roundScore);
    setPlacedTiles([]);
    setTiles(generateTiles(7));
  };

  const skipTurn = () => {
    alert("Turn skipped!");
    setTiles(generateTiles(7));
  };

  const handleDragStart = (event, tile, index) => {
    event.dataTransfer.setData("text/plain", JSON.stringify({ tile, index }));
  };

  const handleDrop = (event, row, col) => {
    event.preventDefault();
    const data = JSON.parse(event.dataTransfer.getData("text/plain"));
    
    setBoard(prevBoard => {
      const newBoard = prevBoard.map(rowArr => [...rowArr]);
      newBoard[row][col] = { letter: data.tile, value: letterValues[data.tile] };
      return newBoard;
    });

    setPlacedTiles(prev => [...prev, { row, col, tile: data.tile }]);
    setTiles(prevTiles => prevTiles.filter((_, i) => i !== data.index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '100%', maxWidth: '600px', marginBottom: '20px' }}>
        <h2>Player Score: {playerScore}</h2>
        <h2>Opponent Score: {opponentScore}</h2>
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Loupdin Scrabble Game</h1>
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
                cursor: 'pointer',
                position: 'relative'
              }}
              onDragOver={(event) => event.preventDefault()}
              onDrop={(event) => handleDrop(event, rowIndex, colIndex)}
            >
              {cell && (
                <>
                  {cell.letter}
                  <span style={{ position: 'absolute', top: '2px', right: '4px', fontSize: '12px', color: '#555' }}>
                    {cell.value}
                  </span>
                </>
              )}
            </div>
          ))
        )}
      </div>
      <div style={{ marginTop: '20px', display: 'flex', gap: '10px' }}>
        {tiles.map((tile, index) => (
          <div key={index} draggable onDragStart={(event) => handleDragStart(event, tile, index)} style={{
            padding: '10px',
            fontSize: '18px',
            fontWeight: 'bold',
            border: '2px solid #444',
            borderRadius: '5px',
            cursor: 'grab',
            backgroundColor: '#eee',
            transition: '0.2s ease-in-out',
            position: 'relative'
          }}>
            {tile}
          </div>
        ))}
      </div>
      <button onClick={commitMove} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#4CAF50', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: '0.2s ease-in-out', marginRight: '10px' }}>Commit Move</button>
      <button onClick={skipTurn} style={{ marginTop: '20px', padding: '10px 20px', fontSize: '16px', fontWeight: 'bold', backgroundColor: '#FF5733', color: 'white', border: 'none', borderRadius: '5px', cursor: 'pointer', transition: '0.2s ease-in-out' }}>Skip Turn</button>
    </div>
  );
}
