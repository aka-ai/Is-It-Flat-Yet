const dayjs = require('dayjs');
const customParseFormat = require("dayjs/plugin/customParseFormat");
dayjs.extend(customParseFormat); // https://day.js.org/docs/en/parse/string-format
const { statesLookup } = require("./constants");

const formatName = name =>
  name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s/g, "-");

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
      mostRecent: row[latestDay]
    };

    return ret;
  },

  getDate: rawDate => {
    const d = rawDate.toString();
    return dayjs(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`).format(
      "M/D/YY"
    );
  },

  hashLL: (lat, lng) => geohash.encode(lat, lng),

  // the purpose of this is to filter out zero data points temporarily
  // so as to not hurt the curves' integrity in the short term
  // eventually we'll have enough data points to where it doesn't matter
  isTempPeriodOver: () => {
    dayjs().isAfter(dayjs("07-01-2020", "MM-DD-YYYY"));
  },

  getEntityId: (stateOrProvince, countryOrRegion) => {
    let entityId = formatName(countryOrRegion);
    if (stateOrProvince) {
      // standardize US state names to long version
      if (countryOrRegion === 'US' && stateOrProvince.length === 2) {
        stateOrProvince = statesLookup[stateOrProvince]
      }
      entityId += `-${formatName(stateOrProvince)}`;
    }
    return entityId;
  },

  getDisplayName: (stateOrProvince, countryOrRegion) => {
    if (stateOrProvince) {
      if (countryOrRegion === 'US' && stateOrProvince.length === 2) {
        stateOrProvince = statesLookup[stateOrProvince];
      }
      return `${stateOrProvince}, ${countryOrRegion}`;
    } else {
      return countryOrRegion;
    }
  }
};


