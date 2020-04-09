export const USLocation = {
  lat: 39.0119,
  lng: -98.4842
};
export const PortugalLocation = {
  lat: 39.3999,
  lng: -8.2245
}

export const blackList = [
         "us",
         "guam",
         "diamond-princess",
         "grand-princess",
         "mayotte",
         "france-guadeloupe",
         "virgin-islands",
         "greenland",
         "republic-of-the-congo",
         "congo-brazzaville",
         "canada-grand-princess",
         "canada-diamond-princess",
         "ms-zaandam"
       ];

//source: https://mapstyle.withgoogle.com/
export const mapStyle = [
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
        "color": "#e1dcdc"
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
        "color": "#9dc1cd",
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