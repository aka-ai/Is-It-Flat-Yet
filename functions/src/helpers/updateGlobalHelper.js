const parse = require("csv-parse/lib/sync");
const dayjs = require("dayjs");
const helpers = require("./utils");

module.exports.updateGlobalHelper = async (
  summaryTemp,
  historyTemp,
  category,
  jhuData
) => {
  console.log("Setting temp data for category: ", category);
  const updateData = parse(jhuData, {
    columns: true,
    skip_empty_lines: true
  });

  for (const row of updateData) {
    const countryOrRegion = row["Country/Region"];
    const stateOrProvince = row["Province/State"];
    const displayName = helpers.getDisplayName(
      stateOrProvince,
      countryOrRegion
    );
    const entityId = helpers.getEntityId(stateOrProvince, countryOrRegion);

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

    if (!historyTemp[entityId]) {
      historyTemp[entityId] = JSON.parse(JSON.stringify(update));
    } else {
      historyTemp[entityId] = Object.assign(
        historyTemp[entityId],
        JSON.parse(JSON.stringify(update))
      );
    }

    // Generate historical data and net new curves
    // eslint-disable-next-line no-loop-func
    Object.keys(row).map(date => {
      if (
        ["Province/State", "Country/Region", "Lat", "Long"].indexOf(date) === -1
      ) {
        let priorDay = dayjs(dayjs(date).subtract(1, "days")).format("M/D/YY");
        // JHU provides cumulative data so row[date] should always have a value,
        // but we check anyway to be safe, i.e. if they forget to put a value in
        // in which case we skip
        if (row[priorDay] && row[date]) {
          const delta = parseInt(row[date]) - parseInt(row[priorDay]);
          historyTemp[entityId][`delta${helpers.capitalize(category)}`].push({
            date: date,
            val: delta
          });
        }
        if (row[date]) {
          historyTemp[entityId][category].push({ date: date, val: row[date] });
        }
      }
    });

    if (!summaryTemp[entityId]) {
      summaryTemp[entityId] = JSON.parse(JSON.stringify(update));
    } else {
      summaryTemp[entityId] = Object.assign(
        summaryTemp[entityId],
        JSON.parse(JSON.stringify(update))
      );
    }
    // prep update for summary collection; we don't want all the fields
    // since it gets stuff into a single document
    // also it will also cause item size exceeded error if we don't
    const toDelete = ["confirmed", "deltaConfirmed", "deaths", "deltaDeaths"];
    toDelete.forEach(attr => {
      delete summaryTemp[entityId][attr];
    });
  }
  // We return nothing since we are directly mutating the temp objects being passed in
};
