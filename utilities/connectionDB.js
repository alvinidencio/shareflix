var Connection = require("../models/connection");

class ConnectionDB {
    constructor() {}

    async getConnections() {
        console.log("testing function");
        return await Connection.find({});
    }

    async getConnection(connectionID) {
        console.log("testing getconnectionid function")
        console.log(await Connection.findOne({connectionID: connectionID}))
        return await Connection.findOne({connectionID: connectionID});
    }

    async getTopics() {
        var topicList = new Array();

        var connectionList = await Connection.find({});

        connectionList.forEach(connection => {
            if (!topicList.includes(connection.topic)) {
                topicList.push(connection.topic);
            } else {
                console.log("Topic is already on the list!");
            }
        });
        console.log(topicList);
        return topicList;
    }

    async getConnectionIDs() {
        var connectionIDList = new Array();

        var connectionList = await Connection.find({});

        connectionList.forEach(connection => {
            connectionIDList.push(connection.connectionID);
        });
        console.log(connectionIDList);
        return connectionIDList;
    }
}

module.exports = ConnectionDB;