const mongoose = require("mongoose");

const TimeFrameSchema = mongoose.Schema({
  time_frame: {
    type: String,
    require: true,
  },
  duration_in_traffic: {
    type: Number,
    require: true,
  },
});

const RoadSchema = mongoose.Schema({
  road_id: {
    type: Number,
    require: true,
  },
  road: {
    type: String,
    require: true,
  },
  time_frame1: TimeFrameSchema,
  time_frame2: TimeFrameSchema,
  time_frame3: TimeFrameSchema,
  time_frame4: TimeFrameSchema,
  time_frame5: TimeFrameSchema,
  time_frame6: TimeFrameSchema,
  time_frame7: TimeFrameSchema,
  time_frame8: TimeFrameSchema,
  time_frame9: TimeFrameSchema,
  time_frame10: TimeFrameSchema,
  time_frame11: TimeFrameSchema,
  time_frame12: TimeFrameSchema,
  day: {
    type: Number,
    require: true,
  },
});

module.exports = mongoose.model("road", RoadSchema);
