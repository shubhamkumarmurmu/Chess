import { useState } from "react";
import { PIECE_TYPES, COLORS } from './utils/pieces';
import moveOptions from './utils/moveOptions';
import check from "./utils/check"
import movePiece from "./utils/movePiece"
import checkmate from "./utils/checkmate"
import stalemate from "./utils/stalemate";

const App = () => {
  const initialBoard = () => [
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
      enPassant: false,
    })),
    Array.from({ length: 8 }, () => null),
    Array.from({ length: 8 }, () => null),
    Array.from({ length: 8 }, () => null),
    Array.from({ length: 8 }, () => null),
    Array.from({ length: 8 }, () => ({
      type: PIECE_TYPES.PAWN,
      color: COLORS.WHITE,
      moved: false,
      enPassant: false,
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

  const [currentMove, setCurrentMove] = useState(COLORS.WHITE);
  const [selectedSquare, setSelectedSquare] = useState(null);
  const [board, setBoard] = useState(initialBoard);
  const [moveOptionsList, setMoveOptionsList] = useState([]);
  const [checked, setChecked] = useState(null);
  const [checkmated, setCheckmated] = useState(false);
  const [invalidMove, setInvalidMove] = useState(false);
  const [stalemated, setStalemated] = useState(false);
  const [promotingPawn, setPromotingPawn] = useState(false);
  const [enPassantPawn, setEnPassantPawn] = useState(null);

  const handleSquareClick = (row, col) => {
    if (promotingPawn || checkmated || stalemated) {
      return;
    }
    const clicked = { row, col };
    if (moveOptionsList.some(
      move => move.row === row && move.col === col
    )) {
      const newBoard = movePiece(board, selectedSquare, clicked);
      if(newBoard === null) {
        setInvalidMove(true);
        return;
      }
      if (board[selectedSquare.row][selectedSquare.col].type === PIECE_TYPES.PAWN && (clicked.row === 0 || clicked.row === 7)) {
        setPromotingPawn(true);
        setSelectedSquare(clicked);
        setMoveOptionsList([]);
        setBoard(newBoard);
        return;
      }
      if (enPassantPawn !== null) {
        if (newBoard[enPassantPawn.row][enPassantPawn.col] && newBoard[enPassantPawn.row][enPassantPawn.col].type === PIECE_TYPES.PAWN && newBoard[enPassantPawn.row][enPassantPawn.col].enPassant === true) {
          newBoard[enPassantPawn.row][enPassantPawn.col].enPassant = false;
        }
        if (enPassantPawn.row === selectedSquare.row && enPassantPawn.col === selectedSquare.col) {
          newBoard[clicked.row][clicked.col].enPassant = false;
        }
        setEnPassantPawn(null);
      }
      if (newBoard[clicked.row][clicked.col].enPassant === true) {
        setEnPassantPawn(clicked);
      }
      setSelectedSquare(null);
      setMoveOptionsList([]);
      setBoard(newBoard);
      const nextPlayer =
        currentMove === COLORS.BLACK
          ? COLORS.WHITE
          : COLORS.BLACK;
      setInvalidMove(false);
      const isChecked = check(newBoard, nextPlayer);
      if (isChecked !== null) {
        const isCheckmate = checkmate(newBoard, nextPlayer);
        setCheckmated(isCheckmate);
      } else {
        const isStalemate = stalemate(newBoard, nextPlayer);
        setStalemated(isStalemate);
      }
      setChecked(isChecked);
      setCurrentMove(nextPlayer);
      return;
    };
    const piece = board[row][col];
    if (piece && piece.color === currentMove) {
      setInvalidMove(false);
      setSelectedSquare(clicked);
      const options = moveOptions(board, clicked);
      setMoveOptionsList(options);
    }
  };

  const promotePawn = (newType) => {
    const newBoard = board.map(row => [...row]);
    const { row, col } = selectedSquare;
    newBoard[row][col] = {
      type: newType,
      color: currentMove,
      moved: true,
      promoted: true,
    };
    const nextPlayer = currentMove === COLORS.BLACK ? COLORS.WHITE : COLORS.BLACK;
    setCurrentMove(nextPlayer);
    const isChecked = check(newBoard, nextPlayer);
    if (isChecked !== null) {
      const isCheckmate = checkmate(newBoard, nextPlayer);
      setCheckmated(isCheckmate);
    } else {
      const isStalemate = stalemate(newBoard, nextPlayer);
      setStalemated(isStalemate);
    }
    setChecked(isChecked);
    setBoard(newBoard);
    setPromotingPawn(false);
    setSelectedSquare(null);
  };

  const resetGame = () => {
    setBoard(initialBoard());
    setCurrentMove(COLORS.WHITE);
    setCheckmated(false);
    setStalemated(false);
    setChecked(null);
    setInvalidMove(false);
    setPromotingPawn(false);
    setSelectedSquare(null);
    setMoveOptionsList([]);
    setEnPassantPawn(null);
  };

  return (
    <div className="flex flex-col items-center p-4">
      <h1 className="text-3xl font-bold mb-4">Chess Game</h1>
      <div className="relative flex flex-col items-center justify-center">
        <div className="grid grid-cols-8 border border-black cursor-pointer">
          {board.map((row, rowIndex) =>
            row.map((square, colIndex) => {
              const isDark = (rowIndex + colIndex) % 2 === 1;

              return (
                <div
                  key={`${rowIndex}-${colIndex}`}
                  className={`relative aspect-square border border-gray-400 flex items-center justify-center ${checked !== null && checked.row === rowIndex && checked.col === colIndex
                    ? "bg-red-500"
                    : selectedSquare && selectedSquare.row === rowIndex && selectedSquare.col === colIndex
                      ? "bg-yellow-300"
                      : isDark
                        ? "bg-gray-300"
                        : "bg-white"
                    }`}
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
        {checkmated && (
          <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 flex flex-col items-center justify-center">
            <div className="bg-gray-200 border border-gray-400 p-4 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">Checkmate!</h2>
              <p className="mb-2">Winner: {currentMove === COLORS.WHITE ? "Black" : "White"}</p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-1.5" onClick={() => {
              resetGame();
            }}>
              Play Again
            </button>
          </div>
        )}
        {stalemated && (
          <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-200 border border-gray-400 p-4 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">Stalemate!</h2>
              <p className="mb-2">The game is a draw.</p>
            </div>
            <button className="bg-blue-500 text-white px-4 py-2 rounded mt-1.5" onClick={() => {
              resetGame();
            }}>
              Play Again
            </button>
          </div>
        )}
        {promotingPawn && (
          <div className="absolute top-0 left-0 w-full h-full bg-opacity-50 flex items-center justify-center">
            <div className="bg-gray-200 border border-gray-400 p-4 rounded-2xl">
              <h2 className="text-xl font-bold mb-2">Pawn Promotion</h2>
              <p className="mb-2">Choose a piece to promote to:</p>
              <div className="grid grid-cols-2 gap-2 ">
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => promotePawn(PIECE_TYPES.QUEEN)}>
                  ♕ : Queen
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => promotePawn(PIECE_TYPES.ROOK)}>
                  ♖ : Rook
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => promotePawn(PIECE_TYPES.BISHOP)}>
                  ♗ : Bishop
                </button>
                <button className="bg-blue-500 text-white px-4 py-2 rounded" onClick={() => promotePawn(PIECE_TYPES.KNIGHT)}>
                  ♘ : Knight
                </button>
              </div>
            </div>
          </div>
        )}
        <div className=" font-extrabold text-4xl">Move : {currentMove}</div>
      </div>
      {invalidMove && (
        <div className="bg-amber-200 px-4 py-2 mt-2 rounded">
          Invalid Move
        </div>
      )}
    </div>
  );
};

export default App;