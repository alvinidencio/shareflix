const { render } = require("ejs");
var express = require("express");
var router = express.Router();

const ConnectionDB = require("../utilities/connectionDB");
const UserDB = require("../utilities/userDB");
const UserProfileDB = require("../utilities/userProfileDB")

const User = require("../models/user");
const UserProfile = require("../models/userProfile");
const Connection = require("../models/connection");

var urlencodedParser = express.urlencoded({ extended: false });

var connectionDB = new ConnectionDB();
var userDB = new UserDB();
var userProfileDB = new UserProfileDB();

router.get("/", function(req, res){
    res.redirect("/user/login");
});

router.get("/login", function(req, res){
    res.render("login");
});

router.post("/login", async function(req, res){

    //initialize session
    console.log("test getuser function")
    await initializeSession(req, res);
    
    //test
    console.log("testing req.session.theUser");
    console.log(req.session.theUser);

    console.log("post success");
    console.log(req.session.theUser.firstName);

    //once logged in, redirect to my connection
    res.redirect("/user/myConnections");
});

//Viewing My Connections
router.get("/myConnections", async function(req, res){
    // if logged in, redirect to my connection. else, redirect to login page
    if (!req.session.theUser) {
        console.log("not logged in");
        return res.redirect("/user/login");
    }
    console.log("rendering my conections");

    let currUserID = req.session.theUser.userID;
    console.log("TESTING req.session.theUser.userID ====================");
    console.log(req.session.theUser.userID);
    let userProfile = await userProfileDB.getUserProfile(currUserID);

    //some testing
    console.log("print userProfile");
    console.log(userProfile);
    console.log("print just 1");
    console.log(userProfile[0]);

    res.render("myConnections", {userConnections: userProfile});
});

//Saving a Connection
router.post("/myConnections", async function(req, res){
    //if logged in, redirect to my connection. else, redirect to login page
    if (!req.session.theUser) {
        console.log("not logged in");
        return res.redirect("/user/login");
    }

    let code = req.body.connectionID;
    let rsvp = req.body.rsvp;
    let userID = req.session.theUser.userID;

    await userProfileDB.addRSVP(userID, code, rsvp);
    let userProfile = await userProfileDB.getUserProfile(userID);

    console.log("checking if added successfully");
    console.log(userProfile);

    res.render("myConnections", {userConnections: userProfile});
});

//Deleting Saved Connection
router.post("/myConnections/delete", async function(req, res){
    //id and connection of about to be deleted connection
    let deleteID = req.body.delete;
    let userID = req.session.theUser.userID;


    await userProfileDB.removeConnection(userID, deleteID);
    let userProfile = await userProfileDB.getUserProfile(userID);
    res.render("myConnections", {userConnections: userProfile});
});

//Creating New Connection
router.post("/myConnections/new", async function(req, res){
    if (!req.session.theUser) {
        return res.redirect("/user/login");
    }

    let userID = req.session.theUser.userID;

    console.log("=======================================");
    console.log("testing create new connection");
    console.log(req.body.startTime);
    console.log(req.body.date);
    console.log(req.body);

    userProfileDB.addConnection(req.body, req.session.theUser);

    let userProfile = await userProfileDB.getUserProfile(userID);
    res.render("myConnections", {userConnections: userProfile});
});

router.get("/logout", function(req, res){
    req.session.destroy();
    res.redirect("/");
});

//initialize user session profile
async function initializeSession(req, res) {
    var currentUser = await userDB.getUser(1);//hardcoded to just retrieve the first user
    console.log("testing initialize============================================");
    console.log(currentUser);
    req.session.theUser = currentUser;
    console.log("testing req.session.theUser inside function");
    console.log(req.session.theUser);
}

module.exports = router;