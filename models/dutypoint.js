const mongoose = require("mongoose");

const DutyPointSchema = mongoose.Schema({
  dutypoint: {
    type: String,
    require: true,
  },
  latitude: {
    type: Number,
    require: true,
  },
  longitude: {
    type: Number,
    require: true,
  },
  station: {
    type: String,
    require: true,
  },
});

module.exports = mongoose.model("dutypoint", DutyPointSchema);
