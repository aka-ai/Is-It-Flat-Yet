import { blackList } from './BaseMapConstants'

export const changeLatLong = (data) => {
  const { entityId } = data
  if (entityId === 'belize') {
    return { lat: 17.1899, lng: -88.4976}
  }
  if (entityId === 'barbados') {
    return { lat: 13.1939, lng: -59.5432}
  }
  if (entityId === 'malaysia') {
    return { lat: 3.1390, lng: 101.6869 }
  }
  if (entityId === 'france-st-martin') {
    return { lat: 18.1218, lng: - 63.0357}
  }
  if (entityId === "sint-maarten-netherlands") {
    return { lat: 18.0255, lng: -63.0548 }
  }
  if (entityId === "congo-kinshasa") {
    return { lat: -4.441889, lng: 15.266306 }
  }
  if (entityId === "congo-brazzaville") {
    return { lat: -4.2634, lng: 15.2429}
  }

  return {lat: data.lat, lng: data.lng }
}

export const isBlackList = (data) => {
  return (
    blackList.indexOf(data.entityId) > -1 ||
    (blackList.indexOf(data.countryOrRegion.toLowerCase()) > -1 &&
      !data.stateOrProvince)
  );
}

export const renderHistoricData = (input) => {
  if (JSON.stringify(input) === '{}') {
    return { name: '', deltaDeaths: [], deltaConfirmed: [], confirmed: [], deaths: [] }
  }
  const mapKeys = { deltaDeaths: [], deltaConfirmed: [], confirmed: [], deaths: [] }
  Object.keys(mapKeys).forEach(category => {
    let dayOfYear, value
    input[category].forEach(d => {

      dayOfYear = new Date(d.date)
      value = parseInt(d.val)
      mapKeys[category].push({ x: dayOfYear, y: value })
    })
  })


  return {
    deltaDeaths: mapKeys.deltaDeaths,
    deltaConfirmed: mapKeys.deltaConfirmed,
    confirmed: mapKeys.confirmed,
    deaths: mapKeys.deaths,
    name: input.displayName,
    latestConfirmed: input.latestConfirmed,
    latestDeaths: input.latestDeaths,
    lastUpdated: input.lastUpdated,

  }
}