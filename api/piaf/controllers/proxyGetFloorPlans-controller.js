"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var pmcidlookuptable = require("../lookup/pmcidlookup");
var outpath = "./getMountainViewPricing.json";
const logging_adapter_1 = require("../adapters/logging-adapter");
const getFloorPlans_adapter_1 = require("../adapters/getFloorPlans-adapter");
const proxyGetFloorPlans = (req, res) => {
    var body = req.body || {};
    var test = {
        "Bearer": req.body['bearer'] || "None",
        "Call": "ProxyGetFloorPlans"
    };
    logging_adapter_1.default['createOrUpdate'](test).then(result => { console.log(result); });
    getFloorPlans_adapter_1.GetFloorPlansAdapter.getFloorPlans(body).then((output) => {
        res.status(200).json(output);
    }).catch((error) => {
        res.status(400).json(error);
    });
};
module.exports = proxyGetFloorPlans;
//# sourceMappingURL=proxyGetFloorPlans-controller.js.map