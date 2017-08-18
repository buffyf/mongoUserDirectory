
//boilerplate
const express = require("express");
const mustacheExpress = require("mustache-express");
const path = require("path");

const app = express();
let data = require("./data");

const port = process.env.PORT || 8001;

app.engine('mustache', mustacheExpress());
app.set('views', './views')
app.use(express.static('public'));
app.set('view engine', 'mustache')

//endpoint creation


app.get("/", function (req, res) {
    res.render("index", { users: data.users });

});

app.get("/:id", (req, res) => {
    let userId = req.params.id;
    let user = data.users.find(user => user.id === parseInt(userId));
    res.render("profiles", user);

});


//Listen to port
app.listen(port, () => {
    console.log(`server is running on port ${port}`);
});