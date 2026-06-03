import check from "./check";
import { COLORS, PIECE_TYPES } from "./pieces";

const movePiece = (board, from, to) => {
  const piece = board[from.row][from.col];
  const newBoard = board.map((row) => [...row]);
  let updatedPiece = { ...piece, moved: true };

  const currentMove = piece.color;
  if (piece.type === PIECE_TYPES.KING && Math.abs(from.col - to.col) === 2) {
    if (to.col === 6) {
      newBoard[to.row][5] = { ...newBoard[to.row][7], moved: true };
      newBoard[to.row][7] = null;
    } else if (to.col === 2) {
      newBoard[to.row][3] = { ...newBoard[to.row][0], moved: true };
      newBoard[to.row][0] = null;
    }
  }
  if(piece.type === PIECE_TYPES.PAWN && to.col !== from.col && !board[to.row][to.col]) {
    newBoard[from.row][to.col] = null;
  }
  if(piece.type === PIECE_TYPES.PAWN && Math.abs(from.row - to.row) === 2) {
    updatedPiece.enPassant = true;
  }
  newBoard[to.row][to.col] = { ...updatedPiece };
  newBoard[from.row][from.col] = null;
  const selfChecked = check(newBoard, currentMove);
  return selfChecked!==null ? null : newBoard;
}
export default movePiece;