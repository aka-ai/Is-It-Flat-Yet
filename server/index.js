const axios = require('axios')
const parse = require('csv-parse/lib/sync')
const admin = require('firebase-admin')
const functions = require('firebase-functions')

const helpers = require('./helpers')

admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

const CATEGORIES = {
  confirmed: 'confirmed',
  deaths: 'deaths',
  recovered: 'recovered'
};

// reportService calls CSSE data from GitHub every hour and updates our database with updated statistics
exports.reportService = async (req, res) => {
  console.log('Started reportService')
  for (const category of Object.values(CATEGORIES)) {
    await fetchDataAndUpdateDB(category)
  }
  console.log('Finished reportService')
};

const fetchDataAndUpdateDB = async (category) => {
  const options = {
    baseURL: 'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/',
    url: `/time_series_19-covid-${category}.csv`
  };

  let githubResponse = '';
  try {
    githubResponse = await axios(options)
  } catch (e) {
    console.error(`error during api call: ${e.message}`)
    console.error(e.stack)
  }

  if (githubResponse.status !== 200 || githubResponse.data === '') {
    console.error('Error or Empty response from Github!: ', githubResponse);
    throw new Error('Non-200 received from GitHub')
  } else {
    const data = githubResponse.data;
    try {
      await updateDB(category, data);
    } catch (e) {
      console.error(`error while updating DB: ${e.message}`)
      console.error(e.stack);
    }
  }
}

const updateDB = async (category, csvData) => {
  console.log('Updating DB for category: ', category)
  let batch = db.batch()

  // parse from csv
  const updateData = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  });

  const collectionRef = db.collection('All');

  // iterate over each object and put into db as appropriate
  // TODO: refactor this to happen in parallel for each row
  for (const row of updateData) {
    const countryOrRegion = helpers.formatName(row['Country/Region'])
    const cityStateOrProvince = helpers.formatName(row['Province/State'])
    let cityStateOrProvinceId = countryOrRegion
    if (cityStateOrProvince) 
      cityStateOrProvinceId += `-${cityStateOrProvince}`
    let current = {};

    console.log('countryOrRegion: ' + countryOrRegion);
    console.log('cityStateOrProvince: ' + cityStateOrProvince);

    // Get the current document
    let docRef
    try {
      docRef = collectionRef.doc(cityStateOrProvinceId)
      const doc = await docRef.get()
      if (doc.exists) {
        console.log('doc exists: ', doc.data())
        current = doc.data()
      }
      console.log('got current: ', current)
    } catch (e) {
      console.error('Error getting document: ', e.message)
      console.error(e.stack)
      throw new Error(e.message)
    }

    // Setup the new document attrs to merge in
    const defaultDeltas = {
      confirmed: {},
      deaths: {},
      recovered: {}
    };
    const update = {
      countryOrRegion: countryOrRegion,
      stateOrProvince: cityStateOrProvince,
      lat: Math.round(row["Lat"] * 100) / 100,
      lon: Math.round(row["Long"] * 100) / 100,
      deltas: current.deltas || defaultDeltas
    };
    
    const { mostRecent, lastUpdated, newDeltas } = helpers.getStats(row);
    console.log('newDeltas for category: ', category, newDeltas)
    update.deltas[category] = newDeltas;
    update[category] = mostRecent;
    update.lastUpdated = lastUpdated;
    
    console.log('setting update for batch: ', update)
    batch.set(docRef, update, {merge: true}); // TODO: find in docs how merge works with batch write
  }

  // Perform the batch write
  try {
    console.log('attempting batch commit')
    batch.commit()
  } catch (e) {
    console.error('Error during write to db: ', e.message)
    console.error(e.stack)
    throw new Error(e.message)
  }
}