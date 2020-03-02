const dayjs = require('dayjs');

const DELTA_PERIODS = {
  threeDay: 3,
  sevenDay: 7,
  thirtyDay: 30
};

const getLatest = datum => {

}

module.exports = {
  getStats: datum => {
    const today = dayjs().format('M/D/YY');
    // get latest date and its value
    let latestDay = today
    while (!!!datum[latestDay]) {
      latestDay = dayjs(latestDay).subtract(1, 'days').format('M/D/YY')
    }
    // let max = 0;
    // Object.values(datum).forEach(val => {
    //   if (parseInt(val) === NaN) return 0;
    //   else max = val > max ? val : max;
    // });

    const ret = {
      lastUpdated: latestDay,
      mostRecent: datum[latestDay],
      newDeltas: {}
    };

    for (const [k, v] of Object.entries(DELTA_PERIODS)) {
      const targetDay = dayjs(latestDay).subtract(v, 'days').format('M/D/YY')
      const targetVal = parseInt(datum[targetDay]) === 0 ? 1 : parseInt(datum[targetDay])
      const latestDayVal = parseInt(datum[latestDay])
      const delta = (latestDayVal - targetVal) / targetVal;
      ret.newDeltas[k] = Math.round(delta * 10000) / 100;
    }
    return ret;
  },
  formatName: name => name
                      .toLowerCase()
                      .trim()
                      // .replace(/[\W_]/, '')
                      .replace(/\s/g, '-')
                      // .trim()
}


