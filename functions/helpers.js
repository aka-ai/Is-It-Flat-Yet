const dayjs = require('dayjs');

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


  // getNormalizedName: entity => {
  //   let concatName = formatName(entity.countryOrRegion)
  //   if (entity.cityStateOrProvince) {
  //     concatName += `-${formatName(entity.cityStateOrProvince)}`;
  //   }
  //   // Uncomment this if needed - e.g. US county names clash causing duplicate id's
  //   // cityStateOrProvinceId += `-${this.hashLL(parseFloat(row["Lat"]), parseFloat(row["Long"]))}`
  //   return formatName(concatName);
  // },

  getDate: rawDate => {
    const d = rawDate.toString()
    return dayjs(`${d.slice(0, 4)}-${d.slice(4, 6)}-${d.slice(6)}`).format("M/D/YY")
  },

  hashLL: (lat, lng) => geohash.encode(lat, lng)
};


