"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
var pmcidlookuptable = require("../lookup/pmcidlookup");
var outpath = "./getMountainViewPricing.json";
const flatten = object => {
    return Object.assign({}, ...function _flatten(objectBit, path = '') {
        return [].concat(//concat everything into one level
        ...Object.keys(objectBit).map(//iterate over object
        //iterate over object
        key => typeof objectBit[key] === 'object' ? //check if there is a nested object
            _flatten(objectBit[key], `${path}/${key}`) : //call itself if there is
            ({ [`${path}/${key}`]: objectBit[key] }) //append object with it�s path as key
        ));
    }(object));
};
var RPXclient = require("../services/RPX-service");
const prospectSearch = (req, res) => {
    var body = req.body || {};
    var args = {
        "tem:auth": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
            "tem:siteid": body['siteid'] || "1241361",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        },
        "tem:prospectSearchCriterion": {
            "tem:ProspectSearchCriterion": {
                "tem:lastactivitydate": {
                    "tem:datefrom": body['dateFrom'] || "2021-06-23T00:00:00",
                    "tem:dateto": body['dateTo'] || "2021-06-24T23:59:59"
                }
            }
        }
    };
    RPXclient(function (client) {
        client.prospectsearch(args, function (err, result) {
            if (result['prospectsearchResult']) {
                res.status(200).json(result);
            }
            else {
                res.status(400).json(result['body']);
            }
        });
    });
};
module.exports = prospectSearch;
//# sourceMappingURL=UATprospectSearch-controller.js.map