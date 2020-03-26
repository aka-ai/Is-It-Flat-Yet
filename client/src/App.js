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
          data={this.state.data}
        />
        <div className="footer">
          <div>
            <p>
              Confirmed Active = Confirmed - Deaths
            </p>
            <p>source: <a rel="noopener noreferrer" href="https://github.com/CSSEGISandData/COVID-19/" target="_blank">Johns Hopkins</a></p>
            <p>made by <a target="_blank" href="https://twitter.com/aicooks">@aicooks</a> and <a target="_blank" href="https://twitter.com/kahdojay">@kahdojay</a></p>
          </div>
        </div>
      </div>
    )
  }
}

export default App;
