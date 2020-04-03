import React, { Component } from 'react'
import { VictoryChart, VictoryArea, VictoryGroup, VictoryAxis } from "victory"
import dayjs from 'dayjs'
// const countryProp = 'us-wa'
class Graph extends Component {
  constructor(props) {
    super(props)
    this.state = { historyData: '', isLoading: true }
  }

  renderData() {
    let name
    if (this.props.entityData) name = this.props.entityData.displayName
    const mapKeys = { deltaDeaths: [], deltaConfirmed: [], confirmed: [], deaths: [] }

    if (this.props.entityData) {
      const entityData = this.props.entityData

      Object.keys(mapKeys).forEach(category => {
        entityData[category].forEach(d => {
          let dayOfYear = new Date(Object.keys(d)[0])
          const value = Object.values(d)[0] || 0
          mapKeys[category].push({ x: dayOfYear, y: value })
        })
      })
    }

    const ret = {
      name: name,
      deltaDeaths: mapKeys.deltaDeaths,
      deltaConfirmed: mapKeys.deltaConfirmed,
      confirmed: mapKeys.confirmed,
      deaths: mapKeys.deaths
    }
    return ret
  }
  render() {

    const { name, deltaDeaths, deltaConfirmed, confirmed, deaths } = this.renderData()
    const axisStyle = {
      axisLabel: { fontSize: 8, padding: 10 },
      tickLabels: { fontSize: 6, padding: 3 },
    }
    const typesOfGraph = [
      ["Accumulative", [confirmed, deaths]],
      ["Delta", [deltaConfirmed, deltaDeaths]]
    ]
    const colors = [['darkcyan', 'thistle'], ['gold', 'darkslateblue']]
    if (this.props) {
      return (
        <div className="graph">
          {typesOfGraph.map((category, categoryIdx) => {

            return (
              <VictoryChart scale={{ x: "time", y: "sqrt" }} width={300} height={300} key={categoryIdx} >

                <VictoryAxis
                  style={axisStyle}
                  label={`${name} ${category[0]}`}
                />
                <VictoryAxis dependentAxis
                  style={axisStyle}
                />
                <VictoryGroup >
                  {category[1].map((dataType, dataTypeIdx) => {
                    return (
                      <VictoryArea
                        style={{
                          data: {
                            fill: colors[categoryIdx][dataTypeIdx],
                            // stroke: colors[categoryIdx][dataTypeIdx],
                            // strokeWidth: 0,
                            // fillOpacity: 0.5
                          }
                        }}
                        interpolation={"natural"}
                        data={dataType}
                        key={dataTypeIdx}
                      />
                    )
                  })}
                 
                </VictoryGroup>
              </VictoryChart  >)
          })}
        </div>
      )
    } else {
      return (
        <div></div>
      )
    }
  }
}

export default Graph
// SOURCE: https://github.com/negomi/react-burger-menu#styling


/*
<VictoryArea
                      style={{
                        data: {
                          fill: colors[idx],
                          stroke: colors[idx],
                          strokeWidth: 0,
                          fillOpacity: 0.5
                        }
                      }}
                      interpolation={"natural"}
                      data={dataType}
                    />
                    */



/* <VictoryChart scale={{ x: "time", y: "sqrt" }} width={300} height={300} >

          <VictoryAxis
            style={axisStyle}
            label={`${name} Accumulative`}
          />
          <VictoryAxis dependentAxis
            style={axisStyle}
          />
          <VictoryGroup >
            <VictoryArea
              style={{
                data: {
                  fill: "brown",
                  stroke: "brown",
                  strokeWidth: 0,
                  fillOpacity: 0.5
                }
              }}
              interpolation={"natural"}
              data={deaths}
            />
            <VictoryArea
              style={{
                data: {
                  fill: "green",
                  stroke: "green",
                  strokeWidth: 0,
                  fillOpacity: 0.5
                }
              }}
              interpolation={"natural"}
              data={confirmed}
            />
          </VictoryGroup>
        </VictoryChart  >
        <VictoryChart scale={{ x: "time", y: "sqrt" }} width={300} height={300} >

          <VictoryAxis
            label={`${name} Delta`}
            style={axisStyle}
          />
          <VictoryAxis dependentAxis
            style={axisStyle}
          />
          <VictoryGroup
          >
            <VictoryArea
              style={{
                data: { fill: "magenta", stroke: "magenta", strokeWidth: 0, fillOpacity: 0.5 }
              }}
              interpolation={"natural"}
              data={deltaConfirmed}
            />
            <VictoryArea
              style={{
                data: { fill: "cyan", stroke: "cyan", strokeWidth: 0, fillOpacity: 0.5 },
              }}
              interpolation={"natural"}
              data={deltaDeaths}
            // domain={{ x: [60, 100], y: [0, 5000] }}
            />
          </VictoryGroup>
        </VictoryChart> */


