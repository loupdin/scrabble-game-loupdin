import { useState, useEffect } from 'react';

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
  const apiKey = "5e5e356d-0af0-4e01-9d2d-f526be53b058";
  try {
    const response = await fetch(`https://www.dictionaryapi.com/api/v3/references/collegiate/json/${word}?key=${apiKey}`);
    if (!response.ok) {
      console.error("Error: Invalid API response");
      return false;
    }
    
    const data = await response.json();
    if (!Array.isArray(data) || data.length === 0 || typeof data[0] !== 'object' || !data[0].meta) {
      console.warn("Invalid word or unexpected API response:", data);
      return false;
    }
    
    return true;
  } catch (error) {
    console.error("Dictionary API error:", error);
    return false;
  }
};

export default function ScrabbleGame() {
  const [tiles, setTiles] = useState([]);
  const [board, setBoard] = useState(Array.from({ length: 15 }, () => Array(15).fill(null)));
  const [playerScore, setPlayerScore] = useState(0);
  const [opponentScore, setOpponentScore] = useState(0);

  useEffect(() => {
    setTiles(generateTiles(7));
  }, []);

  const commitMove = async () => {
    const placedLetters = [];
    board.forEach(row => row.forEach(cell => { if (cell) placedLetters.push(cell.letter); }));
    const word = placedLetters.join("");
    
    if (!word) {
      alert("No letters placed on the board!");
      return;
    }
    
    const isValid = await checkWordValidity(word);
    if (isValid) {
      setPlayerScore(playerScore + word.split('').reduce((acc, letter) => acc + letterValues[letter], 0));
      alert("Move committed!");
      setTiles(generateTiles(7));
    } else {
      alert(`'${word}' is not a valid word!`);
    }
  };

  const skipTurn = () => {
    setTiles(generateTiles(7));
    alert("Turn skipped!");
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', alignItems: 'center', padding: '20px', backgroundColor: '#f8f8f8', minHeight: '100vh' }}>
      <div style={{ display: 'flex', justifyContent: 'space-between', width: '600px', marginBottom: '20px' }}>
        <h2>Player Score: {playerScore}</h2>
        <h2>Opponent Score: {opponentScore}</h2>
      </div>
      <h1 style={{ fontSize: '28px', fontWeight: 'bold', marginBottom: '20px' }}>Loupdin Scrabble Game</h1>
      <div style={{ display: 'grid', gridTemplateColumns: 'repeat(15, 40px)', gap: '2px', backgroundColor: '#c2a87e', padding: '10px', borderRadius: '8px', marginBottom: '20px' }}>
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
            >
              {cell && cell.letter}
            </div>
          ))
        )}
      </div>
      <button onClick={commitMove} style={{ padding: '10px 20px', marginTop: '20px', backgroundColor: '#4CAF50', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Commit Move</button>
      <button onClick={skipTurn} style={{ padding: '10px 20px', marginTop: '10px', backgroundColor: '#FF5733', color: 'white', borderRadius: '5px', border: 'none', cursor: 'pointer' }}>Skip Turn</button>
    </div>
  );
}
