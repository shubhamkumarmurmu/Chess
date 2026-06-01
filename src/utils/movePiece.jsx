import check from "./check";
import { COLORS } from "./pieces";

const movePiece = (board, from, to) => {
  const piece = board[from.row][from.col];
  const newBoard = board.map((row) => [...row]);

  const currentMove = piece.color;
  if (piece.type === "king" && Math.abs(from.col - to.col) === 2) {
    if (to.col === 6) {
      newBoard[to.row][5] = newBoard[to.row][7];
      newBoard[to.row][7] = null;
    } else if (to.col === 2) {
      newBoard[to.row][3] = newBoard[to.row][0];
      newBoard[to.row][0] = null;
    }
  }

  newBoard[to.row][to.col] = { ...piece, moved: true };
  newBoard[from.row][from.col] = null;
  const selfChecked = check(newBoard, currentMove);
  if (selfChecked) {
    return board;
  } else
    return newBoard;
}
export default movePiece;