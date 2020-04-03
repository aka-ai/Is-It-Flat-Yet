// reportService calls CSSE data from GitHub every hour and updates our database with updated statistics
exports.reportServiceGlobal = require('./src/updateGlobal')

exports.reportServiceUS = require('./src/updateUS')
