const axios = require("axios");
const parse = require("csv-parse/lib/sync");
const dayjs = require('dayjs');

const { statesLatLng, statesAndPopulation } = require('./constants')

const functions = require("firebase-functions");
const admin = require("firebase-admin");

console.log("initializing firebase-admin with config: ", functions.config(), functions.config().firebase);
admin.initializeApp(functions.config().firebase);
const db = admin.firestore();
const summaryCollectionRef = db.collection("Summary");
const historyCollectionRef = db.collection("History")
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
  console.log('getting jhu data')
  const summaryTemp = {}
  const historyTemp = {}
  for (const category of Object.values(CATEGORIES)) {
    httpOptions.url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${category}_global.csv`
    const githubResponse = await axios(httpOptions);
    if (githubResponse.status !== 200 || githubResponse.data === "") {
      console.error("Error or Empty response from Github!: ", githubResponse);
      throw new Error("Error calling GitHub API for JHU data")
    } else {
      const jhuData = githubResponse.data;
      await updateJH(summaryTemp, historyTemp, category, jhuData);
    }
  }
  // Write temp data to db in the format we want it
  const countries = Object.values(summaryTemp)
  await summaryCollectionRef.doc("jhu").set({ countries: countries });

  console.log("Batch committing jhu data")
  const batch = db.batch();
  Object.values(historyTemp).forEach(entity => {
    const ref = historyCollectionRef.doc(entity.entityId)
    batch.set(ref, entity)
  })
  batch.commit()

  // get ctp data
  console.log('getting ctp data')
  httpOptions.url = "https://covidtracking.com/api/states"
  const ctpResponse = await axios(httpOptions)

  if (ctpResponse.status !== 200 || ctpResponse.data === "") {
    console.error("Error or Empty response from Github!: ", ctpResponse);
    throw new Error("Error calling CovidTracking API")
  } else {
    await updateCTPSummaryData(ctpResponse.data);
  }


  //get ctp history data
  httpOptions.url = 'https://covidtracking.com/api/states/daily'
  const covidTrackingResponse = await axios(httpOptions)

  if (covidTrackingResponse.status !== 200 || covidTrackingResponse.data === "") {
    console.error("Error or Empty response from CovidTracking!: ", covidTrackingResponse);
    throw new Error("Error calling CovidTracking API")
  } else {
    await updateCTPHistoryData(covidTrackingResponse.data)
  }
};


const updateJH = async (summaryTemp, historyTemp, category, jhuData) => {
  console.log("Setting temp data for category: ", category);
  const updateData = parse(jhuData, {
    columns: true,
    skip_empty_lines: true
  });

  for (const row of updateData) {
    const countryOrRegion = row["Country/Region"];
    const stateOrProvince = row["Province/State"];
    const displayName = stateOrProvince
      ? `${stateOrProvince}` + ", " + `${countryOrRegion}`
      : countryOrRegion;

    let entityId = helpers.formatName(countryOrRegion)
    if (stateOrProvince) {
      entityId += `-${helpers.formatName(stateOrProvince)}`;
    }

    // Setup the new document attrs to merge in
    const update = historyTemp[entityId] || {
      entityId,
      countryOrRegion,
      stateOrProvince,
      displayName,
      lat: Math.round(row["Lat"] * 100) / 100,
      lng: Math.round(row["Long"] * 100) / 100,
      confirmed: [],
      deltaConfirmed: [],
      deaths: [],
      deltaDeaths: []
    };

    const { mostRecent, lastUpdated } = helpers.getStats(row);

    update[`latest${helpers.capitalize(category)}`] = parseInt(mostRecent);
    update.lastUpdated = lastUpdated;

    if (!historyTemp[update.entityId]) {
      historyTemp[update.entityId] = JSON.parse(JSON.stringify(update))
    } else {
      historyTemp[update.entityId] = Object.assign(
        historyTemp[update.entityId],
        JSON.parse(JSON.stringify(update))
      );
    }

    // Generate historical data and net new curves
    // eslint-disable-next-line no-loop-func
    Object.keys(row).map(key => {
      if ([
      "Province/State", "Country/Region", "Lat", "Long"].indexOf(key) > 1 
      && helpers.isTempPeriodOver("07-01-2020", "MM-DD-YYYY") 
      && positiveIncrease !== 0
      ) {
        let yesterday = dayjs(dayjs(key).subtract(1, "days")).format("M/D/YY")
        let delta
        if (row[yesterday]) {
          delta = parseInt(row[key]) - parseInt(row[yesterday])
        }
        historyTemp[update.entityId][category].push(
          { date: key, val: row[key] }
        )
        historyTemp[update.entityId][`delta${helpers.capitalize(category)}`].push(
          { date: key, val: delta || '0' }
        )
      }
    })

    if (!summaryTemp[update.entityId]) {
      summaryTemp[update.entityId] = JSON.parse(JSON.stringify(update));
    } else {
      summaryTemp[update.entityId] = Object.assign(
        summaryTemp[update.entityId],
        JSON.parse(JSON.stringify(update))
      );
    }
    // prep update for summary collection; we don't want all the fields
    // since it gets stuff into a single document
    const toDelete = ['confirmed', 'deltaConfirmed', 'deaths', 'deltaDeaths']
    toDelete.forEach(attr => {
      delete summaryTemp[entityId][attr]
    })
  }
  // We return nothing since we are directly mutating the temp objects being passed in
};


const updateCTPSummaryData = async (data) => {
  const gatheredData = []
  data.forEach(st => {
    let obj = {}
    let { state, positive, negative, pending, hospitalized, death, totalTestResults } = st
    const stateOrProvince = statesAndPopulation[state][0];
    if (!pending) pending = "n/a"
    // if (!death) death = 0 - we want to skip empty data points
    if (!hospitalized) hospitalized = "n/a"
    if (!negative) negative = "n/a"

    obj["latestConfirmed"] = positive
    obj["latestDeaths"] = death
    obj["countryOrRegion"] = "US"
    obj["entityId"] = stateOrProvince ? "us-" + helpers.formatName(stateOrProvince) : "us"
    obj["stateOrProvince"] = stateOrProvince
    obj["displayName"] = `${stateOrProvince}` + ', US'
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

  console.log('writing ctp summary data')
  summaryCollectionRef.doc('ctp').set({ states: gatheredData })
}

const updateCTPHistoryData = (rawData) => {
  const ctpTemp = {}
  for (const row of rawData) {
    const date = helpers.getDate(row["date"])
    const {
      state,
      positive,
      negative,
      hospitalized,
      death,
      totalTestResults,
      fips,
      deathIncrease,
      hospitalizedIncrease,
      negativeIncrease,
      positiveIncrease,
      totalTestResultsIncrease
    } = row;
    // if positiveIncrease is zero, we assume it's a bad datapoint and skip it, but only temporarily
    if (!helpers.isTempPeriodOver("07-01-2020", "MM-DD-YYYY") && 
    positiveIncrease) {       
      const countryOrRegion = "US";
      const stateOrProvince = state;
      const displayName = stateOrProvince
        ? `${statesAndPopulation[stateOrProvince][0]}` +
          ", " +
          `${countryOrRegion}`
        : countryOrRegion;

      let entityId = helpers.formatName(countryOrRegion);
      if (stateOrProvince) {
        entityId += `-${helpers.formatName(stateOrProvince)}`;
      }
      const update = ctpTemp[entityId] || {
        entityId,
        displayName,
        countryOrRegion,
        stateOrProvince,
        lat: statesLatLng[state][0],
        lng: statesLatLng[state][1],
        confirmed: [],
        negative: [],
        hospitalized: [],
        deaths: [],
        totalTestResults: [],
        fips: [],
        deltaDeaths: [],
        deltaHospitalized: [],
        deltaNegative: [],
        deltaConfirmed: [],
        deltaTotalTestResults: []
      };
      update["confirmed"].push({ [date]: positive });
      update["deltaConfirmed"].push({ [date]: positiveIncrease });
      update["deaths"].push({ [date]: death });
      update["deltaDeaths"].push({ [date]: deathIncrease });
      update["deltaHospitalized"].push({ [date]: hospitalizedIncrease });
      update["deltaNegative"].push({ [date]: negativeIncrease });

      update["negative"].push({ [date]: negative });
      update["hospitalized"].push({ [date]: hospitalized });
      update["totalTestResults"].push({ [date]: totalTestResults });
      update["fips"].push({ [date]: fips });

      update["deltaTotalTestResults"].push({
        [date]: totalTestResultsIncrease
      });

      ctpTemp[entityId] = update;
    }
  }

  console.log("Batch writing ctp history data")
  const batch = db.batch();
  Object.values(ctpTemp).forEach(entity => {
    const ref = historyCollectionRef.doc(entity.entityId)
    batch.set(ref, entity)
  })
  batch.commit()
}