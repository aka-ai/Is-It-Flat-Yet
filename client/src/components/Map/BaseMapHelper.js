import { blackList } from './BaseMapConstants'

export const sanitize = (entity) => {
  // const { entityId } = data
  switch (entity.entityId) {
    case 'belize':
      entity.lat = 17.1899
      entity.lng = -88.4976
      break
    case 'barbados':
      entity.lat = 13.1939
      entity.lng = -59.5432
      break
    case 'malaysia':
      entity.lat = 3.1390
      entity.lng = 101.6869 
      break
    case 'france-st-martin':
      entity.lat = 18.1218
      entity.lng = - 63.0357
      break
    case "sint-maarten-netherlands":
      entity.lat = 18.0255
      entity.lng = -63.0548 
      break
    case "congo-kinshasa":
      entity.lat = -4.441889
      entity.lng = 15.266306 
      break
    case "congo-brazzaville":
      entity.lat = -4.2634
      entity.lng = 15.2429
      break
    case "china-hong-kong":
      entity.displayName = "Hong Kong"
      break
    case "taiwan":
      entity.displayName = "Taiwan"
  }

  return entity
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