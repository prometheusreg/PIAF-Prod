import * as express from "express";
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const getAvailableFloorPlans = (req: express.Request, res: express.Response) => {
  var body = req.body || {};
  var fpList = [];
  var args = {
    "tem:auth": {
      "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240715",
      "tem:siteid": body['siteid'] || "4632028",
      "tem:username": "prom2_service",
      "tem:password": "PcFcsS7Y2Z",
      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
      "tem:system": "OneSite"
    },
    "tem:listCriteria": {
      "tem:ListCriterion" : {
        "tem:name": body['name'] || "DateNeeded",
        "tem:singlevalue": body['needByDate'] || "2022-11-30T00:00:00"
      }
    }
  };
  RPXclient(function (client) {
    client.getunitlist(args, function (err, result) {
      if (result['getunitlistResult']) {
        var allFP = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'];
        //console.log(vals.map(function(a) {return a.FloorPlan.FloorPlanName;}));
        allFP.forEach((fp) => {
            console.log('Raju '+fp.FloorPlan.FloorPlanName);
            fpList.push(fp.FloorPlan.FloorPlanName);
        });
        console.log('Raju fpList length '+fpList.length);
        console.log('Raju FP List '+fpList);
        res.status(200).json(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']);
      }
      else {
        res.status(400).json(result['body']);
      }
    });
  })
}
module.exports = getAvailableFloorPlans;