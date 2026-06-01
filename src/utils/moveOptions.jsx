import { COLORS } from "./pieces";

const moveOptions = (board, selectedSquare) => {
    if (!selectedSquare) return [];
    const { row, col } = selectedSquare;
    const piece = board[row][col];
    if (!piece) return [];
    const moves = [];

    const getRookMoves = () => {
        for (let i = row + 1; i < 8; i++) {
            if (board[i][col]) {
                if (board[i][col].color !== piece.color)
                    moves.push({ row: i, col });
                break;
            }
            moves.push({ row: i, col });
        }
        for (let i = row - 1; i >= 0; i--) {
            if (board[i][col]) {
                if (board[i][col].color !== piece.color)
                    moves.push({ row: i, col });
                break;
            }
            moves.push({ row: i, col });
        }
        for (let j = col + 1; j < 8; j++) {
            if (board[row][j]) {
                if (board[row][j].color !== piece.color) {
                    moves.push({ row, col: j });
                }
                break;
            }
            moves.push({ row, col: j });
        }
        for (let j = col - 1; j >= 0; j--) {
            if (board[row][j]) {
                if (board[row][j].color !== piece.color)
                    moves.push({ row, col: j });
                break;
            }
            moves.push({ row, col: j });
        }
    }

    const getBishopMoves = () => {
        for (let i = 1; row + i < 8 && col + i < 8; i++) {
            if (board[row + i][col + i]) {
                if (board[row + i][col + i].color !== piece.color)
                    moves.push({ row: row + i, col: col + i });
                break;
            }
            moves.push({ row: row + i, col: col + i });
        }
        for (let i = 1; row - i >= 0 && col - i >= 0; i++) {
            if (board[row - i][col - i]) {
                if (board[row - i][col - i].color !== piece.color)
                    moves.push({ row: row - i, col: col - i });
                break;
            }
            moves.push({ row: row - i, col: col - i });
        }
        for (let i = 1; row + i < 8 && col - i >= 0; i++) {
            if (board[row + i][col - i]) {
                if (board[row + i][col - i].color !== piece.color)
                    moves.push({ row: row + i, col: col - i });
                break;
            }
            moves.push({ row: row + i, col: col - i });
        }
        for (let i = 1; row - i >= 0 && col + i < 8; i++) {
            if (board[row - i][col + i]) {
                if (board[row - i][col + i].color !== piece.color)
                    moves.push({ row: row - i, col: col + i });
                break;
            }
            moves.push({ row: row - i, col: col + i });
        }
    }

    switch (piece.type) {
        case 'pawn':
            const direction = piece.color === 'white' ? -1 : 1;
            if (!piece.moved && board[row + direction][col] === null) {
                const nextRow = row + 2 * direction;
                moves.push({ row: nextRow, col });
            }
            const nextRow = row + direction;
            if (board[nextRow]) {
                if (!board[nextRow][col]) {
                    moves.push({ row: nextRow, col });
                }
                if (board[nextRow][col + 1] && board[nextRow][col + 1].color !== piece.color) {
                    moves.push({ row: nextRow, col: col + 1 });
                }
                if (board[nextRow][col - 1] && board[nextRow][col - 1].color !== piece.color) {
                    moves.push({ row: nextRow, col: col - 1 });
                }
            }
            break;
        case 'rook':
            getRookMoves();
            break;
        case 'knight':
            const knightMoves = [
                { dr: -2, dc: -1 }, { dr: -2, dc: 1 },
                { dr: -1, dc: -2 }, { dr: -1, dc: 2 },
                { dr: 1, dc: -2 }, { dr: 1, dc: 2 },
                { dr: 2, dc: -1 }, { dr: 2, dc: 1 },
            ];
            knightMoves.forEach(({ dr, dc }) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    if (
                        !board[newRow][newCol] ||
                        board[newRow][newCol].color !== piece.color
                    ) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            });
            break;
        case 'bishop':
            getBishopMoves();
            break;
        case 'queen':
            getRookMoves();
            getBishopMoves();
            break;
        case 'king':
            const kingMoves = [
                { dr: -1, dc: -1 }, { dr: -1, dc: 0 }, { dr: -1, dc: 1 },
                { dr: 0, dc: -1 }, { dr: 0, dc: 1 },
                { dr: 1, dc: -1 }, { dr: 1, dc: 0 }, { dr: 1, dc: 1 },
            ];
            kingMoves.forEach(({ dr, dc }) => {
                const newRow = row + dr;
                const newCol = col + dc;
                if (newRow >= 0 && newRow < 8 && newCol >= 0 && newCol < 8) {
                    if (
                        !board[newRow][newCol] ||
                        board[newRow][newCol].color !== piece.color
                    ) {
                        moves.push({ row: newRow, col: newCol });
                    }
                }
            });
            if (!piece.moved) {
                if (board[row][7] && !board[row][7].moved) {
                    if (!board[row][5] && !board[row][6]) {
                        moves.push({ row, col: 6 });
                    }
                }
                if (board[row][0] && !board[row][0].moved) {
                    if (!board[row][1] && !board[row][2] && !board[row][3]) {
                        moves.push({ row, col: 2 });
                    }
                }
            }
            break;
        default:
            break;
    }
    return moves;
}

export default moveOptions;