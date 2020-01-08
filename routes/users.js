var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();
/* GET users listing. */
router.get('/', function(req, res, next) {
  res.json({user:'respond with a resource'});
});

router.get('/login', function (req, res, next) {
  res.json({user:'login'})

});


router.post('/register', (req, res) => {
  let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
  console.log(password);
});

var pool = mysql.createPool({
  host: '127.0.0.1',
  user: 'root',
  password: '',
  database: 'smartboat',
  port: '8889',
  connectionLimit: 10
});


function getConnection() {
  return pool;
}

module.exports = router;
