export const PLAYER_X = "X";
export const PLAYER_O = "O";

function Square({ value, onSquareClick }) {
    function handleContextMenu(event) {
        event.preventDefault();
        onSquareClick(PLAYER_O);
    }

    return (
        <button className="square" type="button" onClick={() => onSquareClick(PLAYER_X)} onContextMenu={handleContextMenu}>
            {value}
        </button>
    );
}

export default Square;
