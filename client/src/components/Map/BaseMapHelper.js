import {blackList} from './BaseMapConstants'

export const changeLatLong = (data) => {
  const { countryOrRegion } = data
  if (countryOrRegion === 'Belize') {
    data.lat = 17.1899
    data.lon = -88.4976
  }
  if (countryOrRegion === 'Barbados') {
    data.lat = 13.1939
    data.lon = -59.5432
  }
  if (countryOrRegion === 'Malaysia') {
    data.lat = 4.2105
    data.lon = 101.9758
  }
}

export const isBlackList = (data) => {
  return (
    blackList.indexOf(data.cityStateOrProvinceId) > -1 ||
    (blackList.indexOf(data.countryOrRegion.toLowerCase()) > -1 &&
    !data.stateOrProvince)
  );;
}

export const renderHistoricData = (input ) => {
  if (JSON.stringify(input) === '{}') {
    return {name: '', deltaDeaths: [], deltaConfirmed: [], confirmed: [], deaths: []}
  }
  const name = input.displayName
  const mapKeys = { deltaDeaths: [], deltaConfirmed: [], confirmed: [], deaths: [] }
  Object.keys(mapKeys).forEach(category => {
      let dayOfYear, value
      input[category].forEach(d => {
        if (input.countryOrRegion === "US" && input.entityId !== 'us') {
          dayOfYear = new Date(Object.keys(d)[0])
          value = Object.values(d)[0] || 0
        } else {
          dayOfYear = new Date(d.date)
          value = parseInt(d.val)
        }
        mapKeys[category].push({ x: dayOfYear, y: value })
      })
    })

  return {
    name: name,
    deltaDeaths: mapKeys.deltaDeaths,
    deltaConfirmed: mapKeys.deltaConfirmed,
    confirmed: mapKeys.confirmed,
    deaths: mapKeys.deaths,
  }
}