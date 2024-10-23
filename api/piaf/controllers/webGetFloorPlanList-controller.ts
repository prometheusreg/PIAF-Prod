var fs = require('fs');
var pmcidlookuptable = require("../lookup/pmcidlookup");
var outpath = "./getMountainViewPricing.json"
import LoggingAdapter from "../adapters/logging-adapter";
import { GetFloorPlansAdapter } from "../adapters/getFloorPlans-adapter";


import * as express from "express";

const webGetFloorPlanList = (req: express.Request, res: express.Response) => {
    var body = req.body || {};
    var test = {
        "Bearer": req.body['bearer'] || "None",
        "Call": "webGetFloorPlanList"
    };
    //LoggingAdapter['createOrUpdate'](test).then(result => { console.log(result) });
    GetFloorPlansAdapter.getFloorPlans(body).then((output) => {
        res.status(200).json(output);
    }).catch((error) => {
        res.status(400).json(error);
    });
}
module.exports = webGetFloorPlanList;