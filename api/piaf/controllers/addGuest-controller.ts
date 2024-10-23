var args = {
  "tem:auth": {
    "tem:pmcid": "1240715",
    "tem:username": "prom2_service",
    "tem:password": "PcFcsS7Y2Z",
    "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
  },
  "tem:getsubscriptions":{
  }
  //"tem:addnewcustomertoguestcard": {
  //  "tem:guestcardid": 31018877,
  //  "tem:prospects": {
  //    "tem:Prospect": {
  //      "tem:pmcid": 1111111,
  //      "tem:siteid": 1010101,
  //      "tem:customerid": 25004575,
  //      "tem:firstname": "John",
  //      "tem:middlename": "Harold",
  //      "tem:lastname": "Jones",
  //      "tem:email": "JHJ@email.com",
  //      "tem:relationshipid": "ADULTCHH"
  //    }
  //  }
  //}
};

import * as express from "express";
var RPXclient = require("../services/RPX-service");
const addGuest = (req: express.Request, res: express.Response) => {
  RPXclient(function (client) {
    client.getsubscriptions(args, function (err, result) {
      if (result['getsubscriptionsResult'] && result['getsubscriptionsResult']['GetSiteSubscription']) {
        for (var i = 0; i < result['getsubscriptionsResult']['GetSiteSubscription'].length; i++) {
          console.log(result['getsubscriptionsResult']['GetSiteSubscription'][i]);
        }
      }
      console.log(client.lastRequest);
    });
  })
}
module.exports = addGuest;