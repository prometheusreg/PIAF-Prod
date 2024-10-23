import * as express from "express";
var RPXclient = require("../services/RPX-service");
const testing = (req: express.Request, res: express.Response)=>{
  RPXclient(function (client) {
    var keys = Object.keys(client);
    var template = {};
    for (var key in keys) {
      template[keys[key]] = true;
    }
    res.status(200).json(template);
  })
}
module.exports = testing;