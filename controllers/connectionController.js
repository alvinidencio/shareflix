const { render } = require("ejs");
var express = require("express");
const session = require("express-session");

const ConnectionDB = require("../utilities/connectionDB");
const UserProfile = require("../models/userProfile");

var router = express.Router();

var connectionDB = new ConnectionDB();


router.get("/", async function(req, res){

    let connections = await connectionDB.getConnections();
    let topicList = await connectionDB.getTopics();

    //display all connections dynamically
    //adding a new connection to connectionDB.js will update the list dynamically
    console.log("testing connections list");
    console.log(connections);
    console.log("testing topics list");
    console.log(topicList);
    res.render("connections", {connections: connections, topicList: topicList} );
});

router.get("/connection/:connectionID", async function(req, res){
    
    let connection = await connectionDB.getConnection(req.params.connectionID);

    //checks if connectionID is valid, and displays if it is
    //otherwise, displays the catalog instead
    if (await validateConnectionID(Number.parseInt(req.params.connectionID))) {
        console.log("validated");
        res.render("connection", {connection: connection});
    } else {
        console.log("no valid connection found!");
        res.redirect("/connections");
    }
});



/*
//static and hard-coded for now as mentioned in the demo
router.get("/myConnections", function(req, res){

    res.render("myConnections");

});
*/

//very bare bones, focused more on the implementation of the MVC design pattern; need to update
router.get("/newConnection", function(req, res){
    res.render("newConnection");
});

//takes the connectionID and compares if it exists in the array containing all the connectionIDs
async function validateConnectionID(connectionID) {
    let connectionIDList = await connectionDB.getConnectionIDs();

    console.log(connectionIDList);
    if (connectionIDList.includes(connectionID)) {
        console.log("true");
        return true;
    } else {
        console.log("false");
        return false;
    }
}


module.exports = router;