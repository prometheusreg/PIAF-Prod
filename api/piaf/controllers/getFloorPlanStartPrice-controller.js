"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RPXclient = require("../services/RPX-service");
const getFloorPlanStartPrice = (req, res) => {
    var body = req.body || {};
    var args = {
        "tem:auth": {
            "tem:pmcid": body['pmcid'] || "1240715",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        }
    };
    RPXclient(function (client) {
        client.getfloorplanlist(args, function (err, result) {
            if (result['getfloorplanlistResult']) {
                res.status(200).json(result['getfloorplanlistResult']['GetFloorPlanList']['FloorPlanObject']);
            }
            else {
                res.status(400).json(result['body']);
            }
        });
    });
};
module.exports = getFloorPlanStartPrice;
//# sourceMappingURL=getFloorPlanStartPrice-controller.js.map