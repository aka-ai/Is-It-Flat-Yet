import React, { Component } from 'react';
import './index.css';
import Firebase from './components/Firebase';
import Header from './components/header'
import BaseMap from './components/Map/BaseMap'
import Footer from './components/Footer'

const firebase = new Firebase()

class App extends Component {
  constructor(props) {
    super(props)
    this.state = {
      showingInfoWindow: false,
      selectedPlace: {},
      activeMarker: {},
      data: {},
      usCountryData: {},
      historicData: {},
      usHistoricData: {},
      isLoading: true
    }
  }

  async componentDidMount() {
    const data = await firebase.getData()
    const usCountryData = await firebase.getHistoryData("us")
    const usHistoricData = await firebase.getHistoryData('us')
  
    this.setState({ data: data, usCountryData, usHistoricData, isLoading: false })
  }

  render() {

    let lastUpdated
    if (this.state.data.globalData) lastUpdated = this.state.data.globalData.countries[0]["lastUpdated"]
    return (
      <div className="App">
        <Header lastUpdated={lastUpdated} />
          <div className="cushion"></div>
        <BaseMap
          data={this.state.data}
          firebase={firebase}
          usCountryData={this.state.usCountryData}
          isLoading={this.state.isLoading}
        />
        <Footer className="footer" />
      </div>
    )
  }
}

export default App;
