import * as express from "express";
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const getHouseholdSurveyList = (req, res) => {
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
        "tem:parameter": {
            "tem:Filter": body['filter'] || "ALL",
            "tem:DateFilter": body['dateFilter'] || "MI",
            "tem:StartDate": body['startDate'] || "2022-04-23T00:00:00",
            "tem:EndDate":body['endDate'] || "2022-04-24T00:00:00"
        }
    };
    console.log(JSON.stringify(args, undefined, 4));
    RPXclient(function (client) {
        client.GetHouseholdSurveyList(args, function (err, result) {
            console.log('Result New -> '+JSON.stringify(result['GetHouseholdSurveyListResult']).slice(0,220));
            console.log('Response -> '+JSON.stringify(res.body));
            console.log('Response -> '+JSON.stringify(res.status));
            if (result['GetHouseholdSurveyListResult'] 
                && result['GetHouseholdSurveyListResult']['GetHouseholdSurveyListResponse']
                && result['GetHouseholdSurveyListResult']['GetHouseholdSurveyListResponse']['HouseholdList']) {
                res.status(200).json(result['GetHouseholdSurveyListResult']['GetHouseholdSurveyListResponse']['HouseholdList']['Household']);
            }
            else {
                res.status(400).json(result['body']);
            }
        });
    });
};
module.exports = getHouseholdSurveyList;