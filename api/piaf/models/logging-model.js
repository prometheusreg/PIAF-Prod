"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Schema = mongoose.Schema;
let loggingSchema = new Schema({
    //"_id": ObjectId("5e99d44e9d4fa970ed978967"),
    "Bearer": String,
    "Call": String,
    "Created": Date,
    "LastUpdate": Date
}, {
    "timestamps": {
        createdAt: 'Created',
        updatedAt: 'LastUpdate'
    }
});
exports.default = loggingSchema;
//# sourceMappingURL=logging-model.js.map