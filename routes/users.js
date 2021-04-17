var express = require('express');
var router = express.Router();

/* GET users listing. */
router.get('/', (req, res) => {
  const customers = [
    {id: 1, firstName: "Yunfei", lastName: "Jing", studentID: 987784}
  ]
  res.json(customers);
});

module.exports = router;
