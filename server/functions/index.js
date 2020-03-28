const functions = require('firebase-functions');
const admin = require("firebase-admin");

const axios = require("axios");
const parse = require("csv-parse/lib/sync");

const helpers = require("./helpers");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const summaryCollectionRef = db.collection("Summary");

const CATEGORIES = {
  CONFIRMED: "confirmed",
  DEATHS: "deaths"
};

// reportService calls CSSE data from GitHub every hour and updates our database with updated statistics
exports.reportService = functions.pubsub
  .schedule("0 * * * *")
  .onRun(async context => {
    console.log("Started reportService with context: ", context);
    try {
      await fetchDataAndUpdateDB();
      console.log("Finished reportService successfully");
    } catch (e) {
      console.error(`reportService error: ${e.message}`);
      console.error(e.stack);
    }
  });

const fetchDataAndUpdateDB = async () => {
  console.log("calling fetchAndUpdateDB");
  const options = {}

  // get github data
  for (const category of Object.values(CATEGORIES)) {
    options.url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${category}_global.csv`
    const githubResponse = await axios(options);
    if (githubResponse.status !== 200 || githubResponse.data === "") {
      console.error("Error or Empty response from Github!: ", githubResponse);
    } else {
      const jhData = githubResponse.data;
      await updateJH(category, jhData);
    }
  }

  // get ctp data
  options.url = "https://covidtracking.com/api/states"
  const ctpResponse = await axios(options)

  if (ctpResponse.status !== 200 || ctpResponse.data === "") {
    console.error("Error or Empty response from Github!: ", ctpResponse);
  } else {
    const ctpData = ctpResponse.data;
    await updateCTP(ctpData);
  }


};

const updateCTP = async (data) => {
  const gatheredData = []
  data.forEach(st => {
    let obj = {}
    let { state, positive, negative, pending, hospitalized, death, totalTestResults } = st
    if (!pending) pending = "n/a"
    if (!death) death = 0
    if (!hospitalized) hospitalized = "n/a"
    if (!negative) negative = "n/a"

    obj["confirmed"] = positive
    obj["deaths"] = death
    obj["countryOrRegion"] = "US"
    obj["stateOrProvince"] = statesAndPopulation[state][0]
    obj["totalTestResults"] = totalTestResults
    obj["pending"] = pending
    obj["hospitalized"] = hospitalized
    obj["negative"] = negative
    obj["stateAbbreviation"] = state
    obj["population"] = statesAndPopulation[state][1]
    obj["percapitaPercentage"] = (positive / statesAndPopulation[state][1]) * 100
    obj["lat"] = statesLatLng[state][0]
    obj["lng"] = statesLatLng[state][1]

    gatheredData.push(obj)
  })
  // return gatheredData
  summaryCollectionRef.doc('ctp').set({ states: gatheredData })

}

const updateJH = async (category, csvData) => {
  category = category.toLowerCase();
  console.log("Updating DB for category: ", category);

  // parse from csv
  const updateData = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });

  const summaryUpdate = {}

  // iterate over each object and put into db as appropriate
  // if writes need to be optimized later, we can refactor this to happen in parallel for each row
  for (const row of updateData) {
    const countryOrRegion = row["Country/Region"];
    const cityStateOrProvince = row["Province/State"];
    let cityStateOrProvinceId = helpers.formatName(countryOrRegion);
    if (cityStateOrProvince) cityStateOrProvinceId += `-${helpers.formatName(cityStateOrProvince)}`;

    // Get updated numbers
    const { mostRecent, lastUpdated, newDeltas } = helpers.getStats(row);

    // Setup the new document attrs to merge in
    const update = {
      countryOrRegion: countryOrRegion,
      stateOrProvince: cityStateOrProvince,
      lat: Math.round(row["Lat"] * 100) / 100,
      lon: Math.round(row["Long"] * 100) / 100,
      deltas: {}
    };

    update.deltas[category] = newDeltas;
    update[category] = parseInt(mostRecent);
    update.lastUpdated = lastUpdated;

    // setup summary update
    summaryUpdate[cityStateOrProvinceId] = update;
  }

  // Update the summary doc
  console.log('updating summary collection')
  summaryCollectionRef.doc('all').set(summaryUpdate, { merge: true })
};

const statesAndPopulation = {
  AL: ["Alabama", 4903185],
  AK: ["Alaska", 731545],
  AZ: ["Arizona", 7278717],
  AR: ["Arkansas", 3017804],
  CA: ["California", 39512223],
  CO: ["Colorado", 5758736],
  CT: ["Connecticut", 3565278],
  DE: ["Delaware", 973764],
  FL: ["Florida", 21477737],
  GA: ["Georgia", 10617423],
  HI: ["Hawaii", 1415872],
  ID: ["Idaho", 1787065],
  IL: ["Illinois", 12671821],
  IN: ["Indiana", 6732219],
  IA: ["Iowa", 3155070],
  KS: ["Kansas", 2913314],
  KY: ["Kentucky", 4467673],
  LA: ["Louisiana", 4648794],
  ME: ["Maine", 1344212],
  MD: ["Maryland", 6045680],
  MA: ["Massachusetts", 6892503],
  MI: ["Michigan", 9986857],
  MN: ["Minnesota", 5639632],
  MS: ["Mississippi", 2976149],
  MO: ["Missouri", 6137428],
  MT: ["Montana", 1068778],
  NE: ["Nebraska", 1934408],
  NV: ["Nevada", 3080156],
  NH: ["New Hampshire", 1359711],
  NJ: ["New Jersey", 8882190],
  NM: ["New Mexico", 2096829],
  NY: ["New York", 19453561],
  NC: ["North Carolina", 10488084],
  ND: ["North Dakota", 762062],
  OH: ["Ohio", 11689100],
  OK: ["Oklahoma", 3956971],
  OR: ["Oregon", 4217737],
  PA: ["Pennsylvania", 12801989],
  RI: ["Rhode Island", 1059361],
  SC: ["South Carolina", 5148714],
  SD: ["South Dakota", 884659],
  TN: ["Tennessee", 6829174],
  TX: ["Texas", 28995881],
  UT: ["Utah", 3205958],
  VT: ["Vermont", 623989],
  VA: ["Virginia", 8535519],
  WA: ["Washington", 7614893],
  WV: ["West Virginia", 1792147],
  WI: ["Wisconsin", 5822434],
  WY: ["Wyoming", 578759],
  DC: ["District of Columbia", 705749],
  AS: ["American Samoa", 57400],
  GU: ["Guam", 161700],
  MP: ["Northern Mariana Islands", 52300],
  PR: ["Puerto Rico", 3193694],
  VI: ["U.S.Virgin Islands", 103700],
}
const statesLatLng = {
  AK: [63.588753, -154.493062],
  AL: [32.318231, -86.902298],
  AR: [35.20105, -91.831833],
  AZ: [34.048928, -111.093731],
  CA: [36.778261, -119.417932],
  CO: [39.550051, -105.782067],
  CT: [41.603221, -73.087749],
  DE: [38.910832, -75.52767],
  FL: [27.664827, -81.515754],
  GA: [32.157435, -82.907123],
  HI: [19.898682, -155.665857],
  IA: [41.878003, -93.097702],
  ID: [44.068202, -114.742041],
  IL: [40.633125, -89.398528],
  IN: [40.551217, -85.602364],
  KS: [39.011902, -98.484246],
  KY: [37.839333, -84.270018],
  LA: [31.244823, -92.145024],
  MA: [42.407211, -71.382437],
  MD: [39.045755, -76.641271],
  ME: [45.253783, -69.445469],
  MI: [44.314844, -85.602364],
  MN: [46.729553, -94.6859],
  MO: [37.964253, -91.831833],
  MS: [32.354668, -89.398528],
  MT: [46.879682, -110.362566],
  NC: [35.759573, -79.0193],
  ND: [47.551493, -101.002012],
  NE: [41.492537, -99.901813],
  NH: [43.193852, -71.572395],
  NJ: [40.058324, -74.405661],
  NM: [34.97273, -105.032363],
  NV: [38.80261, -116.419389],
  NY: [43.299428, -74.217933],
  OH: [40.417287, -82.907123],
  OK: [35.007752, -97.092877],
  OR: [43.804133, -120.554201],
  PA: [41.203322, -77.194525],
  PR: [18.220833, -66.590149],
  RI: [41.580095, -71.477429],
  SC: [33.836081, -81.163725],
  SD: [43.969515, -99.901813],
  TN: [35.517491, -86.580447],
  TX: [31.968599, -99.901813],
  UT: [39.32098, -111.093731],
  VA: [37.431573, -78.656894],
  VT: [44.558803, -72.577841],
  WA: [47.751074, -120.740139],
  WI: [43.78444, -88.787868],
  WV: [38.597626, -80.454903],
  WY: [43.075968, -107.290284],
  DC: [38.905985, -77.033418],
  AS: [-14.306408, -170.695017],
  GU: [13.4443, 144.7937],
  MP: [15.1063896, 145.7065244],
  VI: [18.3357658, -64.8963318],
}