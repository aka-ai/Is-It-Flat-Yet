import React, { Component } from 'react';
import './App.css';
import MapContainer from './components/MapContainer'
// import Countries from './components/Countries'
// import Data from './components/Data'
import Firebase from './components/Firebase';
import redPin from './mapIcons/red.png'
import orangePin from './mapIcons/orange.png'
import yellowPin from './mapIcons/yellow.png'

const firebase = new Firebase()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      clickedIndex: '',
      data: {}
    }

  }

  gotDataFromChild = (childData) => {
    this.setState({ clickedIndex: childData })
  }

  async componentDidMount() {
    const data = await firebase.getData()
    this.setState({ data: data })
  }

  render() {
    return (
      < div className="App">
        <header className="header">
          <h1>Welcome to Coronavirus.show</h1>
          <h3>Coronavirus current cases (confirmed - deaths - recovered)</h3>
          <p>source: <a href="https://github.com/CSSEGISandData/COVID-19/">Johns Hopkins</a></p>
          <div style={{ display: "flex", justifyContent: "space-between" }}>
            <img alt="redPin" src={redPin} />
            <p>more than 10,000 cases</p>
            <img alt="orangePin" src={orangePin} />
            <p>between 100 - 9,999 cases</p>
            <img alt="yellowPin" src={yellowPin} />
            <p>less than 100 cases</p>
          </div>
        </header>
        <MapContainer
          className="Map-container"
          sendDataToParent={this.gotDataFromChild}
          data={this.state.data}
        />
        {/* <div className="footer"> }
          <Countries data={this.state.data} />
          <Data clickedLocation={this.state.clickedIndex} data={this.state.data} />
        </div> */}
      </div>
    )
  }
}

export default App;
