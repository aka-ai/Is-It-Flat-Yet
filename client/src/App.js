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
        <header className="header">
          <h1>Welcome to Coronavirus.show</h1>
        </header>
          <MapContainer sendDataToParent={this.gotDataFromChild}/>
        <div className="footer">
          <Countries firebase={firebase} />
          <Data clickedLocation={this.state.clickedIndex}  />
        </div>
      </div>
    )
  }
}

export default App;
