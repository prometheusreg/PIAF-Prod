import * as express from "express";
var moment              = require("moment");
var pmcidlookuptable    = require("../lookup/pmcidlookup");
var RPXclient           = require("../services/RPX-service");
const insertWebProspect = (req: express.Request, res: express.Response) => {
  var body = req.body || {};
  var args = {
    "tem:auth": {
      "tem:pmcid":       body['pmcid'] || pmcidlookuptable[body['siteid']] || "1240034",
      "tem:siteid":      body['siteid'] || "4632028",
      "tem:username":   "prom2_service",
      "tem:password":   "PcFcsS7Y2Z",
      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
      "tem:system":     "OneSite"
    },
    "tem:guestcard": {
      "tem:pmcid":             body['pmcid'] ||  pmcidlookuptable[body['siteid']] || "1240034",
      "tem:siteid":            body['siteid'] || "4632028",
      "tem:contacttype":       "R0000001",
      "tem:primaryleadsource": body['primaryleadsource'] || "",
      "tem:datecontact":       moment().format("YYYY-MM-DDTHH:mm:ss"),
      "tem:prospects": {
        "tem:Prospect": {
          "tem:pmcid":      pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
          "tem:siteid":     body['siteid'] || "4632028",
          "tem:firstname":  body['firstname'] || "",
          "tem:middlename": body['middlename'] || "",
          "tem:lastname":   body['lastname'] || "",
          "tem:email":      body['email'] || ""
        }
      }
    }
  };
  console.log('In InsertWebProspect Begin -> '+Date());
  RPXclient(function (client) {
    client.insertprospect(args, function (err, result) {
      if (result['insertprospectResult'] && result['insertprospectResult']['InsertProspectResponse']) {
        result = result['insertprospectResult']['InsertProspectResponse'];
        res.status(200).json(result);
      }
      else {
        res.status(400).json(result['body']);
      }
    });
  })
  console.log('In InsertWebProspect End -> '+Date());
}
module.exports = insertWebProspect;