import { useState, useEffect } from "react";
import { PIECE_TYPES, COLORS } from './utils/pieces';
import moveOptions from './utils/moveOptions';
import check from "./utils/check"
import movePiece from "./utils/movePiece"
import checkmate from "./utils/checkmate"
import stalemate from "./utils/stalemate";

const App = () => {
  const [currentMove, setCurrentMove] = useState(COLORS.WHITE);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [board, setBoard] = useState([]);
  const [moveOptionsList, setMoveOptionsList] = useState([]);
  const [checked, setChecked] = useState(false);
  const [checkmated, setCheckmated] = useState(false);
  const [invalidMove, setInvalidMove] = useState(false);
  const [stalemated, setStalemated] = useState(false);
  useEffect(() => {
    const initialBoard = [
      [{ type: PIECE_TYPES.ROOK, color: COLORS.BLACK, moved: false },
      { type: PIECE_TYPES.KNIGHT, color: COLORS.BLACK, moved: false },
      { type: PIECE_TYPES.BISHOP, color: COLORS.BLACK, moved: false },
      { type: PIECE_TYPES.QUEEN, color: COLORS.BLACK, moved: false },
      { type: PIECE_TYPES.KING, color: COLORS.BLACK, moved: false },
      { type: PIECE_TYPES.BISHOP, color: COLORS.BLACK, moved: false },
      { type: PIECE_TYPES.KNIGHT, color: COLORS.BLACK, moved: false },
      { type: PIECE_TYPES.ROOK, color: COLORS.BLACK, moved: false }],
      Array.from({ length: 8 }, () => ({
        type: PIECE_TYPES.PAWN,
        color: COLORS.BLACK,
        moved: false,
      })),
      Array.from({ length: 8 }, () => null),
      Array.from({ length: 8 }, () => null),
      Array.from({ length: 8 }, () => null),
      Array.from({ length: 8 }, () => null),
      Array.from({ length: 8 }, () => ({
        type: PIECE_TYPES.PAWN,
        color: COLORS.WHITE,
        moved: false,
      })),
      [{ type: PIECE_TYPES.ROOK, color: COLORS.WHITE, moved: false },
      { type: PIECE_TYPES.KNIGHT, color: COLORS.WHITE, moved: false },
      { type: PIECE_TYPES.BISHOP, color: COLORS.WHITE, moved: false },
      { type: PIECE_TYPES.QUEEN, color: COLORS.WHITE, moved: false },
      { type: PIECE_TYPES.KING, color: COLORS.WHITE, moved: false },
      { type: PIECE_TYPES.BISHOP, color: COLORS.WHITE, moved: false },
      { type: PIECE_TYPES.KNIGHT, color: COLORS.WHITE, moved: false },
      { type: PIECE_TYPES.ROOK, color: COLORS.WHITE, moved: false }],
    ];
    setBoard(initialBoard);
  }, []);

  const handleSquareClick = (row, col) => {
    const clicked = { row, col };
    if (moveOptionsList.some(
      move => move.row === row && move.col === col
    )) {
      const newBoard = movePiece(board, selectedSquare, clicked);
      setMoveOptionsList([]);
      setSelectedSquare(null);
      if (newBoard !== board) {
        setBoard(newBoard);
        const nextPlayer =
          currentMove === COLORS.BLACK
            ? COLORS.WHITE
            : COLORS.BLACK;
        setInvalidMove(false);
        const isChecked = check(newBoard, nextPlayer);
        if (isChecked) {
          const isCheckmate = checkmate(newBoard, nextPlayer);
          setCheckmated(isCheckmate);
        } else {
          const isStalemate = stalemate(newBoard, nextPlayer);
          setStalemated(isStalemate);
        }
        setChecked(isChecked);
        setCurrentMove(nextPlayer);
      } else {
        setInvalidMove(true);
      }
      return;
    };
    const piece = board[row][col];
    if (piece && piece.color === currentMove) {
      setSelectedSquare(clicked);
      const options = moveOptions(board, clicked);
      setMoveOptionsList(options);
    }
  };

  return (
    <div className="flex flex-col items-center p-4 border border-gray-400">
      <h1 className="text-3xl font-bold mb-4">Chess Game</h1>
      {checkmated && (
        <div className="bg-gray-700 font-bold">
          <h1>CheckMate</h1>
        </div>
      )}

      {stalemated && (
        <div className="bg-red-600 font-bold">
          <h1> Stalemate</h1>
        </div>
      )}

      {(!checkmated && !stalemated) && (
        <div className="flex flex-col items-center">
          <div className="grid grid-cols-8 border border-black cursor-pointer">
            {board.map((row, rowIndex) =>
              row.map((square, colIndex) => {
                const isDark = (rowIndex + colIndex) % 2 === 1;

                return (
                  <div
                    key={`${rowIndex}-${colIndex}`}
                    className={`w-16 h-16 border border-gray-400 flex items-center justify-center ${isDark ? "bg-gray-300" : "bg-white"}`}
                    onClick={() => handleSquareClick(rowIndex, colIndex)}
                  >
                    {moveOptionsList.some(option => option.row === rowIndex && option.col === colIndex) && (
                      <div className="absolute w-4 h-4 bg-green-500 rounded-full"></div>
                    )}
                    {square && (
                      <span className="text-4xl font-bold">
                        {square.color === COLORS.WHITE
                          ? {
                            [PIECE_TYPES.PAWN]: "♙",
                            [PIECE_TYPES.ROOK]: "♖",
                            [PIECE_TYPES.KNIGHT]: "♘",
                            [PIECE_TYPES.BISHOP]: "♗",
                            [PIECE_TYPES.QUEEN]: "♕",
                            [PIECE_TYPES.KING]: "♔",
                          }[square.type]
                          : {
                            [PIECE_TYPES.PAWN]: "♟",
                            [PIECE_TYPES.ROOK]: "♜",
                            [PIECE_TYPES.KNIGHT]: "♞",
                            [PIECE_TYPES.BISHOP]: "♝",
                            [PIECE_TYPES.QUEEN]: "♛",
                            [PIECE_TYPES.KING]: "♚",
                          }[square.type]}
                      </span>
                    )}
                  </div>
                );
              })
            )}
          </div>
          <div className="font-extrabold text-4xl">Move : {currentMove}</div>
        </div>
      )}
      {(checked && !checkmated) && (
        <div className="bg-amber-200 px-4 py-2 mt-2 rounded">
          Check!
        </div>
      )}
      {invalidMove && (
        <div className="bg-amber-200 px-4 py-2 mt-2 rounded">
          Invalid Move
        </div>
      )}
    </div>
  );
};

export default App;