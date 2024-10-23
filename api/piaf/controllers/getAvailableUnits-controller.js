"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var RPXclient = require("../services/RPX-service");
const getAvailableUnits = (req, res) => {
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
    var unitargs = {
        "tem:auth": {
            "tem:pmcid": body['pmcid'] || "1240715",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        }
    };
    var leaseTerms = [];
    RPXclient(function (client) {
        client.retrieveleaseterms(args, function (err, result) {
            leaseTerms = result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm'];
            if (Array.isArray(result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm']) == false) {
                leaseTerms = [result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm']];
            }
        });
    });
    var availableUnitList = [];
    RPXclient(function (client) {
        client.getunits(args, function (err, result) {
            //console.log(JSON.stringify(result, undefined, 4));
            if (result['getunitsResult'] && result['getunitsResult']['GetUnits']['Units']['Unit']) {
                for (var j = 0; j < result['getunitsResult']['GetUnits']['Units']['Unit'].length; j++) {
                    if (result['getunitsResult']['GetUnits']['Units']['Unit'][j]['Available'] == 'Y' ||
                        result['getunitsResult']['GetUnits']['Units']['Unit'][j]['UnitHoldStatus'] == 'true') {
                        var unitInfo = result['getunitsResult']['GetUnits']['Units']['Unit'][j];
                        availableUnitList.push(unitInfo);
                    }
                }
            }
            res.status(200).json(availableUnitList);
        });
    });
};
module.exports = getAvailableUnits;
//# sourceMappingURL=getAvailableUnits-controller.js.map