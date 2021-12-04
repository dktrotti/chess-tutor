import React from "react"
import { Chessboard } from 'react-chessboard'
import Chess from 'chess.js'

class TutorBoard extends React.Component {
  constructor(props) {
    super(props)

    this.state = { game: new Chess() }
  }

  updateGameState(updateFunc) {
    this.setState(prev => {
      updateFunc(prev.game)
      return prev
    })
  }

  onDrop(sourceSquare, targetSquare) {
    let move = null
    this.updateGameState(game => {
      move = game.move({ from: sourceSquare, to:targetSquare, promotion: 'q' })
    })
    // move will be null if the move was illegal
    return move !== null
  }

  render() {
    return (
      <div>
        <Chessboard position={this.state.game.fen()} onPieceDrop={(s, t)=>this.onDrop(s, t)}/>
      </div>
    )
  }
}

export { TutorBoard }