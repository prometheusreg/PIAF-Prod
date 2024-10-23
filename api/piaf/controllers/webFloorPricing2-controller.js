"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var RPXclient = require("../services/RPX-service");
const webFloorPricing2 = (req, res) => {
    var body = req.body || {};
    var startDate = new Date();
    startDate.setDate(startDate.getDate() + 14);
    var startDateFormatted = startDate.toJSON().slice(0, 10);
    var startPriceArgs1 = {
        "tem:auth": {
            "tem:pmcid": body['pmcid'] || "1240034",
            "tem:siteid": body['siteid'] || "4774078",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        },
        "tem:listCriteria": [{
                "tem:ListCriterion": {
                    "tem:name": "DateNeeded",
                    "tem:singlevalue": startDateFormatted
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "LimitResults",
                    "tem:singlevalue": "false"
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "IncludeAllLeaseTerms",
                    "tem:singlevalue": "true"
                }
            }]
    };
    startDate.setDate(startDate.getDate() + 16);
    var startDateFormatted = startDate.toJSON().slice(0, 10);
    var startPriceArgs2 = {
        "tem:auth": {
            "tem:pmcid": body['pmcid'] || "1240034",
            "tem:siteid": body['siteid'] || "4774078",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        },
        "tem:listCriteria": [{
                "tem:ListCriterion": {
                    "tem:name": "DateNeeded",
                    "tem:singlevalue": startDateFormatted
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "LimitResults",
                    "tem:singlevalue": "false"
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "IncludeAllLeaseTerms",
                    "tem:singlevalue": "true"
                }
            }]
    };
    var output = [];
    var unitList = [];
    var rentList = [];
    var minRent, maxRent;
    RPXclient(function (client) {
        client.getunitlist(startPriceArgs1, function (err, result) {
            if (result['getunitlistResult']
                && result['getunitlistResult']['GetUnitList']
                && result['getunitlistResult']['GetUnitList']['UnitObjects']
                && result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) {
                if (Array.isArray(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) == false) {
                    result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'] = [result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']];
                }
                //console.log('Length '+result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'].length);
                for (var j = 0; j < result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'].length; j++) {
                    if (!unitList.includes(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['Address']['UnitID'])) {
                        unitList.push(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['Address']['UnitID']);
                        var pricingMatrix = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['RentMatrix'] || {};
                        if (Object.keys(pricingMatrix).length == 0) {
                            rentList.push(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['EffectiveRent']);
                        }
                        else {
                            rentList.push(pricingMatrix['Rows']['Row']['attributes']['MinRent']);
                        }
                    }
                }
            }
        });
        client.getunitlist(startPriceArgs2, function (err, result) {
            if (result['getunitlistResult']
                && result['getunitlistResult']['GetUnitList']
                && result['getunitlistResult']['GetUnitList']['UnitObjects']
                && result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) {
                if (Array.isArray(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) == false) {
                    result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'] = [result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']];
                }
                for (var j = 0; j < result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'].length; j++) {
                    if (!unitList.includes(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['Address']['UnitID'])) {
                        unitList.push(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['Address']['UnitID']);
                        var pricingMatrix = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['RentMatrix'] || {};
                        if (Object.keys(pricingMatrix).length == 0) {
                            rentList.push(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['EffectiveRent']);
                        }
                        else {
                            rentList.push(pricingMatrix['Rows']['Row']['attributes']['MinRent']);
                        }
                    }
                }
            }
            if (rentList.length > 0) {
                minRent = Math.min(...rentList);
                maxRent = Math.max(...rentList);
                var startPrice = {
                    "Bedrooms": '1',
                    "RentMin": minRent,
                    "RentMax": maxRent
                };
                output.push(startPrice);
            }
            res.status(200).json(output);
        });
    });
};
module.exports = webFloorPricing2;
//# sourceMappingURL=webFloorPricing2-controller.js.map