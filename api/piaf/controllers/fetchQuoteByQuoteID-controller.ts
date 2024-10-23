var moment = require("moment");
var pmcidlookuptable = require("../lookup/pmcidlookup");
import * as express from "express";
var RPXclient = require("../services/RPX-service");
const Fetchsinglequote = (req: express.Request, res: express.Response) => {
  var body = req.body || {};
  var args = {
    "tem:auth": {
      "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240715",
      "tem:siteid": body['siteid'] || "4632028",
      "tem:username": "prom2_service2",
      "tem:password": "PcFcsS7Y2Z",
      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
      "tem:system": "OneSite"
    },
    "tem:quoteid": body['quoteid']||"7011922"
  }
  RPXclient(function (client) {
    client.fetchsinglequote(args, function (err, result) {
      console.log(JSON.stringify(result, undefined, 4));
      if (result['fetchsinglequoteResult']
        && !result['fetchsinglequoteResult']['message']) {
        res.status(200).json(result['fetchsinglequoteResult']);
      }
      else {
        if (result['fetchsinglequoteResult'] && result['fetchsinglequoteResult']['message']) {
          res.status(400).json(result['fetchsinglequoteResult']['message']);
        }
        else {
          res.status(400).json(result['body']); //Placeholder to add same error code from result from realpage
        }
      }
      console.log(client.lastRequest);
      //console.log(result);
    });
  })
}
module.exports = Fetchsinglequote;