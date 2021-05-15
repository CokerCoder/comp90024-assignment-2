const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var distance = [];
  var bus = [];
  var db_distance = nano.use("profile");
  await db_distance.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        travel_time_to_melbourne_minutes: doc.travel_time_to_melbourne_minutes,
        distance_to_melbourne_km: doc.distance_to_melbourne_km,
      };

      distance.push(dict);
    });
  });

  var db_bus = nano.use("transports");
  await db_bus.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        transports_bus: doc.transports_bus,
        transports_train: doc.transports_train,
        transports_tram: doc.transports_tram,
        transports_sky_bus: doc.transports_sky_bus,
        transports_night_bus: doc.transports_night_bus,
      };

      bus.push(dict);
    });
  });

  var bus_ref = bus.reduce(function (obj, o) {
    obj[o.id] = o;
    return obj;
  }, {});

  var transport = distance.map(function (o) {
    return {
      id: o.id,
      travel_time_to_melbourne_minutes: o.travel_time_to_melbourne_minutes,
      distance_to_melbourne_km: o.distance_to_melbourne_km,
      transports_bus: bus_ref[o.id].transports_bus,
      transports_train: bus_ref[o.id].transports_train,
      transports_tram: bus_ref[o.id].transports_tram,
      transports_sky_bus: bus_ref[o.id].transports_sky_bus,
      transports_night_bus: bus_ref[o.id].transports_night_bus,
    };
  });
  res.send(transport);
});

module.exports = router;
