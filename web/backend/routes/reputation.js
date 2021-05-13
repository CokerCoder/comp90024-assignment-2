const express = require("express");
const router = express.Router();

ip = "http://admin:admin@172.26.132.83:5984";

const nano = require("nano")(ip);

router.get("/", async function (req, res, next) {
  var reputation = [];
  var db = nano.use("profile");
  await db.list({ include_docs: true }).then((body) => {
    body.rows.forEach((doc) => {
      doc = doc.doc;
      let dict = {
        id: doc._id,
        clients_that_recvd_alchl_drug_trtmnt_servs_per_1000_pop:
          doc.clients_that_recvd_alchl_drug_trtmnt_servs_per_1000_pop,
        ppl_rated_their_cmty_good_vgood_for_cmty_and_sup_grps_perc:
          doc.ppl_rated_their_cmty_good_vgood_for_cmty_and_sup_grps_perc,
        homeless_ppl_est_per_1000_pop: doc.homeless_ppl_est_per_1000_pop,
      };

      reputation.push(dict);
    });
  });
  res.send(reputation);
});

module.exports = router;
