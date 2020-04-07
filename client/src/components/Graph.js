import React, { Component } from 'react'
import { VictoryChart, VictoryArea, VictoryGroup, VictoryAxis, VictoryLabel, VictoryLegend } from "victory"
import { renderHistoricData } from './Map/BaseMapHelper'
class Graph extends Component {

  getLastDataPoint(dataSet, lastUpdated) {
    console.log(this.props.usCountryData.lastUpdated)

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
      return <div style={{ height: 304}}>Loading</div>
    }
    let data
    if (this.props.entityData) {
      data = renderHistoricData(this.props.entityData)
    } else {
      data = renderHistoricData(this.props.usCountryData)
    }
    const { name, deltaDeaths, deltaConfirmed, confirmed, deaths} = data
    const axisStyle = {
      axisLabel: { fontSize: 12, padding: 12 },
      tickLabels: { fontSize: 12, padding: 10 },

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
    const colors = [['plum', 'darkcyan'], ['orange', 'darkslateblue']]

    return (

      <div className="graph-container">
        {Object.entries(graphData).map((statPair, idx) => {
          return (
            <div className="graph" key={idx} >
              <VictoryChart scale={{ x: "time", y: "sqrt" }} width={400} height={300}  >
                <VictoryLabel text={`${name}`} x={200} y={20} textAnchor="middle" />
                <VictoryLabel text={`(${statPair[0]})`} x={200} y={35} textAnchor="middle" />

                <VictoryAxis
                  style={axisStyle}
                  fixLabelOverlap={true}
                // label="days since 100 confirmed" //TODO
                />
                <VictoryAxis dependentAxis
                  style={axisStyle}
                  fixLabelOverlap={true}
                />
                <VictoryGroup >
                  {Object.entries(statPair[1]).map((dataSetPair, innerIdx) => {
                    return (
                        <VictoryArea
                          style={{
                            data: {
                              fill: innerIdx % 2 === 0 ? colors[idx][innerIdx] : colors[idx][innerIdx],
                            },
                          }}
                          interpolation={"natural"}
                          data={dataSetPair[1]}
                          key={innerIdx}
                        />
                    )
                  })}
                  
                </VictoryGroup>
                <VictoryLegend 
                  orientation="vertical"
                  x={60}
                  y={50}
                  style={{ title: { fontSize: 3 }}}
                  data={[
                    { name: "Confirmed", symbol: { fill: colors[idx][0] } },
                    { name: "Deaths", symbol: { fill: colors[idx][1] } }
                  ]}
                />
              </VictoryChart  >
            </div>
          )
        })}
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