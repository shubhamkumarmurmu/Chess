import moveOptions from "./moveOptions";

const check = (board, currentMove) => {
    let king = {};
    const moves = [];
    const n = board.length;
    if (n !== 0) {
        for (let i = 0; i < n; i++) {
            for (let j = 0; j < n; j++) {
                const piece = board[i][j];
                const selectSquare = { row: i, col: j };
                if (piece && piece.color !== currentMove) {
                    const options = moveOptions(board, selectSquare);
                    for(let k=0;k<options.length;k++){
                        moves.push(options[k]);
                    }
                }
                if (piece && piece.type === "king" && piece.color === currentMove) {
                    king = selectSquare;
                }
            }
        }
    } 
    for(let i=0;i<moves.length;i++){
        const row=moves[i].row;
        const col=moves[i].col;
        if(king.row===row && king.col===col){
            return king; 
        }
    }
    return null;
}

export default check;