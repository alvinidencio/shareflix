const userProfile = require("../models/userProfile");
var  UserProfile = require("../models/userProfile");
var ConnectionDB = require("../utilities/connectionDB");
const Connection = require("../models/connection");
const { Model } = require("mongoose");

var connectionDB = new ConnectionDB()
//hard coded additional IDs for new connection entries
//since I couldn't figure it out
var newConnectionID = 10;


class UserProfileDB {
    constructor() {}

    async getUserProfile(userID) {
        //return list of all userconnection objects

        console.log("getuserprofile function");
        
        console.log(await UserProfile.findOne({userID: userID}, "userConnections"));
        //find userprofile in db
        let userconnLink = await UserProfile.findOne({userID: userID}, "userConnections");
        console.log("testing link");
        console.log(userconnLink)
        //user profile does not exist
        if (userconnLink == null) {
            return [];
        }
        console.log(userconnLink.userConnections.length);

        let userConnectionList = [];
        //creating a userConnection object, then pushing it to the userConnectionList array
        for (var i = 0; i < userconnLink.userConnections.length; i++) {
            console.log("test for loop");
            var connection = await connectionDB.getConnection(userconnLink.userConnections[i].connectionID);
            var rsvp = userconnLink.userConnections[i].rsvp;
            console.log(userconnLink.userConnections[i].rsvp);
            
            var userConnection = {connection, rsvp};
            console.log("print userConnection");
            console.log(userConnection);

            userConnectionList.push(userConnection);
            console.log("printing userconnlist array");
            console.log(userConnectionList);
        }

        return userConnectionList;
    }
    
    async addRSVP(userID, connectionID, rsvp) {
        var updated = false;
        
        console.log("====================================================================================================");
        console.log(userID);
        console.log(connectionID);
        console.log(rsvp);

        console.log("about to run addRSVP function");

        let userconnLink = await UserProfile.findOne({userID: userID}, "userConnections");
        console.log("testing link in addRSVP");
        console.log(userconnLink.userConnections.length);


        //updating a userConnection
         for (var i = 0; i < userconnLink.userConnections.length; i++) {
             console.log("checking if inside for loop. loop: " + i);
            if (userconnLink.userConnections[i].connectionID == connectionID) {
                console.log("updating rsvp");
                
                await userProfile.findOneAndUpdate({userID: userID}, 
                    {"$set": {"userConnections.$[id].rsvp": rsvp}}, 
                        {
                            arrayFilters: [{"id.connectionID": connectionID}],
                            new: true
                        });
                updated = true;
            }
        }

        //adding to userConnections
        if (updated == false) {
            await userProfile.findOneAndUpdate({userID: userID}, 
                {"$push": {userConnections: {connectionID: connectionID, rsvp: rsvp}}});
            console.log("adding new connection to saved connections");
        }
    }

    async removeConnection(userID, connectionID) {
        await userProfile.findOneAndUpdate({userID: userID}, 
            {"$pull": {userConnections: {connectionID: connectionID}}});
    }
    

    addConnection(newConnection, hostUser) {
        //creates new connection in database
        console.log("testing addconnection ================");
        var userFullName = hostUser.firstName + " " + hostUser.lastName;
        console.log(userFullName);

        //hard coded additional IDs for new connection entries
        //since I couldn't figure it out
        newConnectionID++;

        Connection.create({
            connectionID: newConnectionID, //length + 1
            connectionName: newConnection.name,
            topic: newConnection.topic,
            host: userFullName,
            date: newConnection.date, 
            startTime: newConnection.startTime,
            endTime: newConnection.endTime,
            location: newConnection.location,
            detail: newConnection.details
        });

        //also add to myConnections with a "Yes"
        this.addRSVP(hostUser.userID, newConnectionID, "Yes");
    }
}

module.exports = UserProfileDB;