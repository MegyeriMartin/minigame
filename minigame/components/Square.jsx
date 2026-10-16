function Square({ value, onSquareClick }) {
  return (
    <button className="square" type="button" onClick={onSquareClick}>
      {value}
    </button>
  )
}

export default Square