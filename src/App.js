import { useState } from 'react';

const letterValues = {
  A: 1, B: 3, C: 3, D: 2, E: 1, F: 4, G: 2, H: 4, I: 1, J: 8, K: 5, L: 1, M: 3,
  N: 1, O: 1, P: 3, Q: 10, R: 1, S: 1, T: 1, U: 1, V: 4, W: 4, X: 8, Y: 4, Z: 10
};

const getRandomLetter = () => {
  const letters = "ABCDEFGHIJKLMNOPQRSTUVWXYZ";
  return letters[Math.floor(Math.random() * letters.length)];
};

const generateTiles = (num = 7) => Array.from({ length: num }, () => getRandomLetter());

const checkWordValidity = async (word) => {
  const apiKey = "your-api-key";
  const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
  const data = await response.json();
  return Array.isArray(data) && data.length > 0 && typeof data[0] === 'object' && data[0].meta;
};

export default function ScrabbleGame() {
  const [tiles, setTiles] = useState(generateTiles(7));
  const [board, setBoard] = useState(Array.from({ length: 15 }, () => Array(15).fill(null)));
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  const commitMove = async () => {
    const placedLetters = [];
    board.forEach(row => row.forEach(cell => { if (cell) placedLetters.push(cell.letter); }));
    const word = placedLetters.join("");
    const isValid = await checkWordValidity(word);
    if (isValid) {
      alert("Move committed!");
    } else {
      alert(`'${word}' is not a valid word!`);
    }
  };

  const skipTurn = () => {
    alert("Turn skipped!");
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

    setTiles(prevTiles => prevTiles.filter((_, i) => i !== data.index));
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '600px', marginBottom: '20px' }}>
        <h2>Player Score: {playerScore}</h2>
        <h2>Opponent Score: {opponentScore}</h2>
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Loupdin Scrabble Game</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 40px)', gap: '2px', backgroundColor: '#c2a87e', padding: '10px', borderRadius: '8px' }}>
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
            backgroundColor: '#eee'
          }}>
            {tile} <span style={{ fontSize: '12px', color: '#555' }}>{letterValues[tile]}</span>
          </div>
        ))}
      </div>
      <button onClick={commitMove} style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Commit Move</button>
      <button onClick={skipTurn} style={{ padding: '10px 20px', marginTop: '10px', backgroundColor: '#FF5733', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Skip Turn</button>
    </div>
  );
}
