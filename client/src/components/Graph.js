import React, { Component } from 'react'
import { VictoryChart, VictoryTheme, VictoryStack, VictoryArea, VictoryGroup, VictoryAxis } from "victory"
import dayjs from 'dayjs'
class Graph extends Component {

  constructor(props) {
    super(props)
    this.state = { singleHistoryData: ''}
    this.getDayOfYear = this.getDayOfYear.bind(this)
  }
  async componentDidMount() {
    const historyData = await this.props.firebase.getHistoryData('us-tx')
    this.setState({singleHistoryData: historyData})
    
  }

  getDayOfYear(date) {
    const currentDate = dayjs(date)['$d']
    const start = new Date(currentDate.getFullYear(), 0, 0);
    const diff = currentDate - start;
    const oneDay = 1000 * 60 * 60 * 24;
    const day = Math.floor(diff / oneDay);
    return day
  }

  renderData(data) {
    const updatedData = []
    if (this.state.singleHistoryData) {
    data.forEach(d => {
      const dayOfYear = (this.getDayOfYear(Object.keys(d)[0]))
      let value = Object.values(d)[0] || 0
      updatedData.push({x: dayOfYear, y: value})
    })}
    return updatedData
  }


  render() {
    return (
      <VictoryChart >
        <VictoryAxis
          label="Texas US"
          style={{
            axisLabel: { fontSize: 3, padding: 15 },
            tickLabels: { fontSize: 2, padding: 5 },
          }}
          />
        <VictoryAxis dependentAxis

          style={{
            axisLabel: { fontSize: 3, padding: 15 },
            tickLabels: { fontSize: 2, padding: 5 },
          }}
        />
        <VictoryGroup

          style={{
            data: { strokeWidth: 1, fillOpacity: 0.4 },
            tickLabels: { fontSize: 100 }
          }}
         >
          <VictoryArea
          domain={{ x: [60, 100] }}
            style={{
              data: { fill: "cyan", stroke: "cyan", strokeWidth: 0.5, fillOpacity: 0.9 },
            }}
            data={this.renderData(fd)}
          />
          <VictoryArea
            style={{
            data: { fill: "magenta", stroke: "magenta", strokeWidth: 0.5, fillOpacity: 0.4}
            }}
            data={this.renderData(a)}
          />
        </VictoryGroup>
      </VictoryChart>
    );
  }
}

export default Graph
// SOURCE: https://github.com/negomi/react-burger-menu#styling

const fd = 
[
{ '4/1/20':17 },
{ '3/31/20':7 },
{ '3/30/20':0 },
{ '3/29/20':7 },
{ '3/28/20':4 },
{ '3/27/20':5 },
{ '3/26/20':6 },
{ '3/25/20':3 },
{ '3/24/20':1 },
{ '3/23/20':3 },
{ '3/22/20':0 },
{ '3/21/20':0 },
{ '3/20/20':2 },
{ '3/19/20':1 },
{ '3/18/20':1 },
{ '3/17/20':1 },
{ '3/16/20':0 },
{ '3/15/20':0 },
{ '3/14/20':0 },
{ '3/13/20':0 },
{ '3/12/20':0 },
{ '3/11/20':0 },
{ '3/10/20':0 },
{ '3/9/20':0 },
{ '3/8/20':0 },
{ '3/7/20':0 },
{ '3/6/20':0 },
{ '3/5/20':0 },
{'3/4/20':null}
]

const a = [
{ '4/1/20' :58 },
{ '3/31/20' :41 },
{ '3/30/20' :34 },
{ '3/29/20' :34 },
{ '3/28/20' :27 },
{ '3/27/20' :23 },
{ '3/26/20' :18 },
{ '3/25/20' :12 },
{ '3/24/20' :9 },
{ '3/23/20' :8 },
{ '3/22/20' :5 },
{ '3/21/20' :5 },
{ '3/20/20' :5 },
{ '3/19/20' :3 },
{ '3/18/20' :2 },
{ '3/17/20' :1 },
{ '3/16/20' :null },
{ '3/15/20' :null },
{ '3/14/20' :null },
{ '3/13/20' :null },
{ '3/12/20' :null },
{ '3/11/20' :null },
{ '3/10/20' :null },
{ '3/9/20' :null },
{ '3/8/20' :null },
{ '3/7/20' :null },
{ '3/6/20' :null },
{ '3/5/20' :null },
{ '3/4/20' :null },
]