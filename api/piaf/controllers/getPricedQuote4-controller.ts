var pmcidlookuptable = require("../lookup/pmcidlookup");
import * as moment from 'moment';
import * as express from "express";
var RPXclient = require("../services/RPX-service");
const getPricedQuote4 = (req: express.Request, res: express.Response) => {
    var body = req.body || {};
    var pricingargs = {
        "tem:auth": {
        "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
        "tem:siteid": body['siteid'] || "4632028",
        "tem:username": "prom2_service",
        "tem:password": "PcFcsS7Y2Z",
        "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
        }
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
    if (body['building']) {
        pricingargs['tem:listCriteria'] = [...pricingargs['tem:listCriteria'],
            {
                "tem:ListCriterion": {
                "tem:name": "BuildingNumber",
                "tem:singlevalue": body['building']
                 }
            }
        ]
    }
    RPXclient(function (client) {
    client.getunitlist(pricingargs, function (err, result) {
        if (result['getunitlistResult']
            && result['getunitlistResult']['GetUnitList']
            && result['getunitlistResult']['GetUnitList']['UnitObjects']
            && result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject']) {
                result = result['getunitlistResult']['GetUnitList']['UnitObjects']['UnitObject'];
                if (Array.isArray(result) == false) {
                    result = [result];
                }
                var property;
                if (body['unit'] && body['building']) {
                    property = result.find(elem =>
                        (
                            elem['Address']
                            && elem['Address']['UnitNumber']
                            && elem['Address']['UnitNumber'] == body['unit']
                      		&& elem['Address']['BuildingNumber']
                            && elem['Address']['BuildingNumber'] == body['building']
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
                if (property
                    && property["RentMatrix"]
                    && property["RentMatrix"]["Rows"]
                    && property["RentMatrix"]["Rows"]['Row']
                    && property["RentMatrix"]["Rows"]['Row']['Options']) 
                {
                        var unitnumber = property['Address']['UnitNumber'];
                        var building = property['Address']['BuildingNumber'];
                        var options = property["RentMatrix"]["Rows"]['Row']['Options'];
                        var dateNeededString = body["dateNeeded"];
                        var newDateFormat,dateString, monthString, yearString;
                        if (dateNeededString.substring(5,6)==="0") {
                            monthString = dateNeededString.substring(6,7);
                        } else {
                            monthString = dateNeededString.substring(5,7);
                        }
                        if (dateNeededString.substring(8,9)==="0"){
		                  	dateString = dateNeededString.substring(9,10);
                        } else {
			                dateString = dateNeededString.substring(8,10);
		                }
		                newDateFormat = monthString+'/'+dateString+'/'+dateNeededString.substring(0,4);
                        var lsdArrayIndex = options.findIndex(elem => 
                           (elem["attributes"]["LeaseStartDate"] == newDateFormat ));
                        var leasestartdate = options[lsdArrayIndex]['attributes']['LeaseStartDate'];
                        var optionsObj = options[lsdArrayIndex]['Option'];
                        if (Array.isArray(optionsObj) == false) {
                            optionsObj = [options[lsdArrayIndex]['Option']];
                        }
                        var option = optionsObj.find(elem =>
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
                            var quoteargs = {
                                    "tem:guestcardid": body['guestcardid'] || "9016030",
                                    "tem:leasetermmonths": body['leasetermmonths'] || "0",
                                    "tem:monthelypaymentscheduleid": "0", //forces to recalculate payment schedule
                                    "tem:quoteid": "0",
                                    "tem:deposit": body['deposit'] || "0",
                                    "tem:expirationdate": body['expirationdate'] || moment().add(1, "days").format("YYYY-MM-DD"),
                                    "tem:leasestartdate": body['dateNeeded'] || body['leasestartdate'] || moment(leasestartdate, "MM/DD/YYYY").format("YYYY-MM-DD") || moment().format("YYYY-MM-DD"),
                                    "tem:moveindate": body['dateNeeded'] || body['leasestartdate'] || moment(leasestartdate, "MM/DD/YYYY").format("YYYY-MM-DD") || moment().format("YYYY-MM-DD"),
                                    "tem:rent": body['rent'] || option['attributes']['Rent'] || "1",
                                    "tem:quotetype": "QUOTE",
                                    "tem:unit": unitnumber,
                                    "tem:building": building || body['building'] || "",
                                    "tem:leaseingagentid": body['leaseingagentid'] || "0"
                            }
                            if (body['concessionsList']){
                                var cargs = {};
                                var cList = JSON.parse("["+body['concessionsList']+']');
                                var Concession = [];
                                var tempconcession = {};
                                for (var c1=0; c1<cList.length; c1++){
                                    tempconcession = {
                                        "tem:id": cList[c1]
                                    }
                                    Concession[c1] = {
                                        "tem:id": cList[c1] 
                                    }
                                }
                                cargs['tem:Concession']=tempconcession;
                                //cargs['tem:Concession']=Concession;
                                quoteargs['tem:selectedconcession']=cargs;
                            }
                            var createquoteargs = {
                                "tem:auth": {
                                    "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240034",
                                    "tem:siteid": body['siteid'] || "4632028",
                                    "tem:username": "prom2_service",
                                    "tem:password": "PcFcsS7Y2Z",
                                    "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
                                    "tem:system": "OneSite"
                                    }
                            }
                            createquoteargs['tem:quote'] = quoteargs;
                            RPXclient(function (client) {
                                client.createquote(createquoteargs, function (err, result) {
                                if (result['createquoteResult']
                                    && result['createquoteResult']['CreateQuoteResult']
                                    && !result['createquoteResult']['CreateQuoteResult']['message']) {
                                        var quoteid = result['createquoteResult']['CreateQuoteResult']['QuoteID'];
                                        //STEP3 Get Payment Schedule
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
                                            if (result['getpaymentscheduleResult'] && result['getpaymentscheduleResult']['GetPaymentSchedule']) {
                                                result = result['getpaymentscheduleResult']['GetPaymentSchedule'];
                                                result['Property'] = property;
                                                result['Pricematrix'] = option;
                                                //Massaging section to make responce look like RPA response
                                                var RPAresult = { ...result['Quote'] }
                                                RPAresult['CreateDate']     = moment(RPAresult['CreateDate']).format("YYYY-MM-DD");
                                                RPAresult['ExpirationDate'] = moment(RPAresult['ExpirationDate']).format("YYYY-MM-DD");
                                                RPAresult['LeaseStartDate'] = moment(RPAresult['LeaseStartDate']).format("YYYY-MM-DD");
                                                RPAresult['MoveInDate']     = moment(RPAresult['MoveInDate']).format("YYYY-MM-DD");
                                                RPAresult['MoveOutDate']    = moment(RPAresult['MoveOutDate']).format("YYYY-MM-DD");
                                                RPAresult['Schedule']       = [];
                                                try {
                                                    if (Array.isArray(result['PaymentSchedule']['Schedule']) == false) {
                                                        result['PaymentSchedule']['Schedule'] = JSON.parse('['+JSON.stringify(result['PaymentSchedule']['Schedule'])+']');
                                                    }
                                                } catch {
                                                    console.log('error in schedule type validation');
                                                }
                                                for (var i = 0; i < result['PaymentSchedule']['Schedule'].length; i++) {
                                                    var monthkeys = Object.keys(result['PaymentSchedule']['Schedule'][i]['Months'])
                                                    for (var j = 0; j < monthkeys.length; j++) {
                                                        var RPApush               = JSON.parse(JSON.stringify(result['PaymentSchedule']['Schedule'][i]));
                                                        RPApush['BillingEndDate'] = moment(new Date(result['PaymentSchedule']['Schedule'][i]['BillingEndDate'])).format("YYYY-MM-DD");
                                                        RPApush['MonthName']      = monthkeys[j];
                                                        RPApush['MonthlyRent']    = result['PaymentSchedule']['Schedule'][i]['Months'][monthkeys[j]];
                                                        RPAresult['Schedule'].push(RPApush);
                                                    }
                                                }
                                                for (var i = 0; i < RPAresult['Schedule'].length; i++) {
                                                    delete RPAresult['Schedule'][i]['Months'];
                                                }
                                                res.status(200).json(RPAresult);
                                            }
                                            else {
                                                res.status(400).json(result['body']);
                                            }
                                        });
                                    })
                                }
                                else {
                                    if (result['createquoteResult']
                                        && result['createquoteResult']['CreateQuoteResult']
                                        && result['createquoteResult']['CreateQuoteResult']['message']) {
                                        res.status(400).json(result['createquoteResult']['CreateQuoteResult']);
                                    }
                                    else {
                                        res.status(400).json(result['body']);
                                    }
                                }
                            });
                        })
                    }
                    else {
                        //Cant Find LeaseTermDates
                        res.status(400).json("cant find leasetermmonths");
                        console.log("cant find leasetermmonths")
                    }
                }
                else {
                    var args = {
                       "tem:auth": {
                       "tem:pmcid"      : pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240715",
                       "tem:siteid"     : body['siteid'] || "4632028",
                       "tem:username"   : "prom2_service",
                       "tem:password"   : "PcFcsS7Y2Z",
                       "tem:licensekey" : "5f68389a-a068-4cc3-8e57-671a593eeaa2",
                       "tem:system"     : "OneSite"
                        },
                        "tem:quote": {
                            "tem:guestcardid"              : body['guestcardid'] || "9016030",
                            "tem:leasetermmonths"          : body['leasetermmonths'] || "0",
                            "tem:monthelypaymentscheduleid": body['monthelypaymentscheduleid'] || "0",
                            "tem:quoteid"                  : "0",
                            "tem:deposit"                  : body['deposit'] || "0",
                            "tem:expirationdate"           : body['expirationdate'] || moment().add(1, "months").format("YYYY-MM-DD"),
                            "tem:leasestartdate"           : body['dateNeeded'] || body['leasestartdate'] || moment().format("YYYY-MM-DD"),
                            "tem:moveindate"               : body['dateNeeded'] || body['moveindate'] || moment().format("YYYY-MM-DD"),
                            "tem:moveoutdate"              : body['moveoutdate'] || moment().format("YYYY-MM-DD"),
                            "tem:rent"                     : property.EffectiveRent || body['rent'] || "1",
                            "tem:quotetype"                : "QUOTE",
                            "tem:unit"                     : body['unitnumber'] || "",
                            "tem:building"                 : body['building'] || "",
                            "tem:leaseingagentid"          : body['leaseingagentid'] || "0"
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
                        });
                    })
                }
            }
            else {
               //General Error
                res.status(400).json(result['body']);
                //console.log(result['body']);
            }
        });
    });
    console.log('In createQuote End -> '+Date());

}
module.exports = getPricedQuote4;