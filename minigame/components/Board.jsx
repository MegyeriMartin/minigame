import { useRef, useState } from "react";
import Square, { PLAYER_O, PLAYER_X } from "./Square.jsx";

const BOARD_SIDES = 3;
const BOARD_INDICES = [...Array(BOARD_SIDES).keys()];
const CELL_COUNT = BOARD_SIDES * BOARD_SIDES;

const WIN_POSITIONS = [
    [0, 1, 2],
    [3, 4, 5],
    [6, 7, 8],
    [0, 3, 6],
    [1, 4, 7],
    [2, 5, 8],
    [0, 4, 8],
    [2, 4, 6],
];

function Board() {
    const [status, setStatus] = useState(new Array(CELL_COUNT).fill(undefined));
    const [winner, setWinner] = useState();
    const [lastCell, setLastCell] = useState();
    const lastPlayer = useRef();
    const [gameOver, setGameOver] = useState(false);
    const [wins, setWins] = useState({ [PLAYER_X]: 0, [PLAYER_O]: 0 });
    const [draws, setDraws] = useState(0);
    const [history, setHistory] = useState([]);

    function handleClick(idx, player) {
        if (player !== PLAYER_O && player !== PLAYER_X) return;
        if (lastPlayer.current === player) return;
        if (status[idx]) return;
        if (gameOver) return;

        setHistory((previousHistory) => [
            ...previousHistory,
            { status, lastCell, lastPlayer: lastPlayer.current },
        ]);
        lastPlayer.current = player;
        const newStatus = status.map((value, index) => (index === idx ? player : value));
        const hasWinner = win_check(newStatus);
        setStatus(newStatus);
        setLastCell(idx);

        if (hasWinner) {
            setWinner(player);
            setWins((currentWins) => ({
                ...currentWins,
                [player]: currentWins[player] + 1,
            }));
            setGameOver(true);
        } else if (newStatus.every(Boolean)) {
            setDraws((currentDraws) => currentDraws + 1);
            setGameOver(true);
        }
    }

    function win_check(newStatus) {
        return WIN_POSITIONS.some(([first, second, third]) => (
            newStatus[first] &&
            newStatus[first] === newStatus[second] &&
            newStatus[first] === newStatus[third]
        ));
    }

    function handlePlayAgain() {
        setStatus(new Array(CELL_COUNT).fill(undefined));
        setWinner(undefined);
        setLastCell(undefined);
        setGameOver(false);
        setHistory([]);
        lastPlayer.current = undefined;
    }

    function handleUndo() {
        if (history.length === 0) return;

        const previousState = history[history.length - 1];
        setHistory((currentHistory) => currentHistory.slice(0, -1));
        setStatus(previousState.status);
        setLastCell(previousState.lastCell);
        setWinner(undefined);
        setGameOver(false);
        lastPlayer.current = previousState.lastPlayer;

        if (winner) {
            setWins((currentWins) => ({
                ...currentWins,
                [winner]: currentWins[winner] - 1,
            }));
        } else if (gameOver) {
            setDraws((currentDraws) => currentDraws - 1);
        }
    }

    return (
        <div className="board">
            <div className="scoreboard" aria-label="Győzelmek és döntetlenek">
                <div className="score">
                    <span className="score-label"><span className="player-mark player-x">X</span> Győzelem</span>
                    <strong>{wins[PLAYER_X]}</strong>
                </div>
                <div className="score">
                    <span className="score-label"><span className="player-mark player-o">O</span> Győzelem</span>
                    <strong>{wins[PLAYER_O]}</strong>
                </div>
                <div className="score">
                    <span className="score-label">Döntetlen</span>
                    <strong>{draws}</strong>
                </div>
            </div>
            {BOARD_INDICES.map((rowIndex) => (
                <div className="board-row" key={rowIndex}>
                    {BOARD_INDICES.map((columnIndex) => {
                        const index = rowIndex * BOARD_SIDES + columnIndex;
                        return (
                            <Square
                                key={index}
                                value={status[index]}
                                highlight={index === lastCell}
                                onSquareClick={(player) => handleClick(index, player)}
                            />
                        );
                    })}
                </div>
            ))}
            {gameOver && (
                <div className="game-result" aria-live="polite">
                    {winner ? `A nyertes: ${winner}!` : "Döntetlen!"}
                </div>
            )}
            <div className="board-actions">
                <button
                    className="undo-button"
                    type="button"
                    onClick={handleUndo}
                    disabled={history.length === 0}
                >
                    Vissza
                </button>
                {gameOver && (
                    <button type="button" onClick={handlePlayAgain}>Új játék</button>
                )}
            </div>
        </div>
    );
}

export default Board;
