"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pmcidlookuptable = require("../lookup/pmcidlookup");
//import { GetUnitListAdapter } from "../adapters/getUnitList-adapter";
var RPXclient = require("../services/RPX-service");
const getUnitList = (req, res) => {
    var body = req.body || {};
    var args = {
        "tem:auth": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
            "tem:siteid": body['siteid'] || "4774078",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        },
        "tem:listCriteria": {
            "tem:listCriterion": {
                "tem:name": body['name'] || "DateNeeded",
                "tem:singlevalue": body['needByDate'] || "2022-11-30T00:00:00"
            }
        }
    };
    RPXclient(function (client) {
        console.log('RK calling ' + args);
        //client.getunitlist(args, function (err, result) {
        //  if (result['getunitlistResult']) {
        //    res.status(200).json(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']);
        //  }
        //  else {
        //    res.status(400).json(result['body']);
        //  }
        //});
    });
};
module.exports = getUnitList;
//# sourceMappingURL=getUnitList-controller.js.map