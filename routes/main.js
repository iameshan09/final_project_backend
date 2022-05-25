const express = require("express");
const DutyPoint = require("../models/dutypoint");
const Road = require("../models/road");
const router = express.Router();
const mongoose = require("mongoose");
const { status } = require("express/lib/response");

// GET Duty Points within a 400m near to the current location
router.get("/nearestDutyPoints/:lat/:lng", async (req, res) => {
  let distanceArray = [];

  try {
    // RETRIVE ALL Duty points
    let dutyPoints = await DutyPoint.find();
    dutyPoints.forEach((dutyPoint) => {
      let dis = distance(
        req.params.lat,
        req.params.lng,
        dutyPoint.latitude,
        dutyPoint.longitude
      );
      if (400 >= dis) {
        let distanceObject = {
          value: dutyPoint._id,
          label: dutyPoint.dutypoint,
          distance: dis,
        };
        distanceArray.push(distanceObject);
      }
    });

    console.log(distanceArray);

    // SEND RESPONSE TO CLIENT
    res.status(200).send(distanceArray);
  } catch (ex) {
    // IF CATCH ANY ERROR DURING THE PROCESS
    return res.status(500).send("Error", ex.message);
  }
});

function distance(lat1, lon1, lat2, lon2) {
  // haversine great circle distance approximation, returns meters
  theta = lon1 - lon2;
  dist =
    Math.sin(deg2rad(lat1)) * Math.sin(deg2rad(lat2)) +
    Math.cos(deg2rad(lat1)) *
      Math.cos(deg2rad(lat2)) *
      Math.cos(deg2rad(theta));
  dist = Math.acos(dist);
  dist = rad2deg(dist);
  dist = dist * 60; // 60 nautical miles per degree of seperation
  dist = dist * 1852; // 1852 meters per nautical mile
  return dist;
}

function deg2rad(deg) {
  return (deg * Math.PI) / 180.0;
}
function rad2deg(rad) {
  return (rad * 180.0) / Math.PI;
}

router.get("/nearestDutyPoints", async (req, res) => {
  let distanceArray = [];

  try {
    // RETRIVE ALL Duty points
    let dutyPoints = await DutyPoint.find();

    // SEND RESPONSE TO CLIENT
    res.status(200).send(dutyPoints);
  } catch (ex) {
    // IF CATCH ANY ERROR DURING THE PROCESS
    return res.status(500).send("Error", ex.message);
  }
});

router.get("/getRoads/:index/:roadId", async (req, res) => {
  try {
    // RETRIVE ALL Duty points
    let roads = await Road.find();

    let roads2 = await Road.find({
      day: req.params.index,
      road_id: req.params.roadId,
    });

    let itemsArray = createRoadItemsArray(roads);
    let dataArray = await createDataArray(roads2);

    // SEND RESPONSE TO CLIENT
    res.status(200).send({ items: itemsArray, data: dataArray });
  } catch (ex) {
    // IF CATCH ANY ERROR DURING THE PROCESS
    return res.status(500).send(ex.message);
  }
});

router.get("/getTimeFramesAndRoads/:index/:value", async (req, res) => {
  try {
    // RETRIVE Data
    let roads = await Road.find();

    let roads2 = await Road.find({
      day: req.params.index,
      road_id: req.params.value,
    });

    let roads3 = await Road.aggregate([
      { $match: { day: Number(req.params.index) } },
      {
        $group: {
          _id: "$road_id",
          key: { $last: "$road_id" },
          first_column: { $first: "$road" },
          duration_in_traffic: {
            $avg: "$time_frame" + req.params.value + ".duration_in_traffic",
          },
        },
      },
    ]);

    let roadItemsArray = createRoadItemsArray(roads);
    let dataArray = await createDataArray(roads2);
    let timeFramesArray = createTimeFramesArray(dataArray);
    let roadsArray = sortRoadsArray(roads3);

    console.log(roadsArray);
    // SEND RESPONSE TO CLIENT
    res.status(200).send({
      roads: roadItemsArray,
      roadsData: roadsArray,
      framesData: timeFramesArray,
    });
  } catch (ex) {
    // IF CATCH ANY ERROR DURING THE PROCESS
    return res.status(500).send(ex.message);
  }
});

function createRoadItemsArray(results) {
  let itemsArray = [];
  results.forEach((result) => {
    let resultObject = {
      value: result.road_id,
      label: result.road,
    };
    itemsArray.push(resultObject);
  });

  return (itemsArray = Array.from(
    itemsArray.reduce((map, obj) => map.set(obj.value, obj), new Map()).values()
  ));
}

async function createDataArray(results) {
  //timeframes array
  let dataArray = [];
  let dit1 = 0;
  let dit2 = 0;
  let dit3 = 0;
  let dit4 = 0;
  let dit5 = 0;
  let dit6 = 0;
  let dit7 = 0;
  let dit8 = 0;
  let dit9 = 0;
  let dit10 = 0;
  let dit11 = 0;
  let dit12 = 0;
  let nor = 0;

  await results.forEach((result, i) => {
    dit1 += result.time_frame1.duration_in_traffic;
    dit2 += result.time_frame2.duration_in_traffic;
    dit3 += result.time_frame3.duration_in_traffic;
    dit4 += result.time_frame4.duration_in_traffic;
    dit5 += result.time_frame5.duration_in_traffic;
    dit6 += result.time_frame6.duration_in_traffic;
    dit7 += result.time_frame7.duration_in_traffic;
    dit8 += result.time_frame8.duration_in_traffic;
    dit9 += result.time_frame9.duration_in_traffic;
    dit10 += result.time_frame10.duration_in_traffic;
    dit11 += result.time_frame11.duration_in_traffic;
    dit12 += result.time_frame12.duration_in_traffic;

    nor = ++i;
  });
  dataArray.push(
    dit1 / nor,
    dit2 / nor,
    dit3 / nor,
    dit4 / nor,
    dit5 / nor,
    dit6 / nor,
    dit7 / nor,
    dit8 / nor,
    dit9 / nor,
    dit10 / nor,
    dit11 / nor,
    dit12 / nor
  );

  return dataArray;
}

function createTimeFramesArray(results) {
  let timeFramesArray = [];
  const timeFramesNameArray = [
    "6:00 AM - 6:15 AM",
    "6:15 AM - 6:30 AM",
    "6:30 AM - 6:45 AM",
    "6:45 AM - 7:00 AM",
    "7:00 AM - 7:15 AM",
    "7:15 AM - 7:30 AM",
    "7:30 AM - 7:45 AM",
    "7:45 AM - 8:00 AM",
    "8:00 AM - 8:15 AM",
    "8:15 AM - 8:30 AM",
    "8:30 AM - 8:45 AM",
    "8:45 AM - 9:00 AM",
  ];
  results.forEach((result, index) => {
    let resultObject = {
      key: index + 1,
      first_column: timeFramesNameArray[index],
      duration_in_traffic: result,
    };
    timeFramesArray.push(resultObject);
  });

  return timeFramesArray;
}

function sortRoadsArray(results) {
  const roadsArray = results.sort((a, b) => a._id - b._id);
  return roadsArray;
}

router.get("/getDay", async (req, res) => {
  try {
    // RETRIVE ALL Duty points
    const cd = new Date();
    const day = cd.getDay();

    // SEND RESPONSE TO CLIENT
    res.status(200).send("fuck");
  } catch (ex) {
    // IF CATCH ANY ERROR DURING THE PROCESS
    return res.status(500).send("Error", ex.message);
  }
});
module.exports = router;
