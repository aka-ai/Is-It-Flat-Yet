/*
const fakeData = [
  {
    Confirmed: "7",
    Deaths: "0",
    Recovered: "0",
    countryOrRegion: "afghanistan",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 33,
    lon: 65,
    stateOrProvince: "",
  },
  {
    Confirmed: "67786",
    Deaths: "3062",
    Recovered: "51553",
    countryOrRegion: "china",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 30,
    lon: 112,
    stateOrProvince: "hubei",
  },
  {
    Confirmed: "1356",
    Deaths: "8",
    Recovered: "1296",
    countryOrRegion: "china",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 23,
    lon: 113,
    stateOrProvince: "guangdong",
  },
  {
    Confirmed: "47",
    Deaths: "0",
    Recovered: "16",
    countryOrRegion: "vietnam",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 14,
    lon: 108,
    stateOrProvince: "",
  },
  {
    Confirmed: "11364",
    Deaths: "514",
    Recovered: "2959",
    countryOrRegion: "iran",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 32,
    lon: 53,
    stateOrProvince: "",
  },
  {
    Confirmed: "15113",
    Deaths: "1016",
    Recovered: "1045",
    countryOrRegion: "italy",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 41,
    lon: 12,
    stateOrProvince: "",
  },
  {
    Confirmed: "328",
    Deaths: "0",
    Recovered: "0",
    countryOrRegion: "us",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 40,
    lon: -74,
    stateOrProvince: "new york",
  },
  {
    Confirmed: "19",
    Deaths: "0",
    Recovered: "0",
    countryOrRegion: "us",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 30,
    lon: -91,
    stateOrProvince: "louisiana",
  },
  {
    Confirmed: "11",
    Deaths: "0",
    Recovered: "0",
    countryOrRegion: "us",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 38,
    lon: -116,
    stateOrProvince: "nevada",
  },
  {
    Confirmed: "21",
    Deaths: "0",
    Recovered: "0",
    countryOrRegion: "us",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 37,
    lon: -112,
    stateOrProvince: "grand princess",
  },
  {
    Confirmed: "457",
    Deaths: "31",
    Recovered: "1",
    countryOrRegion: "us",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 47,
    lon: -120,
    stateOrProvince: "washington",
  },
  {
    Confirmed: "53",
    Deaths: "1",
    Recovered: "4",
    countryOrRegion: "canada",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 53,
    lon: -127,
    stateOrProvince: "british columbia",
  },
  {
    Confirmed: "12",
    Deaths: "0",
    Recovered: "4",
    countryOrRegion: "mexico",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 23,
    lon: -102,
    stateOrProvince: "",
  },
  {
    Confirmed: "809",
    Deaths: "1",
    Recovered: "1",
    countryOrRegion: "sweden",
    deltas: {
      Confirmed: {
        sevenDays: 600,
        thirtyDay: 700,
        threeDay: 75,
      },
      Deaths: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
      Recovered: {
        sevenDays: 0,
        thirtyDay: 0,
        threeDay: 0,
      },
    },
    lastUpdated: "3/12/20",
    lat: 60,
    lon: 18,
    stateOrProvince: "",
  },
]

export default fakeData
*/