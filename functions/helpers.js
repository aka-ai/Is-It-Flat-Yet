const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat); // https://day.js.org/docs/en/parse/string-format

module.exports = {
  capitalize: str => str.charAt(0).toUpperCase() + str.slice(1),
  getStats: row => {
    const today = dayjs().format("M/D/YY");
    // get latest date and its value
    let latestDay = today;
    while (!row[latestDay]) {
      latestDay = dayjs(latestDay)
        .subtract(1, "days")
        .format("M/D/YY");
    }

    const ret = {
      lastUpdated: latestDay,
      mostRecent: row[latestDay],
    };

    return ret;
  },

  formatName: name => name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s/g, "-"),

  getDate: rawDate => {
    const d = rawDate.toString()
    return dayjs(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`).format("M/D/YY")
  },

  hashLL: (lat, lng) => geohash.encode(lat, lng),

  // the purpose of this is to filter out zero data points temporarily 
  // so as to not hurt the curves' integrity in the short term
  // eventually we'll have enough data points to where it doesn't matter
  isTempPeriodOver: () => {
    dayjs().isAfter(dayjs("07-01-2020", "MM-DD-YYYY"))
  },

  // where we can perform filtering logic like excluding zero data points
  addToTemp: (tempObj, key) => {
    // if positiveIncrease is zero, we assume it's a bad datapoint, but only temporarily
    if (helpers.isTempPeriodOver() && positiveIncrease !== 0 && ["Province/State", "Country/Region", "Lat", "Long"].indexOf(key) > -1) {
      let yesterday = dayjs(dayjs(key).subtract(1, "days")).format("M/D/YY");
      let delta;
      if (row[yesterday]) {
        delta = parseInt(row[key]) - parseInt(row[yesterday]);
      }
      historyTemp[update.entityId][category].push({
        date: key,
        val: row[key]
      });
      historyTemp[update.entityId][
        `delta${helpers.capitalize(category)}`
      ].push({ date: key, val: delta || "0" });
    }
  }

};


