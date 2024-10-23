import * as express from "express";
var RPXclient = require("../services/RPX-service");
var pmcidlookuptable = require("../lookup/pmcidlookup");
const getServiceRequestsByDate = (req: express.Request, res: express.Response) => {
  var body = req.body || {};
  var args = {
    "tem:auth": {
      "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
      "tem:siteid": body['siteid'] || "4774078",
      "tem:username": "prom2_service",
      "tem:password": "PcFcsS7Y2Z",
      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
      "tem:system": "OneSite"
    },
    "tem:getservicerequest": {
        "tem:searchtype"        : body['searchType'] || "7",
        "tem:searchid"          : body['searchId'] || "0",
        "tem:requeststatus"     : body['requestStatus'] || "4",
        "tem:requestdatestart"  : body['requestedStartDate'] || "2022-11-01T00:00:00",
        "tem:requestdateend"    : body['requestedEndDate'] || "2022-11-11T00:00:00",
        "tem:includeactivity"   : true,
        "tem:completedatestart" : body['completedStartDate'] || "2022-11-01T00:00:00",
        "tem:completedateend"   : body['completedEndDate'] || "2022-11-11T00:00:00",
    },
  };
  RPXclient(function (client) {
    console.log('Entering service request -> '+JSON.stringify(args));
    client.getservicerequest(args, function (err, result) {
      if (result['getservicerequestResult']) {
        res.status(200).json(result['getservicerequestResult']['GetServiceRequests']['GetServiceRequest']);
      }
      else {
        res.status(400).json(result['body']);
      }
    });
  })
}
module.exports = getServiceRequestsByDate;