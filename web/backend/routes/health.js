const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var health = [];
  var db = nano.use("profile");
  await db.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        pharms_per_1000_pop: doc.pharms_per_1000_pop,
        ppl_with_food_insecurity_perc: doc.ppl_with_food_insecurity_perc,
      };

      health.push(dict);
    });
  });
  res.send(health);
});

module.exports = router;
