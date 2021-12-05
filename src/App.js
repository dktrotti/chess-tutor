import logo from './logo.svg';
import './App.css';
import { TutorBoard } from './TutorBoard.js'
import PgnParser from 'pgn-parser';
import React from 'react';

class App extends React.Component {
  constructor() {
    super()

    const pgnStr = '1. e4 e5 2. Nf3 Nc6 3. Bc4 *'
    const [pgn] = this.tryParsePgn(pgnStr)
    if (pgn === null) {
      throw 'Failed to parse initial PGN'
    }

    this.state = {
      pgn,
      pgnStr,
      isWhite: false
    }
  }

  updatePgnString(evt) {
    const pgnStr = evt.target.value
    const [pgn] = this.tryParsePgn(pgnStr)
    if (pgn !== null) {
      this.setState({
        pgn: pgn,
        pgnStr: pgnStr
      })
    }
  }

  tryParsePgn(pgnStr) {
    try {
      return PgnParser.parse(pgnStr)
    } catch(err) {
      return null
    }
  }

  updatePlayer(evt) {
    this.setState({
      isWhite: evt.target.checked
    })
  }

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <h3>Chess Tutor</h3>
        </header>
        <div className="App-body">
          <p>1. e4 e5 2. Nf3 Nc6 3. Bc4 *</p>
          <input onChange={evt => this.updatePgnString(evt)}/>
          <input type="checkbox" id="isWhite" name="isWhite" onChange={evt => this.updatePlayer(evt)}/>
          <label for="isWhite">Play as white</label>
          <TutorBoard pgnLine={this.state.pgn} isWhite={this.state.isWhite} key={this.state.isWhite + this.state.pgnStr}/>
        </div>
      </div>
    );
  }
}

export default App;
