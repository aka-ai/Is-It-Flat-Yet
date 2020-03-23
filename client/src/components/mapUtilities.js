export const USLocation = {
  lat: 37.0902,
  lng: -95.7129
}

export const isBlackList = (stateOrProvince, countryOrRegion) => {
  if (countryOrRegion === "guam" ||
    stateOrProvince === "diamond-princess" ||
    stateOrProvince === "grand-princess" ||
    stateOrProvince === "mayotte" ||
    (stateOrProvince === "guadeloupe" && countryOrRegion === "france") ||
    (stateOrProvince === "aruba" && countryOrRegion === "netherlands") ||
    stateOrProvince === "united-states-virgin-islands" ||
    stateOrProvince === "virgin-islands" ||
    countryOrRegion === "greenland" ||
    countryOrRegion === "republic-of-the-congo" ||
    countryOrRegion === "congo-brazzaville" ||
    (countryOrRegion === "netherlands" && stateOrProvince === "")
  ) return true
}
//source: https://mapstyle.withgoogle.com/
const mapStyle = [
  {
    "featureType": "administrative.land_parcel",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi",
    "elementType": "labels.text",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "poi.business",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road",
    "elementType": "labels.icon",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "road.local",
    "elementType": "labels",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  },
  {
    "featureType": "transit",
    "stylers": [
      {
        "visibility": "off"
      }
    ]
  }
]
export default mapStyle
