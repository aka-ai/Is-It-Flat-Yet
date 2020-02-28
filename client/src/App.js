import React, { Component } from 'react';
import './App.css';
import MapContainer from './components/MapContainer'
import Countries from './components/Countries'
import Data from './components/Data'

class App extends Component {
  render() {
    return (
      < div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Coronavirus.show</h1>
        </header>
        <div className="Main-container">
        <Countries />
        <MapContainer />
        <div className="Statistics">
        <Data />
        </div>

        </div>
      </div>
    )
  }
}

export default App;
