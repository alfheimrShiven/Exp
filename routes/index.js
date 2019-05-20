var express = require('express');
var router = express.Router();

/* GET home page. */
router.get('/', function(req, res, next) {
  res.render('index');
});

router.get('/getsample', (req,res,next)=>{
  res.send("Hy from getsample");
});
module.exports = router;
