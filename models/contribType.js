const mongoose = require("mongoose");

const contribDataSchema = new mongoose.Schema({
  name: String,
  description: String,
  unit: String
});

const contribTypeModel = mongoose.model("contribtypes", contribDataSchema);

module.exports = contribTypeModel;
