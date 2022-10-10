var mongoose = require("mongoose");

var userSchema = mongoose.Schema({
    userID: Number,
    firstName: String,
    lastName: String,
    email: String
});

module.exports = mongoose.model("User", userSchema, "users");