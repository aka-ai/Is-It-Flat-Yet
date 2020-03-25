const functions = require('firebase-functions');
const admin = require("firebase-admin");

const axios = require("axios");
const parse = require("csv-parse/lib/sync");

const helpers = require("./helpers");

admin.initializeApp(functions.config().firebase);
const db = admin.firestore();

const CATEGORIES = {
  confirmed: "Confirmed",
  deaths: "Deaths",
  recovered: "Recovered"
};

// reportService calls CSSE data from GitHub every hour and updates our database with updated statistics
exports.reportService = functions.pubsub
  .schedule("0 * * * *")
  .onRun(async context => {
    console.log("Started reportService with context: ", context);
    try {
      for (const category of Object.values(CATEGORIES)) {
        await fetchDataAndUpdateDB(category);
      }
      console.log("Finished reportService successfully");
    } catch (e) {
      console.error(`reportService error: ${e.message}`);
      console.error(e.stack);
    }
  });

const fetchDataAndUpdateDB = async category => {
  console.log("calling fetch from github with category: ", category);
  const options = {
    url:
      "https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/" +
      `csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-${category}.csv`
  };

  let githubResponse = "";
  githubResponse = await axios(options);

  if (githubResponse.status !== 200 || githubResponse.data === "") {
    console.error("Error or Empty response from Github!: ", githubResponse);
  } else {
    const data = githubResponse.data;
    await updateDB(category, data);
  }
};

const updateDB = async (category, csvData) => {
  category = category.toLowerCase();
  console.log("Updating DB for category: ", category);
  let batch = db.batch();

  // parse from csv
  const updateData = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });

  const allCollectionRef = db.collection("All");
  const summaryCollectionRef = db.collection("Summary");

  const summaryUpdate = {}

  // iterate over each object and put into db as appropriate
  // if writes need to be optimized later, we can refactor this to happen in parallel for each row
  for (const row of updateData) {
    const countryOrRegion = helpers.formatName(row["Country/Region"]);
    const cityStateOrProvince = helpers.formatName(row["Province/State"]);
    let cityStateOrProvinceId = countryOrRegion;
    if (cityStateOrProvince) cityStateOrProvinceId += `-${cityStateOrProvince}`;

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

    docRef = allCollectionRef.doc(cityStateOrProvinceId);
    batch.set(docRef, update, { merge: true });

    // setup summary update
    summaryUpdate[cityStateOrProvinceId] = update;
    delete summaryUpdate.deltas
  }

  // Update the summary doc
  console.log('updating summary collection')
  summaryCollectionRef.doc('all').set(summaryUpdate, { merge: true })

  // Perform the batch write
  console.log("batch committing to 'all' collection");
  batch.commit();
};