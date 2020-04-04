import React, { Component } from 'react'
import { VictoryChart, VictoryArea, VictoryGroup, VictoryAxis, VictoryLabel } from "victory"
import { renderHistoricData } from './Map/BaseMapHelper'
class Graph extends Component {

  getLastDataPoint(dataSet) {
    return dataSet[dataSet.length - 1]
  }

  render() {
    let data
    if (this.props.entityData) {
      data = renderHistoricData(this.props.entityData)
    } else {
      data = renderHistoricData(this.props.usCountryData)
    }
    const { name, deltaDeaths, deltaConfirmed, confirmed, deaths } = data
    const axisStyle = {
      axisLabel: { fontSize: 20, padding: 18 },
      tickLabels: { fontSize: 10, padding: 3 },
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
        <h3>Graph</h3>
        {Object.entries(graphData).map((statPair, idx) => {
          return (
            <div className="graph" key={idx} >
              <VictoryChart scale={{ x: "time", y: "sqrt" }} width={400} height={400}  >
                <VictoryLabel text={`${name}`} x={225} y={30} textAnchor="middle" />
                <VictoryLabel text={`(${statPair[0]})`} x={225} y={45} textAnchor="middle" />

                <VictoryAxis
                  style={axisStyle}
                // label="days since 100 confirmed" //TODO
                />
                <VictoryAxis dependentAxis
                  style={axisStyle}
                />
                <VictoryGroup >
                  {Object.entries(statPair[1]).map((dataSetPair, innerIdx) => {
                    return (
                      <VictoryGroup key={innerIdx}>
                        <VictoryArea
                          style={{
                            data: {
                              fill: innerIdx % 2 === 0 ? colors[idx][innerIdx] : colors[idx][innerIdx]
                            }
                          }}
                          interpolation={"natural"}
                          data={dataSetPair[1]}
                        />
                        <VictoryLabel
                          text={dataSetPair[0]}
                          datum={this.getLastDataPoint(dataSetPair[1])} textAnchor="end" 
                          />
                      </VictoryGroup>
                    )
                  })}
                </VictoryGroup>
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