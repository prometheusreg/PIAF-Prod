"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RPXclient = require("../services/RPX-service");
var pmcidlookuptable = require("../lookup/pmcidlookup");
const getResidentEventsByDate = (req, res) => {
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
        "tem:residentsearch": {
            "tem:startdate": body['startDate'] || "2022-11-10T00:00:00",
            "tem:enddate": body['endDate'] || "2022-04-23T00:00:00",
            "tem:events": {
                "tem:string": body["eventFilter"]
            },
            "tem:headofhousehold": true,
            "tem:status": "ALL",
            "tem:propertyid": "ALL"
        },
    };
    RPXclient(function (client) {
        client.residentsearchbydate(args, function (err, result) {
            if (result['residentsearchbydateResult']) {
                res.status(200).json(result['residentsearchbydateResult']['residentlist']['resident']);
            }
            else {
                res.status(400).json(result['body']);
            }
        });
    });
};
module.exports = getResidentEventsByDate;
//# sourceMappingURL=getResidentEventsByDate-controller.js.map