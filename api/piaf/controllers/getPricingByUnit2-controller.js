"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var pmcidlookuptable = require("../lookup/pmcidlookup");
var outpath = "./getMountainViewPricing.json";
var RPXclient = require("../services/RPX-service");
const getPricingByUnit2 = (req, res) => {
    var body = req.body || {};
    var args = {
        "tem:auth": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
        }
    };
    var baseargs = {
        "tem:auth": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
        },
        "tem:selectedonly": "true"
    };
    if (body['beds'] && body['baths'] && body['dateNeeded']) {
        let convDate, convMonth, convYear, convNewDate;
        const needByDate = new Date(body['dateNeeded']);
        needByDate.setDate(needByDate.getDate() + 7);
        convDate = needByDate.getDate();
        if (convDate < 10) {
            convDate = '0' + convDate;
        }
        convMonth = needByDate.getMonth() + 1;
        if (convMonth < 10) {
            convMonth = '0' + convMonth;
        }
        convYear = needByDate.getFullYear();
        convNewDate = convYear + '-' + convMonth + '-' + convDate;
        args['tem:listCriteria'] = [
            {
                "tem:ListCriterion": {
                    "tem:name": "NumberBathrooms",
                    "tem:singlevalue": body['baths']
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "NumberBedrooms",
                    "tem:singlevalue": body['beds']
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "DateNeeded",
                    "tem:singlevalue": convNewDate || body['dateNeeded']
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "UnitId",
                    "tem:singlevalue": body['UnitId']
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
    else {
        if (body['dateNeeded']) {
            let convDate, convMonth, convYear, convNewDate;
            const needByDate = new Date(body['dateNeeded']);
            needByDate.setDate(needByDate.getDate() + 7);
            convDate = needByDate.getDate();
            if (convDate < 10) {
                convDate = '0' + convDate;
            }
            convMonth = needByDate.getMonth() + 1;
            if (convMonth < 10) {
                convMonth = '0' + convMonth;
            }
            convYear = needByDate.getFullYear();
            convNewDate = convYear + '-' + convMonth + '-' + convDate;
            args['tem:listCriteria'] = [
                {
                    "tem:ListCriterion": {
                        "tem:name": "DateNeeded",
                        "tem:singlevalue": convNewDate || body['dateNeeded']
                    }
                },
                {
                    "tem:ListCriterion": {
                        "tem:name": "UnitId",
                        "tem:singlevalue": body['UnitId']
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
    }
    var leaseTerms = [];
    RPXclient(function (client) {
        client.retrieveleaseterms(baseargs, function (err, result) {
            leaseTerms = result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm'];
            if (Array.isArray(result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm']) == false) {
                leaseTerms = [result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm']];
            }
        });
    });
    RPXclient(function (client) {
        client.getunitlist(args, function (err, result) {
            var output = [];
            var termDetail = [];
            if (result['getunitlistResult']
                && result['getunitlistResult']['GetUnitList']
                && result['getunitlistResult']['GetUnitList']['UnitObjects']
                && result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) {
                if (Array.isArray(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) == false) {
                    result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'] = [result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']];
                }
                for (var j = 0; j < result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'].length; j++) {
                    var pricingMatrix = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['RentMatrix'] || {};
                    if (Object.keys(pricingMatrix).length == 0) {
                        for (var l = 0; l < leaseTerms.length; l++) {
                            var tdObj = { NeedByDate: String, LeaseStartDate: String, LeaseEndDate: String, LeaseTerm: String, Rent: String };
                            var newDateFormat, updatedDateFormat;
                            var dateString, monthString;
                            newDateFormat = body['dateNeeded'].substring(5, 7) + '/' + body['dateNeeded'].substring(8, 10) + '/' + body['dateNeeded'].substring(0, 4);
                            dateString = newDateFormat.substring(3, 5);
                            if (dateString.substring(0, 1) == '0') {
                                dateString = dateString.substring(1, 2);
                            }
                            monthString = newDateFormat.substring(0, 2);
                            if (monthString.substring(0, 1) == '0') {
                                monthString = monthString.substring(1, 2);
                            }
                            updatedDateFormat = monthString + '/' + dateString + '/' + body['dateNeeded'].substring(0, 4);
                            tdObj['NeedByDate'] = updatedDateFormat;
                            tdObj['LeaseStartDate'] = updatedDateFormat;
                            tdObj['LeaseTerm'] = leaseTerms[l]['LeaseTermMonthCount'];
                            tdObj['Rent'] = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['EffectiveRent'];
                            termDetail.push(tdObj);
                        }
                    }
                    else {
                        for (var k = 0; k < pricingMatrix['Rows']['Row']['Options'].length; k++) {
                            if (pricingMatrix['Rows']['Row']['Options'][k]['Option']) {
                                if (Array.isArray(pricingMatrix['Rows']['Row']['Options'][k]['Option']) == false) {
                                    pricingMatrix['Rows']['Row']['Options'][k]['Option'] = [pricingMatrix['Rows']['Row']['Options'][k]['Option']];
                                }
                                for (var m = 0; m < pricingMatrix['Rows']['Row']['Options'][k]['Option'].length; m++) {
                                    var tdObj = { NeedByDate: String, LeaseStartDate: String, LeaseEndDate: String, LeaseTerm: String, Rent: String };
                                    tdObj['NeedByDate'] = pricingMatrix['attributes']['NeededByDate'];
                                    tdObj['LeaseStartDate'] = pricingMatrix['Rows']['Row']['Options'][k]['attributes']['LeaseStartDate'];
                                    tdObj['LeaseEndDate'] = pricingMatrix['Rows']['Row']['Options'][k]['Option'][m]['attributes']['LeaseEndDate'];
                                    tdObj['LeaseTerm'] = pricingMatrix['Rows']['Row']['Options'][k]['Option'][m]['attributes']['LeaseTerm'];
                                    tdObj['Rent'] = pricingMatrix['Rows']['Row']['Options'][k]['Option'][m]['attributes']['Rent'];
                                    termDetail.push(tdObj);
                                }
                            }
                        }
                    }
                    delete result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['RentMatrix'];
                    delete result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['PropertyNumberID'];
                    var outputi = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j];
                    outputi['PropertyNumberID'] = body['siteid'];
                    outputi['YieldStarEnabled'] = true;
                    if (body['siteid'] == '4797191' ||
                        body['siteid'] == '1457641' ||
                        body['siteid'] == '4655007' ||
                        body['siteid'] == '4673558' ||
                        body['siteid'] == '4884573' ||
                        body['siteid'] == '5009682' ||
                        body['siteid'] == '4989446') {
                        outputi['YieldStarEnabled'] = false;
                    }
                    outputi['RentMatrix'] = termDetail;
                    output.push(outputi);
                }
            }
            else {
                res.status(400).json(result['output']);
            }
            res.status(200).json(output);
        });
    });
};
module.exports = getPricingByUnit2;
//# sourceMappingURL=getPricingByUnit2-controller.js.map