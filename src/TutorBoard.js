import React from "react"
import { Chessboard } from 'react-chessboard'
import Chess from 'chess.js'

class TutorBoard extends React.Component {
  constructor(props) {
    super(props)

    this.state = {
      game: new Chess(),
      pgnLine: props.pgnLine,
      moveNum: 0
    }
  }

  onDrop(sourceSquare, targetSquare) {
    this.setState(curState => {
      let updatedGame = new Chess()
      updatedGame.load_pgn(curState.game.pgn())

      const move = updatedGame.move({ from: sourceSquare, to: targetSquare, promotion: 'q' })
      if (move === null) {
        // move will be null if the move was illegal
        return curState
      }

      if (!(curState.moveNum in curState.pgnLine.moves)) {
        // TODO: Emit notification for success
        return curState
      }

      const correctMoveSan = curState.pgnLine.moves[curState.moveNum].move
      if (move.san !== correctMoveSan) {
        // TODO: Emit notification for mistake
        updatedGame.undo()

        const correctMove = updatedGame.move(correctMoveSan)
        if (correctMove === null) {
          throw `PGN contains illegal move! (${correctMoveSan})`
        }
      }

      if (curState.moveNum + 1 in curState.pgnLine.moves) {
        const opponentMoveSan = curState.pgnLine.moves[curState.moveNum + 1].move
        const opponentMove = updatedGame.move(opponentMoveSan)
        if (opponentMove === null) {
          throw `PGN contains illegal move! (${opponentMoveSan})`
        }
      }

      return {
        game: updatedGame,
        moveNum: curState.moveNum + 2
      }
    })
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