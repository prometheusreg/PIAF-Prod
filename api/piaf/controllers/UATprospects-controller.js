"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var args = {
    "tem:auth": {
        "tem:pmcid": "1240715",
        "tem:siteid": "4632028",
        "tem:username": "prom2_service",
        "tem:password": "PcFcsS7Y2Z",
        "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
        "tem:system": "OneSite"
    },
    "tem:prospectSearchCriterion": {
        "tem:ProspectSearchCriterion": {
            "tem:guestcardid": "9016030"
        }
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
var RPXclient = require("../services/RPX-service");
const UATprospects = (req, res) => {
    RPXclient(function (client) {
        client.prospectsearch(args, function (err, result) {
            console.log(JSON.stringify(result, undefined, 4));
            //if (result['getsubscriptionsResult'] && result['getsubscriptionsResult']['GetSiteSubscription']) {
            //  for (var i = 0; i < result['getsubscriptionsResult']['GetSiteSubscription'].length; i++) {
            //    console.log(result['getsubscriptionsResult']['GetSiteSubscription'][i]);
            //  }
            //}
            console.log(client.lastRequest);
        });
    });
};
module.exports = UATprospects;
//# sourceMappingURL=UATprospects-controller.js.map