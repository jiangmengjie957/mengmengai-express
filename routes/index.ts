var express = require('express');
var router = express.Router();
const userController = require('../controllers/user');
/* GET home page. */
router.get('/', function(req: any, res: any, next: any) {
  res.render('index', { title: 'Express1' });
});

router.get('/get_user', userController.showUser)

module.exports = router;
