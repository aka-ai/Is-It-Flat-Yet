import React, { Component } from 'react'
import { VictoryChart, VictoryArea, VictoryGroup, VictoryAxis } from "victory"
import dayjs from 'dayjs'
const countryProp = 'us-wa'
class Graph extends Component {

  constructor(props) {
    super(props)
    this.state = { singleHistoryData: '', isLoading: true }

    this.getDayOfYear = this.getDayOfYear.bind(this)
  }
  async componentDidMount() {
    const historyData = await this.props.firebase.getHistoryData(countryProp)
    this.setState({ singleHistoryData: historyData, isLoading: false })
  }

  getDayOfYear(date) {
    const currentDate = dayjs(date)['$d']
    const start = new Date(currentDate.getFullYear(), 0, 0);
    const diff = currentDate - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day
  }

  renderData() {
    const data = {}
    const updateDeltaDeathsData = []
    const updateDeltaConfirmedData = []
    const updateConfirmedData = []
    const updateDeathsData = []
    if (this.state.singleHistoryData) {
      this.state.singleHistoryData.deltaDeaths.forEach(d => {
        const dayOfYear = (this.getDayOfYear(Object.keys(d)[0]))
        let value = Object.values(d)[0] || 0
        updateDeltaDeathsData.push({ x: dayOfYear, y: value })
      })
      this.state.singleHistoryData.deltaConfirmed.forEach(d => {
        const dayOfYear = (this.getDayOfYear(Object.keys(d)[0]))
        let value = Object.values(d)[0] || 0
        updateDeltaConfirmedData.push({ x: dayOfYear, y: value })
      })
      this.state.singleHistoryData.confirmed.forEach(d => {
        const dayOfYear = (this.getDayOfYear(Object.keys(d)[0]))
        let value = Object.values(d)[0] || 0
        updateConfirmedData.push({ x: dayOfYear, y: value })
      })
      this.state.singleHistoryData.deaths.forEach(d => {
        const dayOfYear = (this.getDayOfYear(Object.keys(d)[0]))
        let value = Object.values(d)[0] || 0
        updateDeathsData.push({ x: dayOfYear, y: value })
      })
    }
    
    return { deltaDeaths: updateDeltaDeathsData, deltaConfirmed: updateDeltaConfirmedData, confirmed: updateConfirmedData, deaths: updateDeathsData }
  }
  
  
  render() {

    return (
      <div className="graph">
      <VictoryChart scale={{ x: "linear", y: "sqrt" }} >
        
        <VictoryAxis
          style={{
              axisLabel: { fontSize: 23, padding: 30 },
              tickLabels: { fontSize: 15, padding: 5 },
          }}
            label={`${this.state.singleHistoryData.displayName} Accumulative`}
        />
        <VictoryAxis dependentAxis

          style={{
            axisLabel: { fontSize: 23, padding: 30 },
            tickLabels: { fontSize: 15, padding: 5 },
          }}
          
        />
        <VictoryGroup >
          <VictoryArea
            style={{
              data: { fill: "brown", stroke: "brown", strokeWidth: 0, fillOpacity: 0.5 }
            }}
            interpolation={"natural"}
            data={this.renderData().deaths}
          />
          <VictoryArea
            style={{
              data: { fill: "green", stroke: "green", strokeWidth: 0, fillOpacity: 0.5 }
            }}
            interpolation={"natural"}
            data={this.renderData().confirmed}
          />
        </VictoryGroup>
      </VictoryChart  >
        <VictoryChart scale={{ x: "linear", y: "sqrt" }} >

          <VictoryAxis
            label={`${this.state.singleHistoryData.displayName} delta`}
            style={{
              axisLabel: { fontSize: 23, padding: 30 },
              tickLabels: { fontSize: 15, padding: 5 },
            }}
          />
          <VictoryAxis dependentAxis

            style={{
              axisLabel: { fontSize: 23, padding: 30 },
              tickLabels: { fontSize: 15, padding: 5 },
            }}
          />
          <VictoryGroup
          >
            <VictoryArea
              style={{
                data: { fill: "magenta", stroke: "magenta", strokeWidth: 0, fillOpacity: 0.5 }
              }}
              interpolation={"natural"}
              data={this.renderData().deltaConfirmed}
            />
            <VictoryArea
              style={{
                data: { fill: "cyan", stroke: "cyan", strokeWidth: 0, fillOpacity: 0.5 },
              }}
              interpolation={"natural"}
              data={this.renderData().deltaDeaths}
            // domain={{ x: [60, 100], y: [0, 5000] }}
            />
          </VictoryGroup>
        </VictoryChart>
      </div>
    );
  }
}

export default Graph
// SOURCE: https://github.com/negomi/react-burger-menu#styling

const fd =
  [
    { '4/1/20': 17 },
    { '3/31/20': 7 },
    { '3/30/20': 0 },
    { '3/29/20': 7 },
    { '3/28/20': 4 },
    { '3/27/20': 5 },
    { '3/26/20': 6 },
    { '3/25/20': 3 },
    { '3/24/20': 1 },
    { '3/23/20': 3 },
    { '3/22/20': 0 },
    { '3/21/20': 0 },
    { '3/20/20': 2 },
    { '3/19/20': 1 },
    { '3/18/20': 1 },
    { '3/17/20': 1 },
    { '3/16/20': 0 },
    { '3/15/20': 0 },
    { '3/14/20': 0 },
    { '3/13/20': 0 },
    { '3/12/20': 0 },
    { '3/11/20': 0 },
    { '3/10/20': 0 },
    { '3/9/20': 0 },
    { '3/8/20': 0 },
    { '3/7/20': 0 },
    { '3/6/20': 0 },
    { '3/5/20': 0 },
    { '3/4/20': null }
  ]

const a = [
  { '4/1/20': 58 },
  { '3/31/20': 41 },
  { '3/30/20': 34 },
  { '3/29/20': 34 },
  { '3/28/20': 27 },
  { '3/27/20': 23 },
  { '3/26/20': 18 },
  { '3/25/20': 12 },
  { '3/24/20': 9 },
  { '3/23/20': 8 },
  { '3/22/20': 5 },
  { '3/21/20': 5 },
  { '3/20/20': 5 },
  { '3/19/20': 3 },
  { '3/18/20': 2 },
  { '3/17/20': 1 },
  { '3/16/20': null },
  { '3/15/20': null },
  { '3/14/20': null },
  { '3/13/20': null },
  { '3/12/20': null },
  { '3/11/20': null },
  { '3/10/20': null },
  { '3/9/20': null },
  { '3/8/20': null },
  { '3/7/20': null },
  { '3/6/20': null },
  { '3/5/20': null },
  { '3/4/20': null },
]