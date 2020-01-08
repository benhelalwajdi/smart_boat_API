var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({user: 'respond with a resource'});
});

router.get('/Users', function (req, res, next) {
    const queryString = "SELECT * FROM users";
    getConnection().query(queryString, req.params.id, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500);
            return;
        }
        console.log("Users fetched successfully");
        rows.map((row) => {
            res.json(rows[0]);
        });
    });
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
