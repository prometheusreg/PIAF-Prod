"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var moment = require("moment");
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const logging_adapter_1 = require("../adapters/logging-adapter");
const insertProspect = (req, res) => {
    //console.log(req.body);
    var test = {
        "Bearer": req.body['bearer'] || "None",
        "Call": "ProxyInsertProspect"
    };
    logging_adapter_1.default['createOrUpdate'](test).then(result => { console.log(result); });
    var body = req.body || {};
    var args = {
        "tem:auth": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
            "tem:system": "OneSite"
        },
        "tem:guestcard": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:contacttype": "R0000001",
            "tem:datecontact": moment().format("YYYY-MM-DDTHH:mm:ss"),
            "tem:prospects": {
                "tem:Prospect": {
                    "tem:pmcid": body['pmcid'] || "1240034",
                    "tem:siteid": body['siteid'] || "4632028",
                    "tem:firstname": body['firstname'] || "",
                    "tem:middlename": body['middlename'] || "",
                    "tem:lastname": body['lastname'] || "",
                    "tem:email": body['email'] || ""
                }
            }
        }
    };
    if (body['phonenumber']) {
        args['tem:guestcard']['tem:prospects']['tem:Prospect']['tem:numbers'] = {
            "tem:phonenumbers": {
                "tem:PhoneNumber": {
                    "tem:type": "Mobile",
                    "tem:number": body['phonenumber'].match(/\d+/) + ""
                }
            }
        };
    }
    if (body['aptminute']
        && body['apthour']
        && body['aptday']
        && body['aptmonth']
        && body['aptyear']
        && body['aptpmcid']
        && body['aptsiteid']) {
        console.log("set up appointment");
        args['tem:guestcard']['tem:appointment'] = {
            "tem:day": body['aptday'],
            "tem:hour": body['apthour'],
            "tem:minute": body['aptminute'],
            "tem:month": body['aptmonth'],
            "tem:year": body['aptyear'],
            "tem:pmcid": body['aptpmcid'],
            "tem:siteid": body['aptsiteid']
        };
    }
    RPXclient(function (client) {
        client.insertprospect(args, function (err, result) {
            //console.log(JSON.stringify(result, undefined, 4));
            if (result['insertprospectResult'] && result['insertprospectResult']['InsertProspectResponse']) {
                result = result['insertprospectResult']['InsertProspectResponse'];
                //Shim to Apply guestcardID to CustomerID:
                if (result['Guestcard'] && result['Guestcard']['ID']) {
                    var guestcardID = result['Guestcard']['ID'];
                    if (result['Customers'] && result['Customers']['CustomerID']) {
                        result['Customers']['CustomerID'] = guestcardID;
                    }
                    if (result['CustomerResults'] && result['CustomerResults']['CustomerResult'] && result['CustomerResults']['CustomerResult']['CustomerID']) {
                        result['CustomerResults']['CustomerResult']['CustomerID'] = guestcardID;
                    }
                }
                //EndShim
                res.status(200).json(result);
            }
            else {
                res.status(400).json(result['body']);
            }
            //console.log(client.lastRequest);
        });
    });
};
module.exports = insertProspect;
//# sourceMappingURL=proxyInsertProspect-controller.js.map