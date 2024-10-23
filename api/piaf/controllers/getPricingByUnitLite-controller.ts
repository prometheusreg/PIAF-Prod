import * as express from "express";
var RPXclient = require("../services/RPX-service");
const getPricingByUnitLite = (req: express.Request, res: express.Response) => {
  var body = req.body || {};
  var ysargs = {
    "tem:auth": {
      "tem:pmcid": body['pmcid'] || "1240715",
      "tem:siteid": body['siteid'] || "4632028",
      "tem:username": "prom2_service",
      "tem:password": "PcFcsS7Y2Z",
      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
      "tem:system": "OneSite"
    }
  };

  var nonysargs = {
    "tem:auth": {
      "tem:pmcid": body['pmcid'] || "1240715",
      "tem:siteid": body['siteid'] || "4632028",
      "tem:username": "prom2_service",
      "tem:password": "PcFcsS7Y2Z",
      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
      "tem:system": "OneSite"
    }
  };

  var startDate = new Date();
  if (body['siteid']=='5177855'){
      startDate.setDate(startDate.getDate()+28);
  }
  var startDateFormatted = startDate.toJSON().slice(0,10);
  ysargs['tem:getrentmatrix'] = {
    "tem:NeededByDate": startDateFormatted,
    "tem:LeaseTerm": body['leaseTerm'] || "12",
    "tem:unitids": {"tem:int": body['unitid']},
    "tem:viewingQuoteOnly":"false"
  };

  nonysargs['tem:listCriteria'] = [
    {
      "tem:ListCriterion": {
        "tem:name": "DateNeeded",
        "tem:singlevalue":body['dateNeeded']
      }
    },
    {
        "tem:ListCriterion": {
          "tem:name": "UnitId",
          "tem:singlevalue": body['unitid']
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
  ]

  var leaseTerms = [];
  RPXclient(function (client) {
      client.retrieveleaseterms(ysargs, function (err, result) { 
          leaseTerms = result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm'];
          if (Array.isArray(result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm']) == false) {
              leaseTerms = [result['retrieveleasetermsResult']['RetrieveLeaseTermsResponse']['LeaseTerm']];
          }
      })
  })

  var ysEnabled = new String("true");
  var output = [];
  RPXclient(function (client) {
    if (body['siteid'] == '4797191' || 
        body['siteid'] == '1457641' ||
        body['siteid'] == '4655007' ||
        body['siteid'] == '4673558' ||
        body['siteid'] == '4884573' ||
        body['siteid'] == '5009682' ||
        body['siteid'] == '4989446' ||
        body['siteid'] == '5177855')
    {
        console.log('Non Yield Star '+JSON.stringify(nonysargs));
        client.getunitlist(nonysargs, function (err, result) {
            if (result['getunitlistResult']
            && result['getunitlistResult']['GetUnitList']
            && result['getunitlistResult']['GetUnitList']['UnitObjects']
            && result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) 
            {
                if (Array.isArray(result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) == false) {
                    result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'] = [result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']];
                }
                for (var j = 0; j < result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'].length; j++) {
                    var pricingMatrix = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['RentMatrix'] || {};
                    if (Object.keys(pricingMatrix).length == 0) {
                        var unitInfo = {siteId: String, 
                                            leaseStartDate: String, 
                                            availableDate: String, 
                                            minRent: String, 
                                            maxRent: String, 
                                            bestRent: String, 
                                            bestTerm: String};
                        var newDateFormat,updatedDateFormat;
                        var dateString,monthString;
                        newDateFormat = body['dateNeeded'].substring(5,7)+'/'+body['dateNeeded'].substring(8,10)+'/'+body['dateNeeded'].substring(0,4);
                        dateString = newDateFormat.substring(3,5);
                        if (dateString.substring(0,1)=='0'){
                            dateString =dateString.substring(1,2);
                        }
                        monthString = newDateFormat.substring(0,2);
                        if (monthString.substring(0,1)=='0'){
                            monthString =monthString.substring(1,2);
                        }
                        updatedDateFormat = monthString+'/'+dateString+'/'+body['dateNeeded'].substring(0,4);
                        unitInfo['siteId'] = body['siteid'];
                        unitInfo['availableDate'] = updatedDateFormat;
                        unitInfo['leaseStartDate'] = updatedDateFormat;
                        unitInfo['minRent'] = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['EffectiveRent'];
                        unitInfo['minRent'] = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['EffectiveRent'];
                        unitInfo['bestRent'] = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'][j]['EffectiveRent'];
                        unitInfo['bestTerm'] = leaseTerms[leaseTerms.length-1]['LeaseTermMonthCount'];
                        output.push(unitInfo);
                    }
                }
            }
            res.status(200).json(output);
        }) 
    } else {
        //Yield Star Branch
        client.getrentmatrix(ysargs,function (err,result) {
            console.log('In YS - '+JSON.stringify(result, undefined, 4));
            if (result['getrentmatrixResult'] && result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']) {
                for (var l = 0; l < result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['Options'].length; l++) 
                {
                    if (Array.isArray(result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['Options'][l]['Option']) == false) {
                        result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['Options'][l]['Option'] = [result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['Options'][l]['Option']];
                    }
                    for (var m =0; m<result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['Options'][l]['Option'].length; m++){
                        var unitInfo = {siteId: String, leaseStartDate: String, availableDate: String, minRent: String, maxRent: String, bestRent: String, bestTerm: String};
                        if (result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['Options'][l]['Option'][m]['attributes']['Best'] == 'true') {
                            unitInfo['siteId']=body['siteid'];
                            unitInfo['leaseStartDate' ] = result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['Options'][l]['attributes']['LeaseStartDate'];
                            unitInfo['availableDate'] = result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['attributes']['MakeReadyDate'] ;
                            unitInfo['minRent']  = result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['attributes']['MinRent'];
                            unitInfo['maxRent']  = result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['attributes']['MaxRent'];
                            unitInfo['bestRent'] = result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['Options'][l]['Option'][m]['attributes']['Rent']
                            unitInfo['bestTerm'] = result['getrentmatrixResult']['GetRentMatrix']['RentMatrices']['RentMatrix']['Rows']['Row']['Options'][l]['Option'][m]['attributes']['LeaseTerm'];
                            output.push(unitInfo);
                        }
                    }
                }
            }
            res.status(200).json(output);
        });
    }
  })
}
module.exports = getPricingByUnitLite;