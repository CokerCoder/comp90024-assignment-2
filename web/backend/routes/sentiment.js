const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var stats = [];
  var db = nano.use("statistic");
  await db.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        count: doc.count,
        average: doc.average,
      };
      stats.push(dict);
    });
  });
  res.send(stats);
});

module.exports = router;
