import * as express from "express";
import * as moment from "moment";
var pmcidlookuptable = require("../lookup/pmcidlookup");
var RPXclient = require("../services/RPX-service");
const getAmenities = (req: express.Request, res: express.Response) => {
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
    var args = {
    "tem:auth": {
      "tem:pmcid": pmcidlookuptable[body['siteid']] || body['pmcid'] || "1240715",
      "tem:siteid": body['siteid'] || "1023275",
      "tem:username": "prom2_service",
      "tem:password": "PcFcsS7Y2Z",
      "tem:licensekey": "5f68389a-a068-4cc3-8e57-671a593eeaa2",
      "tem:system": "OneSite"
    },
    "tem:daterange": {
        "tem:startdate":  body['startdate'] || moment().subtract(30, 'days').format("YYYY-MM-DD"),
        "tem:enddate": body['enddate'] || moment().format("YYYY-MM-DD")
      }
  };
  var floorPlansMap = new Map();
  var unitsMap = new Map();
  var unitsDetailMap = new Map();
  var finalOutput={};
  var amenityList=[];
  var aType,thisUnitId,thisUnitNumber,thisFloorPlanId,thisFloorPlanName,thisBuildingName,thisBuildingNumber;
  RPXclient(function (client) {
	    client.getfloorplans(args, function (err, result) {
		    if (result['getfloorplansResult']) {
		        for (var i = 0; i < result['getfloorplansResult']['FloorPlans']['FloorPlan'].length; i++){
					floorPlansMap.set(result['getfloorplansResult']['FloorPlans']['FloorPlan'][i]['FpID'],result['getfloorplansResult']['FloorPlans']['FloorPlan'][i]['FpName']);
				};
				client.getunits(baseargs, function (err, result) { 
					if (result['getunitsResult']){
						for (var j = 0; j < result['getunitsResult']['GetUnits']['Units']['Unit'].length; j++){
							let fpObj = {fpId: result['getunitsResult']['GetUnits']['Units']['Unit'][j]['FpID'],
							             fpName: floorPlansMap.get(result['getunitsResult']['GetUnits']['Units']['Unit'][j]['FpID'])};
							let unitObj = {unitNumber:result['getunitsResult']['GetUnits']['Units']['Unit'][j]['UnitNo'],
								           buildingNumber:result['getunitsResult']['GetUnits']['Units']['Unit'][j]['BldgNo'],
										   buildingName:result['getunitsResult']['GetUnits']['Units']['Unit'][j]['BldgName']};
							unitsDetailMap.set(result['getunitsResult']['GetUnits']['Units']['Unit'][j]['UnitID'],unitObj);
							unitsMap.set(result['getunitsResult']['GetUnits']['Units']['Unit'][j]['UnitID'],fpObj);
						}
						//console.log('FP> '+JSON.stringify(unitsMap.get("222").fpId+','+JSON.stringify(unitsMap.get("222").fpName)));
						client.getamenities(args, function (err, result) {
		                    if (result['getamenitiesResult'] && result['getamenitiesResult']['GetAmenities'] && result['getamenitiesResult']['GetAmenities']['Amenities']) {
								for (var k = 0; k < result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'].length; k++){
									if (result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['UnitID']==null && 
										result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['FloorPlanID']==null)
									{
									    aType = 'Neighborhood';
										thisUnitId=null;
										thisFloorPlanId=null;
										thisFloorPlanName=null;
										thisUnitNumber=null;
										thisBuildingName=null;
										thisBuildingNumber=null;	
									}
									if (result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['UnitID']==null && 
										result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['FloorPlanID'])
									{
									    aType = 'FloorPlan';
										thisUnitId=null;
										thisUnitNumber=null;
										thisBuildingName=null;
										thisBuildingNumber=null;	
										thisFloorPlanId=result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['FloorPlanID'];
										thisFloorPlanName=floorPlansMap.get(result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['FloorPlanID']);
									}
									if (result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['UnitID'] && 
										result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['FloorPlanID']==null)
									{
									    aType = 'Unit';	
										thisUnitId=result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['UnitID'];	
										thisUnitNumber=unitsDetailMap.get(result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['UnitID']).unitNumber;
										thisBuildingNumber=unitsDetailMap.get(result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['UnitID']).buildingNumber;
										thisBuildingName=unitsDetailMap.get(result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['UnitID']).buildingName;
										thisFloorPlanId=unitsMap.get(result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['UnitID']).fpId;
										thisFloorPlanName=unitsMap.get(result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['UnitID']).fpName;
									}
									try {
										let amenityObj = {amenityId:result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['AmenityID'],
											amenityType:aType,
											unitId:thisUnitId,
											unitNumber:thisUnitNumber,
											buildingName:thisBuildingName,
											buildingNumber:thisBuildingNumber,
											floorPlanId:thisFloorPlanId,
											floorPlanName:thisFloorPlanName,
											siteId:result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['SiteID'],
											amenityName:result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['Name'],
											amenityDescription:result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['Description'],
											amenityCode:result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['Code'],
											brochureFlag:result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['BrochureFlag'],
											displayFlag:result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['DisplayFlag'],
											brochureName:result['getamenitiesResult']['GetAmenities']['Amenities']['Amenity'][k]['BrochureName']
										   }
						                amenityList.push(amenityObj); 
									} catch (error){
                                        console.log('error -> '+error);
									}
									aType=null;  
									thisUnitId=null;  
									thisFloorPlanId=null;
									thisFloorPlanName=null;
								}
								//
								finalOutput['amenities']=amenityList;
								console.log('Final-> '+JSON.stringify(finalOutput,undefined,4));
								res.status(200).json(finalOutput);
		             	    }
		                    else {
								res.status(200).json(finalOutput);
		                    }
						});
					}
				})
		    }
		    else {
		        res.status(400).json(result['body']);
		    }
	    });
    })
}
module.exports = getAmenities;