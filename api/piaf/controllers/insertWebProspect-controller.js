"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const insertWebProspect = (req, res) => {
    var body = req.body || {};
    var args = {
        "tem:auth": {
            "tem:pmcid": body['pmcid'] || pmcidlookuptable[body['siteid']] || "1240034",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        },
        "tem:guestcard": {
            "tem:pmcid": body['pmcid'] || pmcidlookuptable[body['siteid']] || "1240034",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:contacttype": body['contacttype'] || "R0000001",
            "tem:primaryleadsource": body['primaryleadsource'] || "",
            "tem:skipduplicatecheck": body['skipduplicatecheck'] || false,
            "tem:datecontact": moment().format("YYYY-MM-DDTHH:mm:ss"),
            "tem:prospects": {
                "tem:Prospect": {
                    "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
                    "tem:siteid": body['siteid'] || "4632028",
                    "tem:firstname": body['firstname'] || "",
                    "tem:middlename": body['middlename'] || "",
                    "tem:lastname": body['lastname'] || "",
                    "tem:email": body['email'] || ""
                }
            }
        }
    };
    RPXclient(function (client) {
        client.insertprospect(args, function (err, result) {
            if (result['insertprospectResult'] && result['insertprospectResult']['InsertProspectResponse']) {
                result = result['insertprospectResult']['InsertProspectResponse'];
                res.status(200).json(result);
            }
            else {
                res.status(400).json(result['body']);
            }
        });
    });
};
module.exports = insertWebProspect;
//# sourceMappingURL=insertWebProspect-controller.js.map