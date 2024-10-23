"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const prospects = (req, res) => {
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
        "tem:prospectSearchCriterion": {
            "tem:ProspectSearchCriterion": {
                "tem:guestcardid": body['guestcardid'] || "9016030"
            }
        }
    };
    RPXclient(function (client) {
        client.prospectsearch(args, function (err, result) {
            //console.log(JSON.stringify(result, undefined, 4));
            if (result['prospectsearchResult'] && result['prospectsearchResult']['ProspectSearch']) {
                res.status(200).json(result['prospectsearchResult']['ProspectSearch']);
            }
            //console.log(client.lastRequest);
        });
    });
};
module.exports = prospects;
//# sourceMappingURL=propsects-controller.js.map