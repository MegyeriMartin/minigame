import { useRef, useState } from 'react'
import Square, { PLAYER_O, PLAYER_X } from './Square.jsx'

const BOARD_SIDES = 3
const BOARD_INDICES = [...Array(BOARD_SIDES).keys()]
const CELL_COUNT = BOARD_SIDES * BOARD_SIDES

const WIN_POSITIONS = [
  [0, 1, 2],
  [3, 4, 5],
  [6, 7, 8],
  [0, 3, 6],
  [1, 4, 7],
  [2, 5, 8],
  [0, 4, 8],
  [2, 4, 6],
]

function Board() {
  const [status, setStatus] = useState(new Array(CELL_COUNT).fill(undefined))
  const [winner, setWinner] = useState()
  const [lastCell, setLastCell] = useState()
  const lastPlayer = useRef()

  // Update the game status, ignore the click when it is not allowed
  //  - idx: index of the square
  //  - player: the player making the move (X or O)
  function handleClick(idx, player) {
    if (player !== PLAYER_O && player !== PLAYER_X) return
    if (lastPlayer.current === player) return
    if (status[idx]) return
    if (winner) return

    lastPlayer.current = player
    const newStatus = status.map((value, index) =>
      index === idx ? player : value,
    )
    win_check(newStatus, player)
    setStatus(newStatus)
    setLastCell(idx)
  }

  function win_check(newStatus, player) {
    const win_array = WIN_POSITIONS.map((pos) => {
      const c1 = newStatus[pos[0]]
      const c2 = newStatus[pos[1]]
      const c3 = newStatus[pos[2]]
      return c1 && c1 === c2 && c1 === c3 ? true : false
    })
    if (win_array.some((value) => value)) setWinner(player)
  }

  function handlePlayAgain() {
    setStatus(new Array(CELL_COUNT).fill(undefined))
    setWinner(undefined)
    setLastCell(undefined)
    lastPlayer.current = undefined
  }

  return (
    <div className="board">
      {BOARD_INDICES.map((rowIndex) => (
        <div className="board-row" key={rowIndex}>
          {BOARD_INDICES.map((columnIndex) => {
            const index = rowIndex * BOARD_SIDES + columnIndex
            return (
              <Square
                key={index}
                value={status[index]}
                highlight={index === lastCell}
                onSquareClick={(player) => handleClick(index, player)}
              />
            )
          })}
        </div>
      ))}
      {winner && <div>Game over! {winner} won</div>}
      {winner && <button onClick={handlePlayAgain}>Reset</button>}
    </div>
  )
}

export default Board