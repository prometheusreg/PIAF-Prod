var fs = require('fs');
var pmcidlookuptable = require("../lookup/pmcidlookup");
var outpath = "./getMountainViewPricing.json"
import LoggingAdapter from "../adapters/logging-adapter";
import { GetFloorPlansAdapter } from "../adapters/getFloorPlans-adapter";


import * as express from "express";

const UATwebFloorPricing = (req: express.Request, res: express.Response) => {
    var body = req.body || {};
    var test = {
        "Bearer": req.body['bearer'] || "None",
        "Call": "webGetFloorPlanList"
    };
    LoggingAdapter['createOrUpdate'](test).then(result => { console.log(result) });
    GetFloorPlansAdapter.getFloorPlans(body).then((output) => {
    if (output && output.length && output.length >= 0) {
      //console.log('Output in first '+output);
      var newoutput = output.reduce(function (carry, iter) {
        //console.log('Carry '+carry);
        if (carry['Bedrooms']) {
          var newcarry = carry;
          carry = {};
          carry[newcarry['Bedrooms']] = {
            'Bedrooms': newcarry['Bedrooms'],
            'RentMin': newcarry['RentMin'],
            'RentMax': newcarry['RentMax']
          }
        }
        var index = iter['Bedrooms'];
        if (index) {
          if (!carry[index]) {
            carry[index] = {
              'Bedrooms': iter['Bedrooms'],
              'RentMin': iter['RentMin'],
              'RentMax': iter['RentMax']
            }
          }
          if (parseInt(iter['RentMin']) < parseInt(carry[index]['RentMin'])) {
            carry[index]['RentMin'] = iter['RentMin'];
          }
          if (parseInt(iter['RentMax']) > parseInt(carry[index]['RentMax'])) {
            carry[index]['RentMax'] = iter['RentMax'];
          }
        }
        return carry;
      });
      output = [];
      //console.log('New Output in next -> '+JSON.stringify(newoutput));
      for (var index in newoutput) {
        console.log('JSON Rent Min '+JSON.stringify(newoutput[index]['RentMin']));
        if (newoutput[index]['RentMin'] != '0.0000'){
          output.push(newoutput[index]);
        }
      }
      res.status(200).json(output);
    }
    else {
      res.status(200).json(output);
    }
    }).catch((error) => {
        res.status(400).json(error);
    });
}
module.exports = UATwebFloorPricing;