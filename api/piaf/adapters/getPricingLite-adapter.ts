import * as moment from "moment";
import * as _ from "lodash";

var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");

export class GetPricingLiteAdapter {
  static flatten = object => {
    return Object.assign({}, ...function _flatten(objectBit, path = '') {  //spread the result into our return object
      return [].concat(                                                       //concat everything into one level
        ...Object.keys(objectBit).map(                                      //iterate over object
          key => typeof objectBit[key] === 'object' ?                       //check if there is a nested object
            _flatten(objectBit[key], `${path}/${key}`) :              //call itself if there is
            ({ [`${path}/${key}`]: objectBit[key] })                //append object with it’s path as key
        )
      )
    }(object));
  };

  static getPricing = (body: any): Promise<any> => {
    return new Promise((resolve: Function, reject: Function) => {
      var args = {
        "tem:auth": {
          "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
          "tem:username": "prom2_service",
          "tem:password": "PcFcsS7Y2Z",
          "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
        } //System is Sensitive to ","s and will think this is circular
      };

      var MountainViewSiteIDS = body['siteids'] || [];

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
              "tem:name": "IncludeRentMatrix",
              "tem:singlevalue": "false"
            }
          }
        ]
      }
      else {
        if (body['dateNeeded']) {
          console.log("got to here");
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
                "tem:name": "IncludeRentMatrix",
                "tem:singlevalue": "false"
              }
            }
          ]
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
              if (Array.isArray(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) == false) {
                result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'] = [result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']];
              }
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
              //console.log(client.lastRequest);
            }
          }
          //fs.writeFileSync(outpath, output)

          resolve(output);
        }).catch((error) => {
          console.log(error['body']);
          reject(error['body']);
          //console.log(client.lastRequest);
        });
      })
    });
  }
};