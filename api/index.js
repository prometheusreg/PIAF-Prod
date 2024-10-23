const ping = require('./piaf/controllers/ping-controller')
const testing = require('./piaf/controllers/test-controller')
const addGuest = require('./piaf/controllers/addGuest-controller');
const getSubscriptions = require('./piaf/controllers/getSubscriptions-controller');
const getMountainView = require("./piaf/controllers/getMountainViewPricing-controller");
const insertProspect = require("./piaf/controllers/insertProspect-controller");
const prospects = require("./piaf/controllers/propsects-controller");
const UATinsertProspect = require("./piaf/controllers/UATinsertProspect-controller");
const UATupdateProspect = require("./piaf/controllers/UATupdateProspect-controller");
const UATprospects = require("./piaf/controllers/UATprospects-controller");
const createQuote = require("./piaf/controllers/createQuote-controller");
const Fetchsinglequote = require("./piaf/controllers/fetchQuoteByQuoteID-controller");
const getPricing = require("./piaf/controllers/getPricing-Controller");
const getPricing2 = require("./piaf/controllers/getPricing2-Controller");
const getPricing3 = require("./piaf/controllers/getPricing3-controller");
const prospectsByDate = require("./piaf/controllers/propsectsByDate-controller");
const getUnits = require("./piaf/controllers/getUnits-controller");
const getPricedQuote = require("./piaf/controllers/getPricedQuote-controller");
const getPricedQuote2 = require("./piaf/controllers/getPricedQuote2-controller");
const getPricedQuote3 = require("./piaf/controllers/getPricedQuote3-controller");
const getPricedQuote4 = require("./piaf/controllers/getPricedQuote4-controller");
const getPaymentSchedule = require("./piaf/controllers/getPaymentSchedule-controller");
const proxyGetPricing = require("./piaf/controllers/proxyGetPricing-controller");
const proxyInsertProspect = require("./piaf/controllers/proxyInsertProspect-controller");
const proxyGetUnits = require("./piaf/controllers/proxyGetUnits-controller");
const proxyGetPricingByLocation = require("./piaf/controllers/proxyGetPricingByLocation-controller");
const updateProspect = require("./piaf/controllers/updateProspect-controller");
const prospectSearch = require("./piaf/controllers/prospectSearch-controller");
const webGetFloorPlanList = require("./piaf/controllers/webGetFloorPlanList-controller");
const webFloorPricing = require("./piaf/controllers/webFloorPricing-controller");
const webFloorPricing2 = require("./piaf/controllers/webFloorPricing2-controller");
const UATwebFloorPricing = require("./piaf/controllers/UATwebFloorPricing-controller");
const getUnitStatus = require("./piaf/controllers/getUnitStatus-controller");
const getFloorPlans = require("./piaf/controllers/getFloorPlans-controller");
const getFloorPlanList = require("./piaf/controllers/getFloorPlanList-controller");
const getLeaseInfo  = require("./piaf/controllers/getLeaseInfo-controller");
const getResidentListInfo  = require("./piaf/controllers/getResidentListInfo-controller");
const getProspectSurveyList  = require("./piaf/controllers/getProspectSurveyList-controller");
const getHouseholdSurveyList  = require("./piaf/controllers/getHouseholdSurveyList-controller");
const getResidentList  = require("./piaf/controllers/getResidentList-controller");
const getWorkOrderSurveyList  = require("./piaf/controllers/getWorkOrderSurveyList-controller");
const getPetInformation  = require("./piaf/controllers/getPetInformation-controller");
const getUnitsByProperty  = require("./piaf/controllers/getUnitsByProperty-controller");
const getUnitList  = require("./piaf/controllers/getUnitList-controller");
const getAmenities  = require("./piaf/controllers/getAmenities-controller");
const getAvailableFloorPlans  = require("./piaf/controllers/getAvailableFloorPlans-controller");
const getResidentEventsByDate = require("./piaf/controllers/getResidentEventsByDate-controller");
const getServiceRequestsByDate = require("./piaf/controllers/getServiceRequestsByDate-controller");
const getNeighborhoodSpecials = require("./piaf/controllers/getNeighborhoodSpecials-controller");
const getPricingByUnit = require("./piaf/controllers/getPricingByUnit-controller");
const getPricingByUnit2 = require("./piaf/controllers/getPricingByUnit2-controller");
const getWebQuote = require("./piaf/controllers/getWebQuote-controller");
const getUATWebQuote = require("./piaf/controllers/getUATWebQuote-controller");
const insertWebProspect = require("./piaf/controllers/insertWebProspect-controller");
const getAvailableUnits = require("./piaf/controllers/getAvailableUnits-controller");
const getPricingByUnitLite = require("./piaf/controllers/getPricingByUnitLite-controller");
const getFloorPlanStartPrice = require("./piaf/controllers/getFloorPlanStartPrice-controller");

module.exports = {
  ping,
  testing,
  addGuest,
  getSubscriptions,
  getMountainView,
  insertProspect,
  prospects,
  prospectsByDate,
  UATinsertProspect,
  UATupdateProspect,
  UATprospects,
  createQuote,
  Fetchsinglequote,
  getPricing,
  getPricing2,
  getPricing3,
  getUnits,
  getPricedQuote,
  getPricedQuote2,
  getPricedQuote3,
  getPricedQuote4,
  getPaymentSchedule,
  proxyGetPricing,
  proxyInsertProspect,
  proxyGetUnits,
  proxyGetPricingByLocation,
  updateProspect,
  webGetFloorPlanList,
  webFloorPricing,
  webFloorPricing2,
  UATwebFloorPricing,
  prospectSearch,
  getUnitStatus,
  getFloorPlans,
  getFloorPlanList,
  getLeaseInfo,
  getResidentList,
  getResidentListInfo,
  getProspectSurveyList,
  getHouseholdSurveyList,
  getWorkOrderSurveyList,
  getPetInformation,
  getUnitsByProperty,
  getUnitList,
  getAmenities,
  getAvailableFloorPlans,
  getResidentEventsByDate,
  getServiceRequestsByDate,
  getNeighborhoodSpecials,
  getPricingByUnit,
  getPricingByUnit2,
  getWebQuote,
  getUATWebQuote,
  insertWebProspect,
  getAvailableUnits,
  getPricingByUnitLite,
  getFloorPlanStartPrice
}