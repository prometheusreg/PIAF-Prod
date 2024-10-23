const axios = require("axios").default;
import * as express from "express";
import { GetFloorPlansAdapter } from "../adapters/getFloorPlans-adapter";

const getStartingPrice = (
    req: express.Request,
    res: express.Response
) => {
    var body = req.body || {};
    var inputToSF = {
        latitude: req.body.lat,
        longitude: req.body.lng,
        milesRange: req.body.radius,
    };
    var authSF = {
            method: "post",
            url:
                "https://awsprg01.prom-online.com/staging/services/oauth2/token",
            headers: {
            },
            data: {}
    }
    axios(authSF).then(function (auth) {
    var callSF = {
        method: "get",
        url:
            "https://prometheusreg--training.sandbox.my.salesforce.com/services/apexrest/v1/getNeighborhoods",
            headers: {
            Authorization: "Bearer " + auth['data']['access_token'],
            "Content-Type": "text/plain",
            Cookie: "BrowserId=zDWCBVPKEeu2Xe3l8vjfvw",
        }
    };
    axios(callSF)
        .then(function (response) {
            //console.log(response);
            if (response.data.length > 0) {
                for (var i = 0; i < response.data.length; i++) {
			        var inputToWebPricing = {
			    	    pmcid: req.body.pmcid,
				        siteid: response.data[i]['Property_External_Id__c']
			        };
					console.log('Call -> '+inputToWebPricing);
					GetFloorPlansAdapter.getFloorPlans(inputToWebPricing).then((output) => {
						if (output && output.length && output.length >= 0) {
						    var newoutput = output.reduce(
							    function (carry, iter) { 
							        if (carry['Bedrooms']) {
								        var newcarry = carry;
								        carry = {};
								        carry[newcarry['Bedrooms']] = {
									        'Bedrooms': newcarry['Bedrooms'],
									        'RentMin': newcarry['RentMin'],
									        'RentMax': newcarry['RentMax']
								        }
							        }
							        var index = iter['Bedrooms'];
							        if (index) {
								        if (!carry[index]) {
									        carry[index] = {
										        'Bedrooms': iter['Bedrooms'],
										        'RentMin': iter['RentMin'],
										        'RentMax': iter['RentMax']
									        }
								        }
								        if (parseInt(iter['RentMin']) < parseInt(carry[index]['RentMin'])) {
									        carry[index]['RentMin'] = iter['RentMin'];
								        }
								        if (parseInt(iter['RentMax']) > parseInt(carry[index]['RentMax'])) {
									        carry[index]['RentMax'] = iter['RentMax'];
								        }
							        }
							        return carry;
						        });
						        output = [];
						        for (var index in newoutput) {
						         	if (newoutput[index]['RentMin'] != '0.0000'){
							            output.push(newoutput[index]);
							        }
						        }
						        res.status(200).json(output);
						    }
						    else {
						        res.status(200).json(output);
						    }
						}).catch((error) => {
							res.status(400).json(error);
						});
                    };
                } else {
                    res.status(200).json([]);
                }
            }).catch(function (error) {
                console.log(error);
                res.status(400).json(error);
            });
        }).catch(function (error) {
        console.log(error);
         res.status(400).json(error);
    })  
};
module.exports = getStartingPrice;