var fs = require('fs');
const getPrice2 = require("../adapters/getPrice-adapter");
var RPXclientMain = require("../services/RPX-service");
const getPricing3 = (req, res) => {
    var body = req.body || {};

    var baseargs = {
        "tem:auth": {
            "tem:pmcid": body['pmcid'] || "1240034",
            "tem:siteid": body['siteid'] || "4632028",
            "tem:username": "prom2_service",
            "tem:password": "PcFcsS7Y2Z",
            "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2"
        },
        "tem:selectedonly":"true"
    };
    
    var unitsMap = new Map();
    RPXclientMain(function (client) {
        client.getunits(baseargs, function (err, result) { 
            if (result['getunitsResult']){
                for (var k = 0; k < result['getunitsResult']['GetUnits']['Units']['Unit'].length; k++){
                    unitsMap.set(result['getunitsResult']['GetUnits']['Units']['Unit'][k]['UnitID'],result['getunitsResult']['GetUnits']['Units']['Unit'][k]['UnitDesignationName']);
                }
                var startDate = new Date();
                startDate.setDate(startDate.getDate()+14);
                body['dateNeeded']=startDate.toJSON().slice(0,10);
                var unitList    = [];
                var priceList   = [];
                var rentList    = [];
                var finalOutput = {};
                var minRent,maxRent;
                getPrice2.GetPriceAdapter.getPricing(body,1,unitList,priceList).then((output) => 
                {
                    for (var i=0; i < output.length; i++ ){
                        unitList.push(output[i]['Address']['UnitID']);
                        if (unitsMap.get(output[i]['Address']['UnitID'])!='BMR'){
                            if (typeof(output[i]['bestRent'])=='string'){
                                rentList.push(output[i]['bestRent']);
                            }
                        }
                    }
                    if (output.length>0){
                        priceList=output;
                    }
                    startDate.setDate(startDate.getDate()+14);
                    body['dateNeeded'] = startDate.toJSON().slice(0,10);
                    getPrice2.GetPriceAdapter.getPricing(body,2,unitList,priceList).then((output) => 
                    {
                        for (var i=0; i < output.length; i++ ){
                            unitList.push(output[i]['Address']['UnitID']);
                            if (unitsMap.get(output[i]['Address']['UnitID'])!='BMR'){
                                if (typeof(output[i]['bestRent'])=='string'){
                                    rentList.push(output[i]['bestRent']);
                                }
                            }
                        }
                        if (output.length>0){
                            priceList=output;
                        }
                        startDate.setDate(startDate.getDate()+14);
                        body['dateNeeded']=startDate.toJSON().slice(0,10);
                        getPrice2.GetPriceAdapter.getPricing(body,3,unitList,priceList).then((output) => 
                        {
                            for (var i=0; i < output.length; i++ ){
                                unitList.push(output[i]['Address']['UnitID']);
                                if (unitsMap.get(output[i]['Address']['UnitID'])!='BMR'){
                                    if (typeof(output[i]['bestRent'])=='string'){
                                        rentList.push(output[i]['bestRent']);
                                    }
                                }
                            }
                            if (output.length>0){
                                priceList=output;
                            }
                            // patch to extend the availability date to 120 days for McClellan Terrace
                            if (body['siteid']=='5009682'){
                                startDate.setDate(startDate.getDate()+78);
                            } else {
                                startDate.setDate(startDate.getDate()+18);
                            }
                            body['dateNeeded']=startDate.toJSON().slice(0,10);
                            getPrice2.GetPriceAdapter.getPricing(body,4,unitList,priceList).then((output) => 
                            {
                                for (var i=0; i < output.length; i++ ){
                                    unitList.push(output[i]['Address']['UnitID']);
                                    if (unitsMap.get(output[i]['Address']['UnitID'])!='BMR'){
                                        if (typeof(output[i]['bestRent'])=='string'){
                                            rentList.push(output[i]['bestRent']);
                                        }
                                    }
                                }
                                if (output.length>0){
                                    priceList=output;
                                }
                                if (rentList.length>0){
                                    minRent = Math.min(...rentList);
                                    maxRent = Math.max(...rentList);
                                    finalOutput['rentmatrix']=priceList;
                                    finalOutput['siteid']=body['siteid'];
                                    finalOutput['minRent']=minRent;
                                    finalOutput['maxRent']=maxRent;
                                }
                                // cleanup
                                priceList=[];
                                rentList=[];
                                unitList=[];
                                //console.log('Final '+JSON.stringify(finalOutput,undefined,4));
                                res.status(200).json(finalOutput);
                            });
                        });
                    });
                }); 
            }
        })
    })
};
module.exports = getPricing3;