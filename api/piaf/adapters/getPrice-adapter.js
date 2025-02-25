"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
class GetPriceAdapter {
}
exports.GetPriceAdapter = GetPriceAdapter;
GetPriceAdapter.getPricing = (body, index, unitList, priceList) => {
    return new Promise((resolve, reject) => {
        var args = {
            "tem:auth": {
                "tem:pmcid": body['pmcid'] || "1240034",
                "tem:siteid": body['siteid'] || "4774078",
                "tem:username": "prom2_service",
                "tem:password": "PcFcsS7Y2Z",
                "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
            }
        };
        if (body['dateNeeded']) {
            args['tem:listCriteria'] = [
                {
                    "tem:ListCriterion": {
                        "tem:name": "DateNeeded",
                        "tem:singlevalue": body['dateNeeded']
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
                }
            ];
        }
        var baseargs = {
            "tem:auth": {
                "tem:pmcid": body['pmcid'] || "1240034",
                "tem:siteid": body['siteid'] || "4632028",
                "tem:username": "prom2_service",
                "tem:password": "PcFcsS7Y2Z",
                "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
            },
            "tem:selectedonly": "true"
        };
        var fpMap = new Map();
        RPXclient(function (client) {
            client.getfloorplanlist(args, function (err, result) {
                if (result['getfloorplanlistResult']) {
                    for (var j = 0; j < result['getfloorplanlistResult']['GetFloorPlanList']['FloorPlanObject'].length; j++) {
                        fpMap.set(result['getfloorplanlistResult']['GetFloorPlanList']['FloorPlanObject'][j]['FloorPlanCode'], result['getfloorplanlistResult']['GetFloorPlanList']['FloorPlanObject'][j]['MaximumOccupants']);
                    }
                }
            });
        });
        var leaseTerms = [];
        RPXclient(function (client) {
            client.retrieveleaseterms(baseargs, function (err, result) {
                leaseTerms = result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm'];
                if (Array.isArray(result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm']) == false) {
                    leaseTerms = [result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm']];
                }
            });
        });
        var rentList = [];
        RPXclient(function (client) {
            client.getunitlist(args, function (err, result) {
                if (result['getunitlistResult']
                    && result['getunitlistResult']['GetUnitList']
                    && result['getunitlistResult']['GetUnitList']['UnitObjects']
                    && result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) {
                    if (Array.isArray(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) == false) {
                        result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'] = [result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']];
                    }
                    for (var j = 0; j < result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'].length; j++) {
                        if (!unitList.includes(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['Address']['UnitID'])) {
                            var pricingMatrix = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['RentMatrix'] || {};
                            var bestRent = String;
                            var bestTerm = String;
                            var bestDate = String;
                            if (Object.keys(pricingMatrix).length == 0) {
                                rentList.push(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['EffectiveRent']);
                                for (var l = 0; l < leaseTerms.length; l++) {
                                    bestRent = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['EffectiveRent'];
                                    bestTerm = leaseTerms[l]['LeaseTermMonthCount'];
                                }
                            }
                            else {
                                rentList.push(pricingMatrix['Rows']['Row']['attributes']['MinRent']);
                                try {
                                    for (var k = 0; k < pricingMatrix['Rows']['Row']['Options'].length; k++) {
                                        if (pricingMatrix['Rows']['Row']['Options'][k]['Option']) {
                                            if (Array.isArray(pricingMatrix['Rows']['Row']['Options'][k]['Option']) == false) {
                                                pricingMatrix['Rows']['Row']['Options'][k]['Option'] = [pricingMatrix['Rows']['Row']['Options'][k]['Option']];
                                            }
                                            for (var m = 0; m < pricingMatrix['Rows']['Row']['Options'][k]['Option'].length; m++) {
                                                if (pricingMatrix['Rows']['Row']['Options'][k]['Option'][m]['attributes']['Best'] == 'true') {
                                                    bestDate = pricingMatrix['Rows']['Row']['Options'][k]['attributes']['LeaseStartDate'];
                                                    bestRent = pricingMatrix['Rows']['Row']['Options'][k]['Option'][m]['attributes']['Rent'];
                                                    bestTerm = pricingMatrix['Rows']['Row']['Options'][k]['Option'][m]['attributes']['LeaseTerm'];
                                                }
                                            }
                                        }
                                    }
                                }
                                catch (e) {
                                    console.log('Error when finding best price for ' + JSON.stringify(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['Address']['UnitNumber']));
                                }
                            }
                            delete result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['RentMatrix'];
                            delete result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['PropertyNumberID'];
                            var outputi = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j];
                            outputi['PropertyNumberID'] = body['siteid'];
                            outputi['unitOccupancy'] = fpMap.get(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['FloorPlan']['FloorPlanCode']) || '5';
                            outputi['bestTerm'] = bestTerm;
                            outputi['bestRent'] = bestRent;
                            outputi['bestDate'] = bestDate;
                            if (index != 4) {
                                priceList.push(outputi);
                            }
                            if (index == 4 && body['siteid'] != '5009682') {
                                priceList.push(outputi);
                            }
                            if (index == 4 && body['siteid'] == '5009682' && outputi['FloorPlan']['FloorPlanName'].startsWith('Plan 1')) {
                                priceList.push(outputi);
                            }
                        }
                    }
                }
                resolve(priceList);
            });
        });
    });
};
;
//# sourceMappingURL=getPrice-adapter.js.map