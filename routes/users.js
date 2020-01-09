var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');

var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({user: 'True'});
});

router.post('/register', (req, res) => {
    let password = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    const queryString = "INSERT INTO users (name, lastname, email, password, phonenumber, adress, username) VALUES (?,?,?,?,?,?,?)";
    getConnection().query(queryString,
        [req.body.name, req.body.lastname, req.body.email, password, req.body.phonenumber, req.body.adress, req.body.username],
        (err, results) => {
            if (err) {
                console.log("Failed to insert new client: " + err);
                res.json({status: false, error: err});
            }
            console.log("Inserted a new client with id :" + results.insertId);
            res.json({status: true});
        });
});


router.get('/login/:mail/:passwordd', (req, res) => {
    var bool
    console.log("Trying to login with EMAIL:" + req.params.mail + " PASSWORD:" + req.params.passwordd);
    const queryString = "SELECT * FROM users WHERE email = ?";
    const userMail = req.params.mail;
    getConnection().query(queryString, [userMail], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500);
            return
        }
        console.log("User fetched successfully");
        rows.map((row) => {
            console.log(row.password);
            if (bcrypt.compareSync(req.params.passwordd, row.password)) {
                console.log("Password MATCH !");
                bool = true;
            } else {
                console.log(" WRONG Password !");
                bool = false;
            }
        });
        if (bool) {
            res.json(rows[0]);
        } else {
            res.json({user: null});
        }
    });
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
    password: 'root',
    database: 'smartboat',
    port: '8889',
    connectionLimit: 10
});


function getConnection() {
    return pool;
}

module.exports = router;
