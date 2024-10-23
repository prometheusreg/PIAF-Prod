"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
class GetProspectAdapter {
}
exports.GetProspectAdapter = GetProspectAdapter;
GetProspectAdapter.getProspect = (body) => {
    return new Promise((resolve, reject) => {
        var args = {
            "tem:auth": {
                "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
                "tem:siteid": body['siteid'] || "1241361",
                "tem:username": "prom2_service",
                "tem:password": "PcFcsS7Y2Z",
                "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
                "tem:system": "OneSite"
            },
            "tem:prospectSearchCriterion": {
                "tem:ProspectSearchCriterion": {
                    "tem:email": body['email'],
                    "tem:name": body['firstName'] + body['lastName']
                }
            }
        };
        RPXclient(function (client) {
            client.prospectsearch(args, function (err, result) {
                if (result['prospectsearchResult']) {
                    resolve(result);
                }
                else {
                    reject(result);
                }
            });
        });
    });
};
//# sourceMappingURL=getProspect-adapter.js.map