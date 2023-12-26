const mongoose = require("mongoose");

const contribDataSchema = new mongoose.Schema({
  name: String,
  description: String,
  unit: String
});

const contribTypesModel = mongoose.model("contribtypes", contribDataSchema);

module.exports = contribTypesModel;
