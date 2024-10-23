"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const getProspectSurveyList = (req, res) => {
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
            "tem:Filter": "DateRange",
            "tem:StartDate": body['startDate'] || "2022-04-23T00:00:00",
            "tem:EndDate": body['endDate'] || "2022-04-24T00:00:00"
        }
    };
    RPXclient(function (client) {
        client.GetProspectSurveyList(args, function (err, result) {
            if (result['GetProspectSurveyListResult']) {
                res.status(200).json(result['GetProspectSurveyListResult']['GetProspectSurveyListResponse']['ProspectSurveyList']['Prospect']);
            }
            else {
                res.status(400).json(result['body']);
            }
        });
    });
};
module.exports = getProspectSurveyList;
//# sourceMappingURL=getProspectSurveyList-controller.js.map