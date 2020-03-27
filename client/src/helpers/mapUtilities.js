export const USLocation = {
  lat: 39.0119,
  lng: -98.4842
}

export const getConstantsForInfoWindow = (clickedMarkerKey) => {
  let location, country, confirmed,
    deaths, hospitalized, percapitaPercentage, population, totalTestResults

  location = clickedMarkerKey.location
  country = clickedMarkerKey.country
  confirmed = clickedMarkerKey.confirmed
  deaths = clickedMarkerKey.deaths

  if (clickedMarkerKey.country === "US") {
    hospitalized = clickedMarkerKey.hospitalized
    percapitaPercentage = Number.parseFloat(clickedMarkerKey.percapitaPercentage).toFixed(3)
    population = clickedMarkerKey.population
    totalTestResults = clickedMarkerKey.totalTestResults
  }

  return {
    location, country, confirmed,
    deaths, hospitalized, percapitaPercentage, population, totalTestResults
  }
}

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

export const isBlackList = (key) => {
  if (
    key === "us" ||
    key === "guam" ||
    key === "diamond-princess" ||
    key === "grand-princess" ||
    key === "mayotte" ||
    key === "france-guadeloupe" ||
    key === "virgin-islands" ||
    key === "greenland" ||
    key === "republic-of-the-congo" ||
    key === "congo-brazzaville" ||
    key === "canada-grand-princess" ||
    key === "canada-diamond-princess"
  ) return true
}
//source: https://mapstyle.withgoogle.com/
const mapStyle = [
  {
    "featureType": "administrative",
    "elementType": "labels.text.fill",
    "stylers": [
      {
        "color": "#444444"
      }
    ]
  },
  // {
  //   "featureType": 'administrative.province',
  //   "elementType": 'geometry.stroke',
  //   "stylers": [{ "visibility": '#off' }]
  // },
  {
    "featureType": "landscape",
    "elementType": "all",
    "stylers": [
      {
        "color": "000000"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "all",
    "stylers": [
      {
        "color": "#46bcec"
      },
      {
        "visibility": "on"
      }
    ]
  },
  {
    "featureType": "water",
    "elementType": "geometry",
    "stylers": [
      {
        "color": "#A4BFC3",
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "all",
    "stylers": [
      {
        "saturation": -100
      },
      {
        "lightness": 45
      }
    ]
  },
  {
    "featureType": "road.highway",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.arterial",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "elementType": "all",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]
export default mapStyle
