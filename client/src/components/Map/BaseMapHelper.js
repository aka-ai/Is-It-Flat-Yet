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
  return blackList.indexOf(data.normalizedName) > -1;
}