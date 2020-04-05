const axios = require("axios");
const firebase = require("./firebase");
const {updateUSSummary} = require("./helpers/updateUSSummary");
const {updateUSHistory} = require("./helpers/updateUSHistory");

console.log('loaded updateUS')
module.exports = firebase.functions.pubsub
  .schedule("0 * * * *")
  .onRun(async context => {
    console.log("Started reportServiceUS with context: ", context);
    try {
      await run();
    } catch (e) {
      console.error(`reportServiceUS error during updateUS: ${e.message}`);
      console.error(e.stack);
    }
    console.log("Finished reportServiceUS successfully");
  });


const run = async () => {
  const httpOptions = {};
  // get ctp summary data for US States
  console.log("getting ctp data");
  httpOptions.url = "https://covidtracking.com/api/states";
  const ctpResponse = await axios(httpOptions);

  if (ctpResponse.status !== 200 || ctpResponse.data === "") {
    console.error("Error or Empty response from Github!: ", ctpResponse);
    throw new Error("Error calling CovidTracking API");
  } else {
    await updateUSSummary(ctpResponse.data);
  }

  //get ctp history data for US States
  httpOptions.url = "https://covidtracking.com/api/v1/states/daily.json";
  const covidTrackingResponse = await axios(httpOptions);

  if (
    covidTrackingResponse.status !== 200 ||
    covidTrackingResponse.data === ""
  ) {
    console.error(
      "Error or Empty response from CovidTracking!: ",
      covidTrackingResponse
    );
    throw new Error("Error calling CovidTracking API");
  } else {
    await updateUSHistory(covidTrackingResponse.data);
  }
}