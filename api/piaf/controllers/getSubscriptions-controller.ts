var fs = require('fs');
var moment = require("moment");
var args = {
  "tem:auth": {
    "tem:pmcid": "1240715",
    "tem:username": "prom2_service",
    "tem:password": "PcFcsS7Y2Z",
    "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
  },
  "tem:getsubscriptions": {
  }
};

var outpath="./getSubscriptions.json"

import * as express from "express";
var RPXclient = require("../services/RPX-service");
const getSubscriptions = (req: express.Request, res: express.Response) => {
  RPXclient(function (client) {
    client.getsubscriptions(args, function (err, result) {
      if (result['getsubscriptionsResult'] && result['getsubscriptionsResult']['GetSiteSubscription']) {
        try {
          var sites = "";
          for (var i = 0; i < result['getsubscriptionsResult']['GetSiteSubscription'].length; i++) {
            if (result['getsubscriptionsResult']['GetSiteSubscription'][i]['startdate']) {
              result['getsubscriptionsResult']['GetSiteSubscription'][i]['startdateAGR'] = moment(result['getsubscriptionsResult']['GetSiteSubscription'][i]['startdate'], "MM/DD/YYYY hh:mm:ss a").format("YYYYMMDD");
            }
            sites += JSON.stringify(result['getsubscriptionsResult']['GetSiteSubscription'][i]);
          }
          fs.writeFileSync(outpath, sites)
        } catch (err) {
          console.error(err)
        }
      }
      console.log(client.lastRequest);
    });
  })
}
module.exports = getSubscriptions;