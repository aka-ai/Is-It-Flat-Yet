const firebase = require("./firebase");
const updateGlobal = require("./updateGlobal");
const updateUS = require("./updateUS");

// reportService calls CSSE data from GitHub every hour and updates our database with updated statistics
exports.reportService = firebase.functions.pubsub
  .schedule("0 * * * *")
  .onRun(async context => {
    console.log("Started reportService with context: ", context);
    try {
      await updateGlobal.run();
    } catch (e) {
      console.error(`reportService error during updateGlobal: ${e.message}`);
      console.error(e.stack);
    }

    try {
      await updateUS.run();
    } catch (e) {
      console.error(`reportService error during updateUS: ${e.message}`);
      console.error(e.stack);
    }
    console.log("Finished reportService successfully");
  });
