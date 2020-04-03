const helpers = require("./utils");
const {
  statesLatLng,
  statesAndPopulation,
  statesLookup
} = require("./constants");

const firebase = require("../firebase");
const summaryCollection = firebase.db.collection("Summary");

module.exports.updateUSSummary = async (data) => {
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
