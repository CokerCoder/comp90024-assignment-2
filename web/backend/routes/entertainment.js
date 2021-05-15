const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var entertainment = [];
  var db = nano.use("entertainment");
  await db.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      entertainment.push(doc);
    });
  });
  res.send(entertainment);
});

module.exports = router;
