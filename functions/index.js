const axios = require("axios");
const parse = require("csv-parse/lib/sync");

const { statesLatLng, statesAndPopulation } = require('./constants')

const functions = require("firebase-functions");
const admin = require("firebase-admin");

console.log("initializing firebase-admin with config: ", functions.config(), functions.config().firebase);
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const summaryCollectionRef = db.collection("Summary");
const helpers = require("./helpers");

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
  const httpOptions = {};

  // get jhu data
  // the two api calls to GitHub race, 
  // so we put the results in a temp map 
  // before converting to a list of entities
  const temp = {}
  for (const category of Object.values(CATEGORIES)) {
    httpOptions.url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${category}_global.csv`
    const githubResponse = await axios(httpOptions);
    if (githubResponse.status !== 200 || githubResponse.data === "") {
      console.error("Error or Empty response from Github!: ", githubResponse);
      throw new Error("Error calling GitHub API for JHU data")
    } else {
      const jhuData = githubResponse.data;
      await updateJH(temp, category, jhuData);
    }
  }
  // Write temp data to db in the format we want it
  const countries = Object.values(temp)
  await summaryCollectionRef.doc("jhu").set({ countries: countries });

  // get ctp data
  httpOptions.url = "https://covidtracking.com/api/states"
  const ctpResponse = await axios(httpOptions)

  if (ctpResponse.status !== 200 || ctpResponse.data === "") {
    console.error("Error or Empty response from Github!: ", ctpResponse);
  } else {
    const ctpData = ctpResponse.data;
    await updateCTP(ctpData);
  }
};


const updateJH = async (temp, category, jhuData) => {
  console.log("Setting temp data for category: ", category);
  const updateData = parse(jhuData, {
    columns: true,
    skip_empty_lines: true
  });

  for (const row of updateData) {
    const countryOrRegion = row["Country/Region"];
    const cityStateOrProvince = row["Province/State"];

    // Setup the new document attrs to merge in
    const update = {
      countryOrRegion: countryOrRegion,
      cityStateOrProvince: cityStateOrProvince,
      lat: Math.round(row["Lat"] * 100) / 100,
      lng: Math.round(row["Long"] * 100) / 100
    };

    const { mostRecent, lastUpdated } = helpers.getStats(row);

    update.normalizedName = helpers.getNormalizedName(update);
    update[category] = parseInt(mostRecent);
    update.lastUpdated = lastUpdated;

    if (!temp[update.normalizedName]) {
      temp[update.normalizedName] = update;
    } else {
      temp[update.normalizedName] = Object.assign(
        temp[update.normalizedName],
        update
      );
    }
  }
  // We return nothing since we are directly mutating the temp object passed in by caller
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
    obj["cityStateOrProvince"] = statesAndPopulation[state][0]
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