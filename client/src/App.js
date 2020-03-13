import React, { Component } from 'react';
import './App.css';
import MapContainer from './components/MapContainer'
import Countries from './components/Countries'
import Data from './components/Data'
import Firebase from './components/Firebase';
const firebase = new Firebase()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clickedIndex: ''
    }

  }
  
  gotDataFromChild = (childData) => {
    this.setState({ clickedIndex: childData })
  }

  render() {
    return (
      < div className="App">
        <header className="App-header">
          <h1 className="App-title">Welcome to Coronavirus.show</h1>
        </header>
        <div className="Main-container">
          <Countries firebase={firebase} />
          <MapContainer sendDataToParent={this.gotDataFromChild}/>
          <Data clickedLocation={this.state.clickedIndex}  />
        </div>
      </div>
    )
  }
}

export default App;
