var mongoose = require("mongoose");

var connectionSchema = mongoose.Schema({
    connectionID: Number,
    connectionName: String,
    topic: String,
    host: String,
    date: String, 
    startTime: String,
    endTime: String,
    location: String,
    detail: String
}, {
    versionKey: false
});
//maybe use Date SchemaType?

module.exports = mongoose.model("Connection", connectionSchema, "connections");
