const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var transport = [];
  var db = nano.use("profile");
  await db.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        travel_time_to_melbourne_minutes: doc.travel_time_to_melbourne_minutes,
        distance_to_melbourne_km: doc.distance_to_melbourne_km,
      };

      transport.push(dict);
    });
  });
  res.send(transport);
});

module.exports = router;
