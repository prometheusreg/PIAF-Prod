var moment = require("moment");
var pmcidlookuptable = require("../lookup/pmcidlookup");
import * as express from "express";
var RPXclient = require("../services/RPX-service");
const Getpaymentschedule = (req: express.Request, res: express.Response) => {
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
    "tem:quoteid": body['quoteid']||"7011922"
  }
  RPXclient(function (client) {
    client.getpaymentschedule(args, function (err, result) {
      //console.log(JSON.stringify(result, undefined, 4));
      if (result['getpaymentscheduleResult'] && result['getpaymentscheduleResult']['GetPaymentSchedule']) {
        res.status(200).json(result['getpaymentscheduleResult']['GetPaymentSchedule']);
      }
      else {
        res.status(400).json(result['body']);
      }
      //console.log(client.lastRequest);
    });
  })
}
module.exports = Getpaymentschedule;