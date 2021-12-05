import React from "react"
import { Chessboard } from 'react-chessboard'
import Chess from 'chess.js'

class TutorBoard extends React.Component {
  constructor(props) {
    super(props)

    let game = new Chess()
    let moveNum = 0
    if (!props.isWhite) {
      const moveSan = props.pgnLine.moves[0].move
      const move = game.move(moveSan)
      if (move === null) {
        throw `PGN contains illegal move! (${moveSan})`
      }

      moveNum++
    }

    // Holds timeouts to ensure that they get cleared on unmount
    // While this array is wasteful, it's limited to the length of the PGN, so there shouldn't be problems
    this.timeouts = []
    this.state = {
      game,
      moveNum,
      autoMoveCount: 0
    }
  }

  componentWillUnmount() {
    for (const timeout of this.timeouts) {
      clearTimeout(timeout)
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

      if (!(curState.moveNum in this.props.pgnLine.moves)) {
        // TODO: Emit notification for success
        return curState
      }

      const correctMoveSan = this.props.pgnLine.moves[curState.moveNum].move
      if (move.san === correctMoveSan) {
        return {
          game: updatedGame,
          moveNum: curState.moveNum + 1,
          // Automatically play opponent's move
          autoMoveCount: 1
        }
      } else {
        // TODO: Emit notification for mistake
        updatedGame.undo()

        // TODO: The correct move is not animated, possibly because onDrop is not providing a return value
        return {
          // Automatically play the correct move, then the opponent's move
          autoMoveCount: 2
        }
      }
    },
    () => this.enqueueAutoMove())
  }

  enqueueAutoMove() {
    if (this.state.autoMoveCount > 0) {
      const timeout = setTimeout(() => this.playNextAutoMove(), this.props.animationTimeMs)
      this.timeouts.push(timeout)
    }
  }

  playNextAutoMove() {
    this.setState(curState => {
      if (curState.autoMoveCount === 0) {
        return curState
      }

      let updatedGame = new Chess()
      updatedGame.load_pgn(curState.game.pgn())

      if (!(curState.moveNum in this.props.pgnLine.moves)) {
        // No more moves left
        return {
          autoMoveCount: 0
        }
      }

      const nextMoveSan = this.props.pgnLine.moves[curState.moveNum].move
      const nextMove = updatedGame.move(nextMoveSan)
      if (nextMove === null) {
        throw `PGN contains illegal move! (${nextMoveSan})`
      }

      return {
        game: updatedGame,
        moveNum: curState.moveNum + 1,
        autoMoveCount: curState.autoMoveCount - 1
      }
    },
    () => this.enqueueAutoMove())
  }

  render() {
    return (
      <div>
        <Chessboard
          position={this.state.game.fen()}
          onPieceDrop={(s, t)=>this.onDrop(s, t)}
          boardOrientation={this.props.isWhite ? 'white' : 'black'}
          animationDuration={this.props.animationTimeMs}/>
      </div>
    )
  }
}

TutorBoard.defaultProps = {
  animationTimeMs: 200
}

export { TutorBoard }