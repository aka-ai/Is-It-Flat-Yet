const axios = require("axios");

const helpers = require("./helpers");
const {
  statesLatLng,
  statesAndPopulation,
  statesLookup
} = require("./constants");

const firebase = require("./firebase");
const summaryCollection = firebase.db.collection("Summary");
const historyCollection = firebase.db.collection("History");

module.exports = {
  run: async () => {
    const httpOptions = {};
    // get ctp summary data for US States
    console.log("getting ctp data");
    httpOptions.url = "https://covidtracking.com/api/states";
    const ctpResponse = await axios(httpOptions);

    if (ctpResponse.status !== 200 || ctpResponse.data === "") {
      console.error("Error or Empty response from Github!: ", ctpResponse);
      throw new Error("Error calling CovidTracking API");
    } else {
      await updateUSSummaryData(ctpResponse.data);
    }

    //get ctp history data for US States
    httpOptions.url = "https://covidtracking.com/api/states/daily";
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
      await updateUSHistoryData(covidTrackingResponse.data);
    }
  }
}

const updateUSSummaryData = async data => {
  const gatheredData = [];
  data.forEach(st => {
    let obj = {};
    let {
      state,
      positive,
      negative,
      pending,
      hospitalized,
      death,
      totalTestResults
    } = st;
    const stateOrProvince = statesLookup[state];
    if (!pending) pending = "n/a";
    // if (!death) death = 0 - we want to skip empty data points
    if (!hospitalized) hospitalized = "n/a";
    if (!negative) negative = "n/a";

    obj["latestConfirmed"] = positive;
    obj["latestDeaths"] = death;
    obj["countryOrRegion"] = "US";
    obj["entityId"] = helpers.getEntityId(stateOrProvince, "US");
    obj["stateOrProvince"] = stateOrProvince;
    obj["displayName"] = `${stateOrProvince}` + ", US";
    obj["totalTestResults"] = totalTestResults;
    obj["pending"] = pending;
    obj["hospitalized"] = hospitalized;
    obj["negative"] = negative;
    obj["stateAbbreviation"] = state;
    obj["population"] = statesAndPopulation[state];
    obj["percapitaPercentage"] = (positive / statesAndPopulation[state]) * 100;
    obj["lat"] = statesLatLng[state][0];
    obj["lng"] = statesLatLng[state][1];

    gatheredData.push(obj);
  });

  console.log("writing ctp summary data");
  summaryCollection.doc("ctp").set({ states: gatheredData });
};

const updateUSHistoryData = rawData => {
  const ctpTemp = {};
  for (const row of rawData) {
    const date = helpers.getDate(row["date"]);
    const { state, positiveIncrease } = row;
    // if positiveIncrease is zero, we assume it's a bad datapoint and skip it, but only temporarily
    if (
      !helpers.isTempPeriodOver("07-01-2020", "MM-DD-YYYY") &&
      positiveIncrease
    ) {
      const countryOrRegion = "US";
      const stateOrProvince = state;
      const displayName = helpers.getDisplayName(
        stateOrProvince,
        countryOrRegion
      );
      const entityId = helpers.getEntityId(stateOrProvince, countryOrRegion);

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
      const attrMap = {
        positive: "confirmed",
        positiveIncrease: "deltaConfirmed",
        death: "deaths",
        deathIncrease: "deltaDeaths",
        hospitalizedIncrease: "deltaHospitalized",
        negativeIncrease: "deltaNegative",
        totalTestResultsIncrease: "deltaTotalTestResults",
        negative: "negative",
        hospitalized: "hospitalized",
        totalTestResults: "totalTestResults",
        fips: "fips"
      };
      // push if there's a value
      for (let attr in attrMap) {
        if (row[attr]) update[attrMap[attr]].push({ [date]: row[attr] });
      }

      ctpTemp[entityId] = update;
    }
  }

  console.log("Batch writing ctp history data");
  const batch = firebase.db.batch();
  Object.values(ctpTemp).forEach(entity => {
    const ref = historyCollection.doc(entity.entityId);
    batch.set(ref, entity);
  });
  batch.commit();
};
