"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const createQuote = (req, res) => {
    var body = req.body || {};
    var args = {
        "tem:auth": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240715",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        },
        "tem:quote": {
            "tem:guestcardid": body['guestcardid'] || "9016030",
            "tem:leasetermmonths": body['leasetermmonths'] || "0",
            "tem:monthelypaymentscheduleid": body['monthelypaymentscheduleid'] || "0",
            "tem:quoteid": "0",
            "tem:deposit": body['deposit'] || "0",
            "tem:expirationdate": body['expirationdate'] || moment().add(1, "months").format("YYYY-MM-DD"),
            "tem:leasestartdate": body['leasestartdate'] || moment().format("YYYY-MM-DD"),
            "tem:moveindate": body['moveindate'] || moment().format("YYYY-MM-DD"),
            "tem:moveoutdate": body['moveoutdate'] || moment().format("YYYY-MM-DD"),
            "tem:rent": body['rent'] || "1",
            "tem:quotetype": "QUOTE",
            "tem:unit": body['unit'] || "",
            "tem:building": body['building'] || "",
            "tem:leaseingagentid": body['leaseingagentid'] || "0"
        }
    };
    RPXclient(function (client) {
        client.createquote(args, function (err, result) {
            //console.log(JSON.stringify(result, undefined, 4));
            if (result['createquoteResult'] && result['createquoteResult']['CreateQuoteResult']) {
                res.status(200).json(result['createquoteResult']['CreateQuoteResult']);
            }
            else {
                res.status(400).json(result['body']);
            }
            //console.log(client.lastRequest);
        });
    });
};
module.exports = createQuote;
//# sourceMappingURL=fetchQuoteByGuestCard-controller.js.map