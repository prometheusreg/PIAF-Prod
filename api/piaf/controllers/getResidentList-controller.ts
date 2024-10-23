import * as express from "express";
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const getResidentList = (req, res) => {
    var body = req.body || {};
    var args = {
        "tem:auth": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240715",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        }
    };
    RPXclient(function (client) {
        client.getresidentlist(args, function (err, result) {
            if (result['getresidentlistResult']) {
                res.status(200).json(result['getresidentlistResult']['residentlist']['resident']);
            }
            else {
                res.status(400).json(result['body']);
            }
        });
    });
};
module.exports = getResidentList;