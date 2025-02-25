const axios = require("axios").default;
import * as express from "express";
var RPXclient = require("../services/RPX-service");
const confirmSelfGuidedTours = (req: express.Request, res: express.Response) => {
  var body = req.body || {};
  var authSF = {
    method: "post",
    url:
        "https://awsprg01b.prom-online.com/staging/services/oauth2/token",
    headers: {
    },
    data: {}
  }
  console.log('Reaching web quote..');

  var sfQuoteInput = {
    pmcId          : body['pmcid'] || "1240034",
    siteId         : body['siteid'],
    dateNeeded     : body['dateNeeded'],
    buildingNumber : body['buildingnumber'],
    unitNumber     : body['unitnumber'],
    leaseTerm      : body['leasetermmonths'],
    guestCardId    : body['guestcardid'],
    email          : body['email'],
    firstName      : body['firstName'],
    lastName       : body['lastName']
  }
  axios(authSF).then(function (auth) {
    console.log('Calling SF..');
      var callSF = {
        method: "post",
        url:
          "https://prometheusreg--training.sandbox.my.salesforce.com/services/apexrest/v1/tour24",
        headers: {
          Authorization: "Bearer " + auth['data']['access_token'],
          "content-type": "text/plain",
          Cookie: "BrowserId=zDWCBVPKEeu2Xe3l8vjfvw",
        },
        data: sfQuoteInput,
      }
      console.log('reaching here..');
      axios(callSF)
      .then(function (response) {
        //var qrep = JSON.parse(response.data);
        console.log('Web Hook Response -> '+response.data);
        res.send("Success");
      })                        
  });
}

module.exports = confirmSelfGuidedTours;