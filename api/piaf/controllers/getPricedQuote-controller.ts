var pmcidlookuptable = require("../lookup/pmcidlookup");
import * as moment from 'moment';
import * as express from "express";
var RPXclient = require("../services/RPX-service");
const getPricedQuote = (req: express.Request, res: express.Response) => {
  //DEPRECIATED CALL PLEASE USE GETPRICEDQUOTE2
  var body = req.body || {};
  //Step1 Find Property Pricing
  console.log("STEP 1 Start");
  var pricingargs = {
    "tem:auth": {
      "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
      "tem:siteid": body['siteid'] || "4632028",
      "tem:username": "prom2_service",
      "tem:password": "PcFcsS7Y2Z",
      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
    } //System is Sensitive to ","s and will think this is circular
  };
  pricingargs['tem:listCriteria'] = [
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
  RPXclient(function (client) {
    client.getunitlist(pricingargs, function (err, result) {
      //console.log(JSON.stringify(result, undefined, 4));
      if (result['getunitlistResult']
        && result['getunitlistResult']['GetUnitList']
        && result['getunitlistResult']['GetUnitList']['UnitObjects']
        && result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) {
        result = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'];
        var property;
        if (body['unit'] && body['building']) {
          property = result.find(elem =>
            (
              elem['Address']
              && elem['Address']['UnitID']
              && elem['Address']['UnitID'] == body['unit']
              && elem['Address']['BuildingID']
              && elem['Address']['BuildingID'] == body['building']
            )
          );
        }
        if (body['unitnumber']) {
          property = result.find(elem =>
            (
              elem['Address']
              && elem['Address']['UnitNumber']
              && elem['Address']['UnitNumber'] == body['unitnumber']
            ));
        }
        console.log(property);
        if ( property
          && property["RentMatrix"]
          && property["RentMatrix"]["Rows"]
          && property["RentMatrix"]["Rows"]['Row']
          && property["RentMatrix"]["Rows"]['Row']['Options']) {
          var unitnumber = property['Address']['UnitNumber'];
          var building = property['Address']['BuildingNumber'];
          var options = property["RentMatrix"]["Rows"]['Row']['Options'];
          //console.log(JSON.stringify(options, undefined, 4));
          var leasestartdate = options[0]['attributes']['LeaseStartDate'];
          var option = options[0]['Option'].find(elem =>
            (
              elem["attributes"]
              && elem["attributes"]["LeaseTerm"]
              && elem["attributes"]["LeaseTerm"] == body['leasetermmonths']
            )
          );
          if (option) {
            //Clean Rent Matrix from Property
            delete property['RentMatrix'];
            //STEP2 Create Quote
            console.log("STEP 2 Start");
            var createquoteargs = {
              "tem:auth": {
                "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
                "tem:siteid": body['siteid'] || "4632028",
                "tem:username": "prom2_service",
                "tem:password": "PcFcsS7Y2Z",
                "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
                "tem:system": "OneSite"
              },
              "tem:quote": {
                "tem:guestcardid": body['guestcardid'] || "9016030",
                "tem:leasetermmonths": body['leasetermmonths'] || "0",
                "tem:monthelypaymentscheduleid": "0", //forces to recalculate payment schedule
                "tem:quoteid": "0",
                "tem:deposit": body['deposit'] || "0",
                "tem:expirationdate": body['expirationdate'] || moment().add(1, "days").format("YYYY-MM-DD"),
                "tem:leasestartdate": body['leasestartdate'] || moment(leasestartdate, "MM/DD/YYYY").format("YYYY-MM-DD") || moment().format("YYYY-MM-DD"),
                "tem:moveindate": body['leasestartdate'] || moment(leasestartdate, "MM/DD/YYYY").format("YYYY-MM-DD") || moment().format("YYYY-MM-DD"),
                "tem:moveoutdate": body['leaseenddate'] || moment(option['attributes']['LeaseEndDate'], "MM/DD/YYYY").format("YYYY-MM-DD") || moment().format("YYYY-MM-DD"),
                "tem:rent": body['rent'] || option['attributes']['Rent'] || "1",
                "tem:quotetype": "QUOTE",
                "tem:unit": unitnumber,
                "tem:building": building || body['building'] || "",
                "tem:leaseingagentid": body['leaseingagentid'] || "0"
              }
            }
            console.log(JSON.stringify(createquoteargs, undefined, 4));
            RPXclient(function (client) {
              client.createquote(createquoteargs, function (err, result) {
                //console.log(JSON.stringify(result, undefined, 4));
                if (result['createquoteResult']
                  && result['createquoteResult']['CreateQuoteResult']
                  && !result['createquoteResult']['CreateQuoteResult']['message']) {
                  var quoteid = result['createquoteResult']['CreateQuoteResult']['QuoteID'];
                  //STEP3 Get Payment Schedule
                  console.log("STEP 3 Start");
                  var args = {
                    "tem:auth": {
                      "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
                      "tem:siteid": body['siteid'] || "4632028",
                      "tem:username": "prom2_service",
                      "tem:password": "PcFcsS7Y2Z",
                      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
                      "tem:system": "OneSite"
                    },
                    "tem:quoteid": quoteid
                  }
                  RPXclient(function (client) {
                    client.getpaymentschedule(args, function (err, result) {
                      console.log(JSON.stringify(result, undefined, 4));
                      if (result['getpaymentscheduleResult'] && result['getpaymentscheduleResult']['GetPaymentSchedule']) {
                        result = result['getpaymentscheduleResult']['GetPaymentSchedule'];
                        result['Property'] = property;
                        result['Pricematrix'] = option;
                        res.status(200).json(result);
                      }
                      else {
                        console.log(result['body']);
                        res.status(400).json(result['body']);
                      }
                      //console.log(client.lastRequest);
                    });
                  })
                }
                else {
                  if (result['createquoteResult']['CreateQuoteResult']['message']) {
                    console.log(result['createquoteResult']['CreateQuoteResult']);
                    res.status(400).json(result['createquoteResult']['CreateQuoteResult']);
                  }
                  else {
                    console.log(result['body']);
                    res.status(400).json(result['body']);
                  }
                }
                //console.log(client.lastRequest);
              });
            })
          }
          else {
            //Cant Find LeaseTermDates
            console.log("cant find leasetermmonths");
            res.status(400).json("cant find leasetermmonths");
          }
        }
        else {
          //PropertyUnit or RentMatrix not found;
          console.log("cant find property and/or rent matrix");
          res.status(400).json("cant find property and/or rent matrix");
        }
      }
      else {
        //General Error
        console.log(result['body']);
        res.status(400).json(result['body']);
      }
    });
  });































  /*

  var args = {
    "tem:auth": {
      "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
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
  }
  RPXclient(function (client) {
    client.createquote(args, function (err, result) {
      //console.log(JSON.stringify(result, undefined, 4));
      if (result['createquoteResult'] && result['createquoteResult']['CreateQuoteResult'] && !result['createquoteResult']['CreateQuoteResult']['message']) {
        res.status(200).json(result['createquoteResult']['CreateQuoteResult']);
      }
      else {
        if (result['createquoteResult']['CreateQuoteResult']['message']) {
          res.status(400).json(result['createquoteResult']['CreateQuoteResult']);
        }
        else {
          res.status(400).json(result['body']);
        }
      }
      //console.log(client.lastRequest);
    });
  })
  */
}
module.exports = getPricedQuote;