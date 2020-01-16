var express = require("express");
var mysql = require('mysql');
var multer = require('multer');


var router = express.Router();


/* GET boats listing. */
router.get('/', function (req, res, next) {
    res.json({boats: 'True'});
});

router.get('/allboats', function (req, res, next) {
    const queryString = "SELECT * FROM boat";
    getConnection().query(queryString, req.params.id, (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for boats: " + err);
            res.sendStatus(500);
            return;
        }
        console.log("boats fetched successfully");
        rows.map((row) => {
            console.log(rows);
            res.json(rows);
        });
    });
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
