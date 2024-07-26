import React, { useState } from 'react';
import './App.css';

function App() {
  const [grid, setGrid] = useState(Array(9).fill().map(() => Array(9).fill('')));
  const [error, setError] = useState('');
  const [isValidState, setIsValidState] = useState(true);

  const handleChange = (e, row, col) => {
    const value = e.target.value;
    if (value === '' || (/^[1-9]$/.test(value))) {
      const newGrid = grid.map(r => [...r]);
      newGrid[row][col] = value;
      setGrid(newGrid);
      setIsValidState(isValid(newGrid));
    }
  };

  const isValid = (grid) => {
    // Check rows
    for (let row = 0; row < 9; row++) {
      const seen = new Set();
      for (let col = 0; col < 9; col++) {
        const value = grid[row][col];
        if (value !== '' && seen.has(value)) return false;
        seen.add(value);
      }
    }

    // Check columns
    for (let col = 0; col < 9; col++) {
      const seen = new Set();
      for (let row = 0; row < 9; row++) {
        const value = grid[row][col];
        if (value !== '' && seen.has(value)) return false;
        seen.add(value);
      }
    }

    // Check 3x3 grids
    for (let boxRow = 0; boxRow < 3; boxRow++) {
      for (let boxCol = 0; boxCol < 3; boxCol++) {
        const seen = new Set();
        for (let row = 0; row < 3; row++) {
          for (let col = 0; col < 3; col++) {
            const value = grid[3 * boxRow + row][3 * boxCol + col];
            if (value !== '' && seen.has(value)) return false;
            seen.add(value);
          }
        }
      }
    }

    return true;
  };

  const solveSudoku = (grid) => {
    const findEmpty = (grid) => {
      for (let row = 0; row < 9; row++) {
        for (let col = 0; col < 9; col++) {
          if (grid[row][col] === '') return [row, col];
        }
      }
      return null;
    };

    const isValidPlacement = (grid, row, col, num) => {
      for (let i = 0; i < 9; i++) {
        if (grid[row][i] == num || grid[i][col] == num) return false;
        const boxRow = 3 * Math.floor(row / 3) + Math.floor(i / 3);
        const boxCol = 3 * Math.floor(col / 3) + i % 3;
        if (grid[boxRow][boxCol] == num) return false;
      }
      return true;
    };

    const solve = (grid) => {
      const empty = findEmpty(grid);
      if (!empty) return true;

      const [row, col] = empty;
      for (let num = 1; num <= 9; num++) {
        if (isValidPlacement(grid, row, col, num)) {
          grid[row][col] = num.toString();
          if (solve(grid)) return true;
          grid[row][col] = '';
        }
      }
      return false;
    };

    const newGrid = grid.map(r => [...r]);
    solve(newGrid);
    return newGrid;
  };

  const handleValidate = () => {
    if (isValid(grid)) {
      setError('');
      setIsValidState(true);
    } else {
      setError('Invalid Sudoku entries.');
      setIsValidState(false);
    }
  };

  const handleSolve = () => {
    if (isValid(grid)) {
      setError('');
      const solvedGrid = solveSudoku(grid);
      setGrid(solvedGrid);
    } else {
      setError('Cannot solve invalid Sudoku.');
    }
  };

  return (
    <div className="App">
      <h1>Sudoku Solver</h1>
      <div className="sudoku-grid">
        {grid.map((row, rowIndex) => (
          <div key={rowIndex} className="sudoku-row">
            {row.map((cell, colIndex) => (
              <input
                key={colIndex}
                type="text"
                maxLength="1"
                value={cell}
                onChange={(e) => handleChange(e, rowIndex, colIndex)}
                className="sudoku-cell"
              />
            ))}
          </div>
        ))}
      </div>
      <button onClick={handleValidate}>Validate</button>
      <button onClick={handleSolve} disabled={!isValidState}>Solve</button>
      {error && <p className="error">{error}</p>}
    </div>
  );
}

export default App;
