import React, { Component } from 'react'
import { VictoryChart, VictoryArea, VictoryGroup, VictoryAxis, VictoryLabel, VictoryLegend } from "victory"
import { renderHistoricData } from './Map/BaseMapHelper'
class Graph extends Component {
  getLastDataPoint(dataSet, lastUpdated) {
    let maxY = 0
    for (let set of dataSet) {
      if (set.y > maxY) {
        maxY = set.y
      }
    }
    return { x: new Date(), y: maxY }
  }

  render() {
    if (this.props.isLoading) {
      return <div style={{ height: 304 }}>Loading</div>
    }
    let data
    if (this.props.entityData) {
      data = renderHistoricData(this.props.entityData)
    } else {
      data = renderHistoricData(this.props.usCountryData)
    }
    const { deltaDeaths, deltaConfirmed, confirmed, deaths } = data
    const axisStyle = {
      axisLabel: { fontSize: 12, padding: 12, stroke: "darkslategray", fontWeight: 300 },
      tickLabels: { fontSize: 12, padding: 10, stroke: "darkslategray", fontWeight: 300},
      ticks: {
        stroke: "darkslategray"
      },
      axis: {
        stroke: "darkslategray"
      }

    }

    const graphData = {
      "Cumulative": {
        confirmed: confirmed,
        deaths: deaths
      },
      "Non-Cumulative": {
        confirmed: deltaConfirmed,
        deaths: deltaDeaths
      }
    }

    //list of color names: https://www.w3schools.com/colors/colors_names.asp
    const colors = [['plum', 'darkcyan'], ['orange', 'darkslateblue'], ['cadetblue', 'goldenrod']]
    return (
      <div className="graph-container">
        <div className="graph"  >
          <VictoryChart scale={{ x: "time", y: "sqrt" }} width={400} height={300} >
            <VictoryLabel text={`(${this.props.graphType})`} x={200} y={28} textAnchor="middle" style={{ fill: 'darkslategray', fontSize: 20}} />

            <VictoryAxis
              style={axisStyle}
              fixLabelOverlap={true}
            />
            <VictoryAxis dependentAxis
              style={axisStyle}
              fixLabelOverlap={true}
            />
            <VictoryGroup >
              {Object.entries(graphData[this.props.graphType]).map((dataSetPair, idx) => {
                return (
                  <VictoryArea
                    style={{
                      data: {
                        fill: idx % 2 === 0 ? colors[2][idx] : colors[2][idx],
                      },
                    }}
                    interpolation={"natural"}
                    data={dataSetPair[1]}
                    key={idx}
                  />
                )
              })}
            </VictoryGroup>
            <VictoryLegend
              orientation="vertical"
              x={60}
              y={50}
              style={{ labels: { fill: "darkslategray" }, title: { fill: "darkslategray" } }}
              data={[
                { name: "Confirmed", symbol: { fill: colors[2][0] } },
                { name: "Deaths", symbol: { fill: colors[2][1] } }
              ]}
            />
          </VictoryChart  >
        </div>
      </div>
    )
  }
}

export default Graph
// SOURCE: https://github.com/negomi/react-burger-menu#styling

//   < VictoryLabel
// text = { dataSetPair[0]}
// datum = { this.getLastDataPoint(dataSetPair[1], lastUpdated) }
// textAnchor = "start"
// style = {{ fill: "grey", fontSize: 17 }}
// />