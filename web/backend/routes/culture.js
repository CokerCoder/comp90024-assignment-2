const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var culture = [];
  var db = nano.use("profile");
  await db.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        ppl_who_speak_a_lang_other_english_at_home_perc:
          doc.ppl_who_speak_a_lang_other_english_at_home_perc,
        ppl_born_overseas_perc: doc.ppl_born_overseas_perc,
      };

      culture.push(dict);
    });
  });
  res.send(culture);
});

module.exports = router;
