
//boilerplate
const express = require("express");
const mongo = require("mongodb");
const mustacheExpress = require("mustache-express");
const path = require("path");
const logger = require("morgan")
const MongoClient = mongo.MongoClient;
const dbUrl = "mongodb://localhost:27017/mongoRobots";
const ObjectId = mongo.ObjectID

const app = express();
// let data = require("./data");

let DB;
let Robots;

const port = process.env.PORT || 8009;

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.use(express.static('public'));
app.set('view engine', 'mustache')
app.use(logger("dev"));
app.use(express.static(path.join(__dirname, "./public")));

//endpoint creation

MongoClient.connect(dbUrl, function (err, db) {
    if (err) {
        return console.log("Error connecting to db", err);
    }
    DB = db
    Robots = db.collection("robots");
});


app.get("/insertMany", function (req, res) {
    MongoClient.connect(dbUrl, function (err, db) {
        if (err) {
            res.status(500).send(err);
        }
        let Robots = db.collection("robots");
        Robots.insertMany(data.users, function (err, savedRobots) {
            if (err) {
                res.status(500).send(err);
            }
            res.send(savedRobots);
            db.close();
        });
    });
});




app.get("/", (req, res) => {
    Robots.find({}).toArray(function (err, foundRobots) {
        if (err) res.status(500).send(err);
        res.render("index", { users: foundRobots });

    });
});

app.get("/:_id", (req, res) => {
    Robots.findOne({ _id: ObjectId(req.params._id) }, function (err, foundRobot) {
        if (err) {
            return res.status(500).send(err);
        } else if (!foundRobot) {
            return res.send("No user found");
        }
        return res.render("profile", { user: foundRobot });
    });
});

app.get("/employed", (req, res) => {
    Robots.find({ job: { $ne: null } }).toArray(function (err, employedRobots) {
        if (err) res.status(500).send(err);
        res.render("index", { users: employedRobots });
    });
});

app.get("/unemployed", (req, res) => {
    Robots.find({ job: null }).toArray(function (err, unemployedRobots) {
        if (err) res.status(500).send(err);
        res.render("index", { users: unemployedRobots });
    });
});




// app.get("/", function (req, res) {
//     res.render("index", { users: data.users });

// });

// app.get("/:id", (req, res) => {
//     let userId = req.params.id;
//     let user = data.users.find(user => user.id === parseInt(userId));
//     res.render("profiles", user);

// });


//Listen to port
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});