import { useRef, useState } from 'react'
import Square, { PLAYER_O, PLAYER_X } from './Square.jsx'

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
  const [status, setStatus] = useState(new Array(9).fill(undefined))
  const [winner, setWinner] = useState()
  const lastPlayer = useRef()

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
    setStatus(new Array(9).fill(undefined))
    setWinner(undefined)
    lastPlayer.current = undefined
  }

  return (
    <div className="board">
      <div className="board-row">
        <Square value={status[0]} onSquareClick={(player) => handleClick(0, player)} />
        <Square value={status[1]} onSquareClick={(player) => handleClick(1, player)} />
        <Square value={status[2]} onSquareClick={(player) => handleClick(2, player)} />
      </div>
      <div className="board-row">
        <Square value={status[3]} onSquareClick={(player) => handleClick(3, player)} />
        <Square value={status[4]} onSquareClick={(player) => handleClick(4, player)} />
        <Square value={status[5]} onSquareClick={(player) => handleClick(5, player)} />
      </div>
      <div className="board-row">
        <Square value={status[6]} onSquareClick={(player) => handleClick(6, player)} />
        <Square value={status[7]} onSquareClick={(player) => handleClick(7, player)} />
        <Square value={status[8]} onSquareClick={(player) => handleClick(8, player)} />
      </div>
      {winner && <div>Game over! {winner} won</div>}
      {winner && <button onClick={handlePlayAgain}>Reset</button>}
    </div>
  )
}

export default Board