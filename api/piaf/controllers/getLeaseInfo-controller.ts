import * as express from "express";
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const getLeaseInfo = (req, res) => {
    var body = req.body || {};
    var args = {
        "tem:auth": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240715",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        },
        "tem:getleaseinfo": {
            "tem:residentstatus": "C",
            "tem:propertynumber": "ALL",
            "tem:residentheldthestatus": "10",
            "tem:residentwillhavethestatus": "10"
        }
    };
    RPXclient(function (client) {
        client.getleaseinfo(args, function (err, result) {
            if (result['getleaseinfoResult']) {
                res.status(200).json(result['getleaseinfoResult']['GetLeaseInfo']['Leases']['Lease']);
            }
            else {
                res.status(400).json(result['body']);
            }
        });
    });
};
module.exports = getLeaseInfo;