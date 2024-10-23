import * as moment from "moment";
import * as _ from "lodash";

var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");

export class GetUnitListAdapter {
    static flatten = object => {
        return Object.assign({}, ...function _flatten(objectBit, path = '') {  //spread the result into our return object
            return [].concat(                                                       //concat everything into one level
                ...Object.keys(objectBit).map(                                      //iterate over object
                    key => typeof objectBit[key] === 'object' ?                       //check if there is a nested object
                        _flatten(objectBit[key], `${path}/${key}`) :              //call itself if there is
                        ({ [`${path}/${key}`]: objectBit[key] })                //append object with it�s path as key
                )
            )
        }(object));
    };

    static getUnitList = (body: any): Promise<any> => {
        return new Promise((resolve: Function, reject: Function) => {
            var args = {
                "tem:auth": {
                  "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
                  "tem:siteid": body['siteid'] || "4774078",
                  "tem:username": "prom2_service",
                  "tem:password": "PcFcsS7Y2Z",
                  "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
                  "tem:system": "OneSite"
                },
                "tem:listCriteria": {
                  "tem:listCriterion" : {
                    "tem:name": body['name'] || "DateNeeded",
                    "tem:singlevalue":body['needByDate'] || "2022-11-30T00:00:00"
                  }
                }
              };
            RPXclient(function (client) {
                console.log('Kris reaching adapter...');
                client.getunitListAsync(args).then(output => {
                    //resolve(output);
                    console.log('Kris Length '+output.length);
                    if (output.length > 0
                        && output[0]['getunitlistResult']
                        && output[0]['getunitlistResult']['GetUnitList']
                        && output[0]['getunitlistResult']['GetUnitList']['UnitObjects']
                        && output[0]['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) {
                        output = output[0]['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'];
                        output.forEach((unitAvail) => {
                            console.log('Kris '+unitAvail.FloorPlanName);
                        });
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
    }
}