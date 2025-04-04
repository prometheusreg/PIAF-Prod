"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var fs = require('fs');
const logging_adapter_1 = require("../adapters/logging-adapter");
var pmcidlookuptable = require("../lookup/pmcidlookup");
var outpath = "./getMountainViewPricing.json";
var RPXclient = require("../services/RPX-service");
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
const proxyGetPricing = (req, res) => {
    var body = req.body || {};
    var test = {
        "Bearer": req.body['bearer'] || "None",
        "Call": "ProxyGetPricing"
    };
    logging_adapter_1.default['createOrUpdate'](test).then(result => { console.log(result); });
    var args = {
        "tem:auth": {
            "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
        } //System is Sensitive to ","s and will think this is circular
    };
    var MountainViewSiteIDS = body['siteids'] || [
        "4495429",
        "4495429",
        "4500556",
        "3848844",
        "4004472",
        "1008335",
        "2294770",
        "1970361",
        "1241363",
        "1241238",
        "3845447",
        "3845447",
        "3578246",
        "3646139",
        "3578242",
        "2757018",
        "2366799",
        "2294770",
        "1970361",
        "1241361",
        "1241363",
        "1241238",
        "1023269",
        "1008335",
        "1012247",
        "2366799",
        "3578246",
        "4004472",
        "1012247",
        "3646139",
        "3848844",
        "2757018",
        "1241361",
        "1023269",
        "3578242"
    ];
    if (body['beds'] && body['baths'] && body['dateNeeded']) {
        args['tem:listCriteria'] = [
            {
                "tem:ListCriterion": {
                    "tem:name": "NumberBathrooms",
                    "tem:singlevalue": body['baths']
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "NumberBedrooms",
                    "tem:singlevalue": body['beds']
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "DateNeeded",
                    "tem:singlevalue": body['dateNeeded']
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "LimitResults",
                    "tem:singlevalue": "false"
                }
            },
            {
                "tem:ListCriterion": {
                    "tem:name": "IncludeAllLeaseTerms",
                    "tem:singlevalue": "true"
                }
            }
        ];
    }
    else {
        if (body['dateNeeded']) {
            args['tem:listCriteria'] = [
                {
                    "tem:ListCriterion": {
                        "tem:name": "DateNeeded",
                        "tem:singlevalue": body['dateNeeded']
                    }
                },
                {
                    "tem:ListCriterion": {
                        "tem:name": "LimitResults",
                        "tem:singlevalue": "false"
                    }
                },
                {
                    "tem:ListCriterion": {
                        "tem:name": "IncludeAllLeaseTerms",
                        "tem:singlevalue": "true"
                    }
                }
            ];
        }
    }
    RPXclient(function (client) {
        var PromiseArray = [];
        for (var i = 0; i < MountainViewSiteIDS.length; i++) {
            PromiseArray.push(client.getunitlistAsync((function generate(ID) {
                var temparg = args;
                temparg['tem:auth']['tem:pmcid'] = pmcidlookuptable[MountainViewSiteIDS[ID]] || body['pmcid'] || "1240034";
                temparg['tem:auth']['tem:siteid'] = MountainViewSiteIDS[ID];
                return temparg;
            })(i)));
        }
        Promise.all(PromiseArray).then((resultarray) => {
            //console.log(resultarray);
            var output = [];
            for (var i = 0; i < resultarray.length; i++) {
                var result = resultarray[i][0];
                if (result['getunitlistResult']
                    && result['getunitlistResult']['GetUnitList']
                    && result['getunitlistResult']['GetUnitList']['UnitObjects']
                    && result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) {
                    for (var j = 0; j < result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'].length; j++) {
                        var pricingMatrix = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['RentMatrix'] || {};
                        delete result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['RentMatrix'];
                        delete result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['PropertyNumberID'];
                        var outputi = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]; //flatten(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]);
                        outputi['PropertyNumberID'] = MountainViewSiteIDS[i];
                        outputi['RentMatrix'] = pricingMatrix;
                        output.push(outputi);
                    }
                    //console.log(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']);
                }
            }
            //fs.writeFileSync(outpath, output)
            res.status(200).json(output);
        }).catch((error) => {
            res.status(400).json(error['body']);
            //console.log(error);
            //console.log(client.lastRequest);
        });
    });
};
module.exports = proxyGetPricing;
//# sourceMappingURL=proxyGetPricing-controller.js.map