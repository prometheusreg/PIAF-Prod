"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const logging_adapter_1 = require("../adapters/logging-adapter");
const getUnits = (req, res) => {
    var body = req.body || {};
    var test = {
        "Bearer": "testbearer",
        "Call": "ProxyGetUnits"
    };
    logging_adapter_1.default['createOrUpdate'](test).then(result => { console.log(result); });
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
        client.getunitsbyproperty(args, function (err, result) {
            //console.log(JSON.stringify(result, undefined, 4));
            if (result['getunitsbypropertyResult'] && result['getunitsbypropertyResult']['GetUnitsByProperty'] && result['getunitsbypropertyResult']['GetUnitsByProperty']['UnitObject']) {
                res.status(200).json(result['getunitsbypropertyResult']['GetUnitsByProperty']['UnitObject']);
            }
            else {
                res.status(400).json(result['body']);
            }
            //console.log(client.lastRequest);
        });
    });
};
module.exports = getUnits;
//# sourceMappingURL=proxyGetUnits-controller.js.map