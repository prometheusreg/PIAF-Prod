"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Promise = require("bluebird");
const dbConst = require("../constants/db.json");
class DBconfig {
    static init() {
        const URL = (process.env.NODE_ENV === "production") ? process.env.MONGOHQ_URL : dbConst['AWSProd'];
        mongoose.Promise = Promise;
        mongoose.connect(URL);
        mongoose.connection.on("error", console.error.bind(console, "An error occured with the DB Connection: "));
    }
}
exports.DBconfig = DBconfig;
//# sourceMappingURL=db.conf.js.map