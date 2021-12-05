import logo from './logo.svg';
import './App.css';
import { TutorBoard } from './TutorBoard.js'
import PgnParser from 'pgn-parser';
import React from 'react';

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      pgn: null,
      pgnStr: ''
    }
  }

  updateInputValue(evt) {
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

  render() {
    return (
      <div className="App">
        <header className="App-header">
          <p>1. e4 e5 2. Nf3 Nc6 3. Bc4 *</p>
          <input onChange={evt => this.updateInputValue(evt)}/>
          <TutorBoard pgnLine={this.state.pgn} key={this.state.pgnStr}/>
        </header>
      </div>
    );
  }
}

export default App;
