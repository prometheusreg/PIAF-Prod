var fs = require('fs');
var pmcidlookuptable = require("../lookup/pmcidlookup");
var outpath = "./getMountainViewPricing.json"
import { GetPricingAdapter } from "../adapters/getPricing2-adapter";


import * as express from "express";

const getPricing = (req: express.Request, res: express.Response) => {
  var body = req.body || {};
    GetPricingAdapter.getPricing(body).then((output) => {
        res.status(200).json(output);
    }).catch((error) => {
        res.status(400).json(error);
    });
}
module.exports = getPricing;