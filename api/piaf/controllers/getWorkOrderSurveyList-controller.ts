import * as express from "express";
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const getWorkOrderSurveyList = (req, res) => {
    var body = req.body || {};
    var args = {
        "tem:auth": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240715",
            "tem:siteid": body['siteid'] || "1023708",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        },
        "tem:parameter": {
            "tem:Status": body['status'] || "In Progress",
            "tem:StartDate": body['startDate'] || "2022-04-23",
            "tem:EndDate":body['endDate'] || "2022-04-24"
        }
    };
    RPXclient(function (client) {
        client.GetWorkOrderSurveyList(args, function (err, result) {
            if (result['GetWorkOrderSurveyListResult']) {
                res.status(200).json(result['GetWorkOrderSurveyListResult']['GetWorkOrderSurveyListResponse']['WorkOrderList']['WorkOrder']);
            }
            else {
                res.status(400).json(result['body']);
            }
        });
    });
};
module.exports = getWorkOrderSurveyList;