const axios = require("axios").default;
import * as express from "express";
var RPXclient = require("../services/RPX-service");
const confirmSelfGuidedTours = (req: express.Request, res: express.Response) => {
  var body = req.body || {};
  var authSF = {
    method: "post",
    url:
        "https://awsprg01b.prom-online.com/services/oauth2/token",
    headers: {
    },
    data: {}
  }
  console.log('Details here ');
  console.log('Start of self guided tour confirmation...'+body['Tour']['Id']+', '+body['Tour']['Property']['Name']);
  var tourInput = {
    tourId: body['Tour']['Id'],
    tourStartTime: body['Tour']['StartTime'],
    tourEndTime: body['Tour']['EndTime'],
    propertyId: body['Tour']['Property']['Id'],
    propertyName: body['Tour']['Property']['Name'],
    status: body['Tour']['Status'],
    prospectId: body['Tour']['Prospect']['Id'],
    prospectFN: body['Tour']['Prospect']['Firstname'],
    prospectLN: body['Tour']['Prospect']['Lastname'],
    prospectEmail: body['Tour']['Prospect']['Email'],
    prospectPhone: body['Tour']['Prospect']['Phone']
};

  axios(authSF).then(function (auth) {
    console.log('Calling SF to send tour info');
      var callSF = {
        method: "post",
        url:
          "https://prometheusreg.my.salesforce.com/services/apexrest/v1/tour24",
        headers: {
          Authorization: "Bearer " + auth['data']['access_token'],
          "content-type": "text/plain",
          Cookie: "BrowserId=zDWCBVPKEeu2Xe3l8vjfvw",
        },
        data: tourInput,
      }
      console.log('call SF .'+JSON.stringify(callSF));
      axios(callSF)
      .then(function (response) {
        //var qrep = JSON.parse(response.data);
        console.log('Web Hook Response -> '+response.data);
        res.send("Success Transaction");
      })                        
  });
}

module.exports = confirmSelfGuidedTours;