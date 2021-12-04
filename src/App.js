import logo from './logo.svg';
import './App.css';
import { TutorBoard } from './TutorBoard.js'
import PgnParser from 'pgn-parser';
import React from 'react';

class App extends React.Component {
  constructor() {
    super()

    this.state = {
      pgn: null
    }
  }

  updateInputValue(evt) {
    const [pgn] = this.tryParsePgn(evt.target.value)
    if (pgn !== null) {
      this.setState({
        pgn: pgn
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
          <input value={this.state.inputValue} onChange={evt => this.updateInputValue(evt)}/>
          <TutorBoard pgnLine={this.state.pgn}/>
        </header>
      </div>
    );
  }
}

export default App;
