import React, { Component } from 'react';
import './index.css';
import Firebase from './components/Firebase';
import Header from './components/header'
import BaseMap from './components/Map/BaseMap'
import Footer from './components/Footer'
import SidePanel from './components/SidePanel'
import Graph from './components/Graph'

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
    let lastUpdated
    if (this.state.data.globalData) lastUpdated = this.state.data.globalData.countries[0]["lastUpdated"]
    return (
      <div className="App">
        <Graph firebase={firebase}/>
        <Header lastUpdated={lastUpdated} />
        <BaseMap
          data={this.state.data}
          firebase={firebase}
        />
        <Footer className="footer" />
      </div>
    )
  }
}

export default App;
