import { useState } from 'react';
import { Card } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { motion } from "framer-motion";

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
    <div className="flex flex-col items-center p-4">
      <h1 className="text-2xl font-bold mb-4">Loupdin Scrabble Game</h1>
      <div className="grid grid-cols-15 gap-1 bg-wood p-2 rounded-lg shadow-lg">
        {board.map((row, rowIndex) => (
          <div key={rowIndex} className="flex">
            {row.map((cell, colIndex) => (
              <Card
                key={colIndex}
                className="w-10 h-10 flex items-center justify-center border border-gray-300"
                onClick={() => handleBoardClick(rowIndex, colIndex)}
              >
                {cell && (
                  <motion.div whileHover={{ scale: 1.1 }}>
                    {cell}
                  </motion.div>
                )}
              </Card>
            ))}
          </div>
        ))}
      </div>
      <div className="mt-4 flex space-x-2">
        {tiles.map((tile, index) => (
          <Button key={index} onClick={() => handleTileSelect(tile)}>
            {tile}
          </Button>
        ))}
      </div>
    </div>
  );
}
