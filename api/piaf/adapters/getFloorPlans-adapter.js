"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
class GetFloorPlansAdapter {
}
exports.GetFloorPlansAdapter = GetFloorPlansAdapter;
GetFloorPlansAdapter.flatten = object => {
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
GetFloorPlansAdapter.getFloorPlans = (body) => {
    return new Promise((resolve, reject) => {
        var fpList = [];
        var fpargs = {
            "tem:auth": {
                "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
                "tem:siteid": body['siteid'] || "4774078",
                "tem:username": "prom2_service",
                "tem:password": "PcFcsS7Y2Z",
                "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
                "tem:system": "OneSite"
            },
            "tem:listCriteria": {
                "tem:ListCriterion": {
                    "tem:name": body['name'] || "DateNeeded",
                    "tem:singlevalue": body['needByDate'] || "2022-11-30T00:00:00"
                }
            }
        };
        var args = {
            "tem:auth": {
                "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
                'tem:siteid': body['siteid'] || "4774078",
                "tem:username": "prom2_service",
                "tem:password": "PcFcsS7Y2Z",
                "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
            } //System is Sensitive to ","s and will think this is circular
        };
        RPXclient(function (client) {
            client.getfloorplanlistAsync(args).then(output => {
                client.getunitlist(fpargs, function (err, result) {
                    if (result['getunitlistResult']) {
                        var allFP = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'];
                        allFP.forEach((fp) => {
                            if (Array.isArray(fpList)) {
                                fpList.push(fp.FloorPlan.FloorPlanName);
                            }
                        });
                    }
                });
                if (output.length > 0
                    && output[0]["getfloorplanlistResult"]
                    && output[0]["getfloorplanlistResult"]["GetFloorPlanList"]
                    && output[0]["getfloorplanlistResult"]["GetFloorPlanList"]["FloorPlanObject"]) {
                    output = output[0]["getfloorplanlistResult"]["GetFloorPlanList"]["FloorPlanObject"];
                    if (Array.isArray(output) == false) {
                        output = [output];
                    }
                    //fpList.forEach((fp) => {
                    //    output = output.filter(function( obj ) {
                    //         return obj.FloorPlanName === ;
                    //    });
                    //});
                    //output = output.filter(function(item) {
                    //    return fpList.find(item.FloorPlanName);
                    //})
                    //console.log('Raju Output-> '+JSON.stringify(output));
                    resolve(output);
                }
                else {
                    reject(output);
                }
            }).catch((error) => {
                reject(error);
            });
        });
    });
};
//# sourceMappingURL=getFloorPlans-adapter.js.map