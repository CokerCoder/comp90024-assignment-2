const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var shape = [];
  let id = req.query.id;
  var db = nano.use("statistic");
  await db.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      console.log(doc);
      shape.push(doc);
    });
  });
  res.send(shape);
});

module.exports = router;
