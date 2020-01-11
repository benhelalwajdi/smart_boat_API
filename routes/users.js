var express = require('express');
var mysql = require('mysql');
var bcrypt = require('bcrypt-nodejs');
var multer = require('multer');

var router = express.Router();
/* GET users listing. */
router.get('/', function (req, res, next) {
    res.json({user: 'True'});
});


//upload pic to the server ^-^
var storage = multer.diskStorage({
    destination: (req, file, cb) => {
        cb(null, 'public/profilePic')
    },
    filename: (req, file, cb) => {
        cb(null, file.fieldname + '-' + Date.now() + '.' + file.originalname)
    }
});
var upload = multer({storage: storage});
module.exports = upload;
router.post('/image', upload.single('image'), (req, res) => {
    console.log(req.file.filename);
    let id = req.body.id;
    const queryString = "SELECT * FROM users WHERE id = ?";
    getConnection().query(queryString, [id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500);
        }else{
            const queryString =
                "update users set " +
                "pictures = ?" +
                "where id = ?";
            getConnection().query(
                queryString,
                [req.file.filename, req.body.id],
                (err, results, fields) => {
                    if (err) {
                        console.log("Failed to update users: " + err);
                        res.json({status: false, error: err});
                    }
                    console.log("update a Users with id :" + req.body.id);
                    res.json({status: true});
                })
        }
    });

});



//create account
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

//change password
router.post('/change_password', (req, res) => {
    var bool;
    let newpassword = bcrypt.hashSync(req.body.password, bcrypt.genSaltSync(10));
    let id = req.body.id;
    let oldpassword = req.body.oldpassword;

    //get the user with id
    //compare old password with the password in database
    const queryString = "SELECT * FROM users WHERE id = ?";
    getConnection().query(queryString, [id], (err, rows, fields) => {
        if (err) {
            console.log("Failed to query for users: " + err);
            res.sendStatus(500);
            return
        }
        console.log("User fetched successfully");
        rows.map((row) => {
            console.log(row.password);
            if (bcrypt.compareSync(oldpassword, row.password)) {
                console.log("Password Match ! ");
                bool = true;
            } else {
                console.log("Wrong Password ! ");
                bool = false;
            }
        });
        if (bool) {
            //change the password
            const queryString = "update users set password = ? where id = ?";
            getConnection().query(queryString, [newpassword, req.body.id], (err, results, fields) => {
                if (err) {
                    console.log("Failed to user users: " + err);
                    res.json({status: false, error: err});
                }
                console.log("update a user with id :" + req.body.id);
                res.json({status: true});
            });
        } else {
            res.json({user: null});
        }
    });
});

//Update account data  => name, lastname, phonenumber, adress
router.post('/update', (req, res) => {
    /*TODO*/
    console.log(
        "Users with" +
        "   name : " + req.body.name +
        " , lastname : " + req.body.lastname +
        " , phonenumber : " + req.body.phonenumber +
        " , adress :" + req.body.adress +
        " , id :" + req.body.id
    );
    const queryString =
        "update users set " +
        "name = ? , " +
        "lastname = ? , " +
        "adress = ? , " +
        "phonenumber = ? " +
        "where id = ?";
    getConnection().query(
        queryString,
        [req.body.name, req.body.lastname, req.body.adress, req.body.phonenumber, req.body.id],
        (err, results, fields) => {
            if (err) {
                console.log("Failed to update store: " + err);
                res.json({status: false, error: err});
            }
            console.log("update a Users with id :" + req.body.id);
            res.json({status: true});
        })
});

//login and get account data
router.get('/login/:mail/:passwordd', (req, res) => {
    var bool;
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


//get all of users in the data base
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
