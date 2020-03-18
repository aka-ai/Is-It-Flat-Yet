import React, { Component } from 'react';
import './App.css';
import MapContainer from './components/MapContainer'
import Countries from './components/Countries'
import Data from './components/Data'
import Firebase from './components/Firebase';
import Header from './components/header'

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
        <Header />
        <MapContainer
          sendDataToParent={this.gotDataFromChild}
          data={this.state.data}
        />
        <div className="footer">
          <Countries data={this.state.data} />
          <Data clickedLocation={this.state.clickedIndex} data={this.state.data} />
        </div>
      </div>
    )
  }
}

export default App;
