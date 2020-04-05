const helpers = require("./utils");
const { statesLatLng } = require("./constants");

const firebase = require("../firebase");
const historyCollection = firebase.db.collection("History");

module.exports.updateUSHistory = rawData => {
  const ctpTemp = {};
  for (const row of rawData) {
    const date = helpers.getDate(row["date"]);
    const { state, positive } = row;
    // if positive is zero, we assume it's a bad datapoint and skip it
    // we can revert later when there is a lot of data
    if (positive) {
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
        latestConfirmed: 0,
        latestDeaths: 0,
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
        if (row[attr]) update[attrMap[attr]].push({
          date,
          val: row[attr]
        });
      }
      if (row.positive > update.latestConfirmed) update.latestConfirmed = row.positive
      if (row.death > update.latestDeaths) update.latestDeaths = row.death;

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