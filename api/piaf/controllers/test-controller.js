"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RPXclient = require("../services/RPX-service");
const testing = (req, res) => {
    RPXclient(function (client) {
        var keys = Object.keys(client);
        var template = {};
        for (var key in keys) {
            template[keys[key]] = true;
        }
        res.status(200).json(template);
    });
};
module.exports = testing;
//# sourceMappingURL=test-controller.js.map