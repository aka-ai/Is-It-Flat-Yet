import React, { Component } from 'react';
import './Index.css';
import Firebase from './components/Firebase';
import Header from './components/header'
import BaseMap from './components/Map/BaseMap'
const firebase = new Firebase()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showingInfoWindow: false,
      selectedPlace: {},
      activeMarker: {},
      data: {}
    }
  }

  async componentDidMount() {
    const data = await firebase.getData()
    this.setState({ data: data })
  }

  render() {
    return (
      <div className="App">
        <Header />
        <BaseMap
          sendDataToParent={this.gotDataFromChild}
          data={this.state.data}
        />
      </div>
    )
  }
}

export default App;
