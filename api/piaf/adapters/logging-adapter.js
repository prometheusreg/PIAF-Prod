"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const mongoose = require("mongoose");
const Promise = require("bluebird");
const _ = require("lodash");
const logging_model_1 = require("../models/logging-model");
logging_model_1.default.static("getAll", () => {
    return new Promise((resolve, reject) => {
        let _query = {};
        loggingAdapter.find(_query)
            .exec((err, todos) => {
            err ? reject(err)
                : resolve(todos);
        });
    });
});
logging_model_1.default.static("getSome", () => {
    return new Promise((resolve, reject) => {
        let _query = {};
        loggingAdapter.find(_query).limit(100)
            .exec((err, todos) => {
            err ? reject(err)
                : resolve(todos);
        });
    });
});
logging_model_1.default.static("getByID", (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            return reject(new TypeError("Not is not a valid object."));
        }
        loggingAdapter.findById(id)
            .exec((err, todo) => {
            err ? reject(err)
                : resolve(todo);
        });
    });
});
logging_model_1.default.static("getByBearer", (id) => {
    return new Promise((resolve, reject) => {
        if (!id) {
            return reject(new TypeError("Not is not a valid object."));
        }
        loggingAdapter.findOne({ "Bearer": id })
            .exec((err, todo) => {
            err ? reject(err)
                : resolve(todo);
        });
    });
});
logging_model_1.default.static("createOrUpdate", (anObject) => {
    return new Promise((resolve, reject) => {
        if (!_.isObject(anObject)) {
            return reject(new TypeError("supplied parameter is not a valid object"));
        }
        let NewObject = new loggingAdapter(anObject);
        NewObject.save((err, saved) => {
            err ? reject(err) : resolve(saved);
        });
    });
});
let loggingAdapter = mongoose.model("logs", logging_model_1.default);
exports.default = loggingAdapter;
//# sourceMappingURL=logging-adapter.js.map