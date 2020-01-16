var express = require("express");
var mysql = require('mysql');
var multer = require('multer');


var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({user: 'True'});
});

var pool = mysql.createPool({
    host: '127.0.0.1',
    user: 'root',
    password: 'root',
    database: 'smartboat',
    port: '8889',
    connectionLimit: 10
});


function getConnection() {
    return pool;
}

module.exports = router;
