/*const User = require("../models/user");
const Connection = require("../models/connection");
const UserConnection = require("../models/userConnection");
const e = require("express");

class UserProfile {
    constructor(user, userConnections) {
        this.user = user;
        this.userConnections = userConnections;
    }

    addConnection(connection, rsvp) {

        var updated = false;
        
        console.log("====================================================================================================");
        console.log(connection);
        console.log(rsvp);

        console.log("about to run addConnection function");

         for (var i = 0; i < this.userConnections.length; i++) {
            if (this.userConnections[i].connection.connectionID == connection.connectionID) {
                console.log("updating rsvp");
                this.userConnections[i].rsvp = rsvp;
                updated = true;
            }
        }

        //adding to userConnections
        if (updated == false) {
            let newUserConnection = new UserConnection(connection, rsvp);
            console.log("adding new connection to saved connections");
            this.userConnections.push(newUserConnection);
        } 
    }

    removeConnection(connection) {
        for (var i = 0; i < this.userConnections.length; i++) {
            console.log("testing delete function");
            if (this.userConnections[i].connection.connectionID == connection.connectionID) {
                this.userConnections.splice(i, 1);
                break;
            }
        }
    }

    //merge or separate
    updateRSVP(connection, rsvp) {
    }

    getUserConnections() {
        return this.userConnections;
    }
}

module.exports = UserProfile;*/

var mongoose = require("mongoose");
var User = require("../models/user").schema;
var Connection = require("../models/connection").schema;

var userProfileSchema = mongoose.Schema({
    userID: Number,
    userConnections: [{connectionID: Number, rsvp: String, _id: false}]
});

module.exports = mongoose.model("UserProfile", userProfileSchema, "userprofiles");