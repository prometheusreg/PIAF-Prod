"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
class UpdateProspectAdapter {
}
exports.UpdateProspectAdapter = UpdateProspectAdapter;
UpdateProspectAdapter.updateProspect = (body) => {
    return new Promise((resolve, reject) => {
        var args = {
            "tem:auth": {
                "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
                "tem:siteid": body['siteid'] || "4632028",
                "tem:username": "prom2_service",
                "tem:password": "PcFcsS7Y2Z",
                "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
                "tem:system": "OneSite"
            },
            "tem:guestcard": {
                "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
                "tem:siteid": body['siteid'] || "4673558",
                "tem:leasingagentid": body['leasingagentid'] || "47833949",
                "tem:guestcardid": body['guestcardid'] || "18244005",
                "tem:prospects": {
                    "tem:Prospect": {
                        "tem:customerid": body['customerid'] || "18310449",
                        "tem:firstname": body['firstname'] || "Head",
                        "tem:lastname": body['lastname'] || "IT99",
                        "tem:relationshipid": body['relationshipid'] || "H"
                    }
                }
            }
        };
        RPXclient(function (client) {
            client.updateprospect(args, function (err, result) {
                console.log(JSON.stringify(result, undefined, 4));
                if (result['updateprospectResult'] && result['updateprospectResult']['UpdateProspect']) {
                    resolve(result);
                }
                else {
                    //console.log("got to here");
                    reject(result['body']);
                }
            });
        });
    });
};
;
//# sourceMappingURL=updateProspect-Adapter.js.map