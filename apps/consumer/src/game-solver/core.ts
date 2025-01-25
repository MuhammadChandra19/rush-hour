import { MovementDirection, Step } from '@rush-hour/types/dist/game';

export default class RushHourSolver {
  private rows: number = 6;
  private cols: number = 6;

  constructor(private board: number[][]) {}

  /**
   * Checks if the red car (1) has reached the exit.
   */
  public isSolved(board: number[][]): boolean {
    for (let j = 0; j < this.cols; j++) {
      if (board[2][j] === 1 && j === this.cols - 1) return true;
    }
    return false;
  }

  /**
   * Generates all valid moves for a given board state.
   */
  private generateMoves(board: number[][]): Step[] {
    const moves: Step[] = [];
    const visited = new Set<string>();

    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        const carId = board[i][j];
        if (carId === 0 || visited.has(carId.toString())) continue;
        visited.add(carId.toString());

        // Check horizontal or vertical alignment
        const isHorizontal = j < this.cols - 1 && board[i][j + 1] === carId;

        // Generate valid moves
        if (isHorizontal) {
          if (j > 0 && board[i][j - 1] === 0) {
            moves.push({ carId, direction: MovementDirection.Left });
          }
          if (j < this.cols - 2 && board[i][j + 2] === 0) {
            moves.push({ carId, direction: MovementDirection.Right });
          }
        } else {
          if (i > 0 && board[i - 1][j] === 0) {
            moves.push({ carId, direction: MovementDirection.Up });
          }
          if (i < this.rows - 2 && board[i + 2][j] === 0) {
            moves.push({ carId, direction: MovementDirection.Down });
          }
        }
      }
    }

    return moves;
  }

  /**
   * Moves a car on the board.
   */
  private moveCar(board: number[][], step: Step): number[][] {
    const newBoard = board.map((row) => [...row]); // Deep copy
    const { carId, direction } = step;
    const positions: [number, number][] = [];

    // Find car positions
    for (let i = 0; i < this.rows; i++) {
      for (let j = 0; j < this.cols; j++) {
        if (newBoard[i][j] === carId) {
          positions.push([i, j]);
        }
      }
    }

    // Clear the current positions
    for (const [i, j] of positions) {
      newBoard[i][j] = 0;
    }

    // Move the car
    const [di, dj] =
      direction === MovementDirection.Up
        ? [-1, 0]
        : direction === MovementDirection.Down
          ? [1, 0]
          : direction === MovementDirection.Left
            ? [0, -1]
            : [0, 1];

    for (const [i, j] of positions) {
      const newI = i + di;
      const newJ = j + dj;
      newBoard[newI][newJ] = carId;
    }

    return newBoard;
  }

  /**
   * Solve the puzzle using BFS.
   */
  public solve(): Step[] {
    const queue: { board: number[][]; steps: Step[] }[] = [
      { board: this.board, steps: [] },
    ];
    const visited = new Set<string>([JSON.stringify(this.board)]);

    while (queue.length > 0) {
      const { board, steps } = queue.shift()!;

      if (this.isSolved(board)) return steps;

      const moves = this.generateMoves(board);
      for (const move of moves) {
        const newBoard = this.moveCar(board, move);
        const serialized = JSON.stringify(newBoard);

        if (!visited.has(serialized)) {
          visited.add(serialized);
          queue.push({ board: newBoard, steps: [...steps, move] });
        }
      }
    }

    return []; // No solution
  }
}

// Example Usage
// const board: number[][] = [
//   [0, 0, 0, 0, 0, 0],
//   [0, 0, 0, 0, 3, 3],
//   [0, 0, 1, 1, 2, 0],
//   [0, 0, 0, 0, 2, 0],
//   [0, 0, 0, 5, 5, 0],
//   [0, 0, 0, 0, 0, 0],
// ];

// const solver = new RushHourSolver(board);
// const solution = solver.solve();
// console.log(solution);
