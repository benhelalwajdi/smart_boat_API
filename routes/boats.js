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

// add new boats on data base :

router.post('/addBoats', function (req, res, next){
  const queryString = "INSERT INTO boat (price, year, type, class, length, fuel_type, hull_material) VALUES (?,?,?,?,?,?,?)";
    getConnection().query(queryString,
        [req.body.price, req.body.year, req.body.type, req.body.class, req.body.length, req.body.fuel_type, req.body.hull_material],
        (err, results) => {
            if (err) {
                console.log("Failed to add new boat: " + err);
                res.json({status: false, error: err});
            }
            console.log("Inserted a new boat with id: " + results.insertId);
            res.json({status: true});
        });
});

// get boat with id
router.get('/:id', (req, res) => {
    const queryString = "SELECT * FROM boat WHERE id = ?";
    getConnection(queryString, [req.params.id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for boat by ID" + err);
            res.json({status: false, error: err});
        }
        console.log("Boat fetched by ID successfully");
        res.json(rows[0])
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