// const statesAndPopulation = {
//   "Alabama": ["AL", 4903185],
//   "Alaska": ["AK", 731545],
//   "Arizona": ["AZ", 7278717],
//   "Arkansas": ["AR", 3017804],
//   "California": ["CA", 39512223],
//   "Colorado": ["CO", 5758736],
//   "Connecticut": ["CT", 3565278],
//   "Delaware": ["DE", 973764],
//   "Florida": ["FL", 21477737],
//   "Georgia": ["GA", 10617423],
//   "Hawaii": ["HI", 1415872],
//   "Idaho": ["ID", 1787065],
//   "Illinois": ["IL", 12671821],
//   "Indiana": ["IN", 6732219],
//   "Iowa": ["IA", 3155070],
//   "Kansas": ["KS", 2913314],
//   "Kentucky": ["KY", 4467673],
//   "Louisiana": ["LA", 4648794],
//   "Maine": ["ME", 1344212],
//   "Maryland": ["MD", 6045680],
//   "Massachusetts": ["MA", 6892503],
//   "Michigan": ["MI", 9986857],
//   "Minnesota": ["MN", 5639632],
//   "Mississippi": ["MS", 2976149],
//   "Missouri": ["MO", 6137428],
//   "Montana": ["MT", 1068778],
//   "Nebraska": ["NE", 1934408],
//   "Nevada": ["NV", 3080156],
//   "New Hampshire": ["NH", 1359711],
//   "New Jersey": ["NJ", 8882190],
//   "New Mexico": ["NM", 2096829],
//   "New York": ["NY", 19453561],
//   "North Carolina": ["NC", 10488084],
//   "North Dakota": ["ND", 762062],
//   "Ohio": ["OH", 11689100],
//   "Oklahoma": ["OK", 3956971],
//   "Oregon": ["OR", 4217737],
//   "Pennsylvania": ["PA", 12801989],
//   "Rhode Island": ["RI", 1059361],
//   "South Carolina": ["SC", 5148714],
//   "South Dakota": ["SD", 884659],
//   "Tennessee": ["TN", 6829174],
//   "Texas": ["TX", 28995881],
//   "Utah": ["UT", 3205958],
//   "Vermont": ["VT", 623989],
//   "Virginia": ["VA", 8535519],
//   "Washington": ["WA", 7614893],
//   "West Virginia": ["WV", 1792147],
//   "Wisconsin": ["WI", 5822434],
//   "Wyoming": ["WY", 578759],
//   "District of Columbia": ["DC", 705749],
//   "American Samoa": ["AS", 57400],
//   "Guam": ["GU", 161700],
//   "Northern Mariana Islands": ["MP", 52300],
//   "Puerto Rico": ["PR", 3193694],
//   "U.S.Virgin Island": ["VI", 103700],
// };

//summary entity: ["us-rhode-island", "canada-alberta"], displayName: ["Rhode Island, US", "Alberta, Canada"]

//history entity: ["us-ri", "canada-alberta"] displayName: ["Rhode Island, US", "Alberta, Canada"



// const fd =
//   [
//     { '4/1/20': 17 },
//     { '3/31/20': 7 },
//     { '3/30/20': 0 },
//     { '3/29/20': 7 },
//     { '3/28/20': 4 },
//     { '3/27/20': 5 },
//     { '3/26/20': 6 },
//     { '3/25/20': 3 },
//     { '3/24/20': 1 },
//     { '3/23/20': 3 },
//     { '3/22/20': 0 },
//     { '3/21/20': 0 },
//     { '3/20/20': 2 },
//     { '3/19/20': 1 },
//     { '3/18/20': 1 },
//     { '3/17/20': 1 },
//     { '3/16/20': 0 },
//     { '3/15/20': 0 },
//     { '3/14/20': 0 },
//     { '3/13/20': 0 },
//     { '3/12/20': 0 },
//     { '3/11/20': 0 },
//     { '3/10/20': 0 },
//     { '3/9/20': 0 },
//     { '3/8/20': 0 },
//     { '3/7/20': 0 },
//     { '3/6/20': 0 },
//     { '3/5/20': 0 },
//     { '3/4/20': null }
//   ]

// const a = [
//   { '4/1/20': 58 },
//   { '3/31/20': 41 },
//   { '3/30/20': 34 },
//   { '3/29/20': 34 },
//   { '3/28/20': 27 },
//   { '3/27/20': 23 },
//   { '3/26/20': 18 },
//   { '3/25/20': 12 },
//   { '3/24/20': 9 },
//   { '3/23/20': 8 },
//   { '3/22/20': 5 },
//   { '3/21/20': 5 },
//   { '3/20/20': 5 },
//   { '3/19/20': 3 },
//   { '3/18/20': 2 },
//   { '3/17/20': 1 },
//   { '3/16/20': null },
//   { '3/15/20': null },
//   { '3/14/20': null },
//   { '3/13/20': null },
//   { '3/12/20': null },
//   { '3/11/20': null },
//   { '3/10/20': null },
//   { '3/9/20': null },
//   { '3/8/20': null },
//   { '3/7/20': null },
//   { '3/6/20': null },
//   { '3/5/20': null },
//   { '3/4/20': null },
// ]