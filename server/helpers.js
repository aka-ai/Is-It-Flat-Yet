const dayjs = require('dayjs');

const DELTA_PERIODS = {
  threeDay: 3,
  sevenDay: 7,
  thirtyDay: 30
};

module.exports = {
  getStats: row => {
    const today = dayjs().format("M/D/YY");
    // get latest date and its value
    let latestDay = today;
    while (!!!row[latestDay]) {
      latestDay = dayjs(latestDay)
        .subtract(1, "days")
        .format("M/D/YY");
    }

    const ret = {
      lastUpdated: latestDay,
      mostRecent: row[latestDay],
      newDeltas: {}
    };

    // calculate deltas
    for (const [k, v] of Object.entries(DELTA_PERIODS)) {
      const targetDay = dayjs(latestDay)
        .subtract(v, "days")
        .format("M/D/YY");
      const targetVal = parseInt(row[targetDay]);
      const latestDayVal = parseInt(row[latestDay]);
      const divisor = targetVal === 0 ? 1 : targetVal;
      const delta = (latestDayVal - targetVal) / divisor;
      ret.newDeltas[k] = Math.round(delta * 10000) / 100;
    }
    return ret;
  },

  formatName: name =>
    name
      .toLowerCase()
      .trim()
      .replace(/[^\w\s]/g, '')
      .replace(/\s/g, '-')
};


