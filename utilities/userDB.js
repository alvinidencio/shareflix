var  User = require("../models/user");

class UserDB {
    constructor() {}

    async getUser(userID) {
        console.log("getuser function");
        console.log(await User.findOne({userID: userID}));
        return await User.findOne({userID: userID});
    }
}

module.exports = UserDB;