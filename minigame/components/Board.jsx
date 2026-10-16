import { useState } from 'react'
import Square from './Square.jsx'

function Board() {
  const [status] = useState([1, 2, 3])

  return (
    <div className="board">
      <div className="board-row">
        <Square value={status[0]} />
        <Square value={status[1]} />
        <Square value={status[2]} />
      </div>
    </div>
  )
}

export default Board