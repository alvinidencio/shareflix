var express = require("express");
var path = require("path");
var session = require("express-session");
var app = express();
var mongoose = require("mongoose");
mongoose.connect('mongodb://localhost:27017/shareflixDB', {useNewUrlParser: true, useUnifiedTopology: true});

app.set("view engine", "ejs");

app.use("/assets", express.static("assets"));
//app.use("/assets", express.static(path.join(__dirname, "assets"))); //how does this work? //fixed by adding a forward slash before the path in the href in connection.ejs
app.use(express.urlencoded({ extended: true}));

app.use(
    session({
        secret: "password",
        resave: true,
        saveUninitialized: true
    })
);

app.use(function(req, res, next ){
    res.locals.theUser = req.session.theUser;
    console.log(res.locals.theUser);
    next();
});

var mainController = require("./controllers/mainController.js");
var connectionController = require("./controllers/connectionController.js");
var userController = require("./controllers/userController.js");

app.use("/", mainController);
app.use("/connections", connectionController);
app.use("/user", userController);

app.listen(3000);