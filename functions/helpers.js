const dayjs = require('dayjs');

const formatName = name => name
    .toLowerCase()
    .trim()
    .replace(/[^\w\s]/g, "")
    .replace(/\s/g, "-");


module.exports = {
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

  getNormalizedName: entity => {
    let concatName = entity.countryOrRegion
    if (entity.cityStateOrProvince) {
      concatName += `-${entity.cityStateOrProvince}`;
    } 
    return formatName(concatName);
  }
};


