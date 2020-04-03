const helpers = require("./utils");
const { statesLatLng } = require("./constants");

const firebase = require("../firebase");
const historyCollection = firebase.db.collection("History");

module.exports.updateUSHistory = rawData => {
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