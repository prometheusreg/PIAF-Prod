const axios = require("axios").default;
import * as express from "express";
import { GetPricingLiteAdapter } from "../adapters/getPricingLite-adapter";

const flatten = (object) => {
    return Object.assign(
        {},
        ...(function _flatten(objectBit, path = "") {
            return [].concat(
                ...Object.keys(objectBit).map((key) =>
                    typeof objectBit[key] === "object"
                        ? _flatten(objectBit[key], `${path}/${key}`)
                        : { [`${path}/${key}`]: objectBit[key] }
                )
            );
        })(object)
    );
};

const proxyGetPricingByLocation = (
    req: express.Request,
    res: express.Response
) => {
    var body = req.body || {};
    var test = {
        Bearer: req.body["bearer"] || "None",
        Call: "ProxyGetPricingByLocation",
    };

    var inputToSF = {
        latitude: req.body.lat,
        longitude: req.body.lng,
        milesRange: req.body.radius,
    };

    var authSF = {
          method: "post",
          url:
              "https://awsprg01.prom-online.com/staging/services/oauth2/token",
          headers: {
          },
          data: {}
    }
  


   //console.log("====> before calling SF =====> ");

  axios(authSF).then(function (auth) {
    //console.log(auth);
    var callSF = {
      method: "post",
      url:
        "https://prometheusreg--training.sandbox.my.salesforce.com/services/apexrest/getNeighborhoodsByLocation",
      headers: {
        Authorization: "Bearer " + auth['data']['access_token'],
        //Authorization: "Bearer 00Df0000001p3QH!AQ4AQPbjeeLP3OUgPotoefYcNBpGxSvXD2XvzveCQK0tW3RXKAeyC4n4ZANtFk7jJCstYyQ8742DtmquivpOQbW2SWFsK2tb",
        "Content-Type": "text/plain",
        Cookie: "BrowserId=zDWCBVPKEeu2Xe3l8vjfvw",
      },
      data: inputToSF,
    };

    axios(callSF)
      .then(function (response) {
        //console.log(response);
        if (response.data.length > 0) {
          var property = [];
          for (var i = 0; i < response.data.length; i++) {
            property.push(response.data[i]['Property_External_Id__c']);
            response.data[i]['entry'] = [];
            //var callRP = {
            //    url: "http://localhost:8086/proxy/v1/getPricing",
            //    method: "post",
            //    data: inputToRP,
            //    headers: { "content-type": "application/json" },
            //};
            //entry.units = [];
            //entry.units.push(
            //    axios(callRP).then(function (resp) {
            //        return resp.data;
            //    })
            //);
          };

          var inputToRP = {
            pmcid: req.body.pmcid,
            siteids: property,
            beds: req.body.beds,
            baths: req.body.baths,
            dateNeeded: req.body.dateNeeded,
          };
          //console.log(inputToRP);
          //console.log(response.data);
          GetPricingLiteAdapter.getPricing(inputToRP).then((output) => {
            for (var i = 0; i < output.length; i++) {
              //console.log("running");
              for (var j = 0; j < response.data.length; j++) {
                if (output[i]["PropertyNumberID"] == response.data[j]['Property_External_Id__c']) {
                  response.data[j]['entry'].push(output[i]);
                }
              }
            }
            res.status(200).json(response.data);
          }).catch((error) => {
            res.status(400).json(error);
          });
        } else {
          res.status(200).json([]);
        }
      })
      .catch(function (error) {
        console.log(error);
        res.status(400).json(error);
      });
  }).catch(function (error) {
    console.log(error);
    res.status(400).json(error);
  })
    
};

module.exports = proxyGetPricingByLocation;