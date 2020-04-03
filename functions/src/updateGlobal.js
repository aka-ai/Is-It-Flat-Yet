const axios = require("axios");
const firebase = require("./firebase")
const { updateGlobalHelper } = require('./helpers/updateGlobalHelper')

module.exports = firebase.functions.pubsub
  .schedule("0 * * * *")
  .onRun(async context => {
    console.log("Started reportServiceGlobal with context: ", context);
    try {
      await run();
    } catch (e) {
      console.error(
        `reportServiceGlobal error during updateGlobal: ${e.message}`
      );
      console.error(e.stack);
    }
    console.log("Finished reportServiceGlobal successfully");
  });


const summaryCollectionRef = firebase.db.collection("Summary");
const historyCollectionRef = firebase.db.collection("History");

const CATEGORIES = {
  CONFIRMED: "confirmed",
  DEATHS: "deaths"
};

// get jhu data
// the two api calls to GitHub race,
// so we put the results in a temp map
// before converting to a list of entities
// TODO: refactor this back into two separate functions, one per api call
const run = async () => {
  const httpOptions = {};
  console.log("getting jhu data");
  const summaryTemp = {};
  const historyTemp = {};
  for (const category of Object.values(CATEGORIES)) {
    httpOptions.url = `https://raw.githubusercontent.com/CSSEGISandData/COVID-19/master/csse_covid_19_data/csse_covid_19_time_series/time_series_covid19_${category}_global.csv`;
    const githubResponse = await axios(httpOptions);
    if (githubResponse.status !== 200 || githubResponse.data === "") {
      console.error("Error or Empty response from Github!: ", githubResponse);
      throw new Error("Error calling GitHub API for JHU data");
    } else {
      const jhuData = githubResponse.data;
      await updateGlobalHelper(summaryTemp, historyTemp, category, jhuData);
    }
  }
  // Write temp data to db in the format we want it
  const countries = Object.values(summaryTemp);
  await summaryCollectionRef.doc("jhu").set({ countries: countries });

  console.log("Batch committing jhu data");
  const batch = firebase.db.batch();
  Object.values(historyTemp).forEach(entity => {
    const ref = historyCollectionRef.doc(entity.entityId);
    batch.set(ref, entity);
  });
  batch.commit();
}

