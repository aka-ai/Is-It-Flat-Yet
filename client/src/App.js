import React, { Component } from 'react';
import './index.css';
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
    let lastUpdated
    if (this.state.data.globalData) lastUpdated = this.state.data.globalData[Object.keys(this.state.data.globalData)[0]]["lastUpdated"]
    return (
      <div className="App">
        <Header lastUpdated={lastUpdated} />
        <BaseMap
          data={this.state.data}
        />
        <div className="footer">
            <p>Last Updated: {lastUpdated}</p>
            <p>Sources: <a rel="noopener noreferrer" href="https://github.com/CSSEGISandData/COVID-19/" target="_blank">Johns Hopkins</a>, <a rel="noopener noreferrer" href="https://covidtracking.com/" target="_blank">The COVID Tracking Project</a></p>
            <p>Made By <a target="_blank" href="https://twitter.com/aicooks">@aicooks</a> and <a target="_blank" href="https://twitter.com/kahdojay">@kahdojay</a></p>
        </div>
      </div>
    )
  }
}

export default App;
