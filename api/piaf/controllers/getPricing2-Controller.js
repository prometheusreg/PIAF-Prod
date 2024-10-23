"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var pmcidlookuptable = require("../lookup/pmcidlookup");
var outpath = "./getMountainViewPricing.json";
const getPricing2_adapter_1 = require("../adapters/getPricing2-adapter");
const getPricing = (req, res) => {
    var body = req.body || {};
    getPricing2_adapter_1.GetPricingAdapter.getPricing(body).then((output) => {
        res.status(200).json(output);
    }).catch((error) => {
        res.status(400).json(error);
    });
};
module.exports = getPricing;
//# sourceMappingURL=getPricing2-controller.js.map