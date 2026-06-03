import moveOptions from "./moveOptions";
import movePiece from "./movePiece";

const stalemate=(board,currentMove)=>{
    for(let i=0;i<8;i++){
        for(let j=0;j<8;j++){
            const piece=board[i][j];
            const from={row:i,col:j};
            if(piece && piece.color===currentMove){
                const moves=moveOptions(board,from);
                for(let k=0;k<moves.length;k++){
                    const to=moves[k];
                    const newBoard=movePiece(board,from,to);
                    if(newBoard!==null){
                        return false;
                    }
                }
            }
        }
    }
    return true;
}

export default stalemate;