const axios = require('axios')
const parse = require('csv-parse/lib/sync')
const admin = require('firebase-admin')
const functions = require('firebase-functions')

const helpers = require('./helpers')

admin.initializeApp(functions.config().firebase)
const db = admin.firestore()

const CATEGORIES = {
  confirmed: 'Confirmed',
  deaths: 'Deaths',
  recovered: 'Recovered'
}

// reportService calls CSSE data from GitHub every hour and updates our database with updated statistics
exports.reportService = async (req, res) => {
  console.log('Started reportService')
  try {
    for (const category of Object.values(CATEGORIES)) {
      await fetchDataAndUpdateDB(category);
    }
    console.log("Finished reportService");
    res.sendStatus(200);
  } catch (e) {
    res.sendStatus(500, 'reportService internal error')
    console.error(`reportService error: ${e.message}`);
    console.error(e.stack)
  }
};

const fetchDataAndUpdateDB = async (category) => {
  console.log('calling fetch from github with category: ', category)
  const options = {
    url:
      'https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/' +
      `csse_covid_19_data/csse_covid_19_time_series/time_series_19-covid-${category}.csv`
  }

  let githubResponse = ''
  try {
    githubResponse = await axios(options)
  } catch (e) {
    console.error(`error during api call: ${e.message}`)
    console.error(e.stack)
  }

  if (githubResponse.status !== 200 || githubResponse.data === '') {
    console.error('Error or Empty response from Github!: ', githubResponse);
  } else {
    const data = githubResponse.data
    try {
      await updateDB(category, data)
    } catch (e) {
      console.error(`error while updating DB: ${e.message}`)
      console.error(e.stack)
    }
  }
}

const updateDB = async (category, csvData) => {
  category = category.toLowerCase()
  console.log('Updating DB for category: ', category)
  let batch = db.batch()

  // parse from csv
  const updateData = parse(csvData, {
    columns: true,
    skip_empty_lines: true
  })

  const collectionRef = db.collection('All')

  // iterate over each object and put into db as appropriate
  // if writes need to be optimized later, we can refactor this to happen in parallel for each row
  for (const row of updateData) {
    const countryOrRegion = helpers.formatName(row['Country/Region'])
    const cityStateOrProvince = helpers.formatName(row['Province/State'])
    let cityStateOrProvinceId = countryOrRegion
    if (cityStateOrProvince) 
      cityStateOrProvinceId += `-${cityStateOrProvince}`

    // Setup the new document attrs to merge in
    const defaultDeltas = {
      confirmed: {},
      deaths: {},
      recovered: {}
    }
    const update = {
      countryOrRegion: countryOrRegion,
      stateOrProvince: cityStateOrProvince,
      lat: Math.round(row["Lat"] * 100) / 100,
      lon: Math.round(row["Long"] * 100) / 100,
      deltas: defaultDeltas
    }
    
    const { mostRecent, lastUpdated, newDeltas } = helpers.getStats(row)
    update.deltas[category] = newDeltas
    update[category] = mostRecent
    update.lastUpdated = lastUpdated
    
    docRef = collectionRef.doc(cityStateOrProvinceId)
    batch.set(docRef, update, {merge: true})
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