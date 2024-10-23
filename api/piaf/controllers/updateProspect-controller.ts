var moment = require("moment");
var pmcidlookuptable = require("../lookup/pmcidlookup");
import * as express from "express";
var RPXclient = require("../services/RPX-service");
const updateProspect = (req: express.Request, res: express.Response) => {
  var body = req.body || {};
  var args = {
    "tem:auth": {
      "tem:pmcid":  body['pmcid'] || pmcidlookuptable[body['siteid']] || "1240715",
      "tem:siteid": body['siteid'] || "4632028",
      "tem:username": "prom2_service",
      "tem:password": "PcFcsS7Y2Z",
      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
      "tem:system": "OneSite"
    },
    "tem:guestcard": {
      "tem:pmcid":  body['pmcid'] || pmcidlookuptable[body['siteid']] || "1240034",
      "tem:siteid": body['siteid'] || "4673558",
      "tem:primaryleadsource": body['primaryleadsource'] || "",
      "tem:leasingagentid": body['leasingagentid'] || "47833949",
      "tem:guestcardid": body['guestcardid'] || "18244005",
      "tem:prospects": {
        "tem:Prospect": {
          "tem:customerid": body['customerid'] || "18310449",
          "tem:firstname": body['firstname'] || "Head",
          "tem:lastname": body['lastname'] || "IT99",
          "tem:relationshipid": body['relationshipid'] || "H",
          "tem:email": body['email'] || "updateneighbor@gmail.com"
        }
      }
    }
  };
  RPXclient(function (client) {
    client.updateprospect(args, function (err, result) {
      if (result['updateprospectResult'] && result['updateprospectResult']['UpdateProspect']) {
        res.status(200).json(result);
      }
      else {
        res.status(400).json(result['body']);
      }
    });
  })
}
module.exports = updateProspect;