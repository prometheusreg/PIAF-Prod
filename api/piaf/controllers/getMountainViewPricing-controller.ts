var fs = require('fs');

var args = {
    "tem:auth": {
      "tem:pmcid": "1240034",
      "tem:siteid": "4004472", //4004472 Moffet
      "tem:username": "prom2_service",
      "tem:password": "PcFcsS7Y2Z",
      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
  } //System is Sensitive to ","s and will think this is circular
};

var MountainViewSiteIDS = [
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

var outpath = "./getMountainViewPricing.json"

const flatten = object => {
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

import * as express from "express";
var RPXclient = require("../services/RPX-service");
const getMountainView = (req: express.Request, res: express.Response) => {
  RPXclient(function (client) {
    var PromiseArray = [];
    for (var i = 0; i < MountainViewSiteIDS.length; i++) {
      PromiseArray.push(client.getunitlistAsync((function generate(ID) {
        var temparg = args;
        temparg['tem:auth']['tem:siteid'] = MountainViewSiteIDS[ID];
        return temparg;
      })(i)));
    }
    Promise.all(PromiseArray).then((resultarray) => {
      //console.log(resultarray);
      var output = "";
      for (var i = 0; i < resultarray.length; i++) {
        var result = resultarray[i][0];
        if (result['getunitlistResult']
          && result['getunitlistResult']['GetUnitList']
          && result['getunitlistResult']['GetUnitList']['UnitObjects']
          && result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) {
          for (var j = 0; j < result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'].length; j++) {
            console.log(flatten(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]));
            output += JSON.stringify(flatten(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]));
          }
          //console.log(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']);
        }
      }
      fs.writeFileSync(outpath, output)
      res.status(200).json({ "ok": true });
    }).catch((error) => {
      console.log(error);
      console.log(client.lastRequest);
    });
  })
}
module.exports = getMountainView;