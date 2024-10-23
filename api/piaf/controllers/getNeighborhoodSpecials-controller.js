"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const axios = require("axios").default;
const getNeighborhoodSpecials = (req, res) => {
    var body = req.body || {};
    var authSF = {
        method: "post",
        url: "https://awsprg01.prom-online.com/staging/services/oauth2/token",
        headers: {},
        data: {}
    };
    console.log("====> before calling SF =====> ");
    axios(authSF).then(function (auth) {
        console.log(auth);
        var callSF = {
            method: "post",
            url: "https://prometheusreg--training.sandbox.my.salesforce.com/services/apexrest/v1/getNeighborhoodSpecials",
            headers: {
                Authorization: "Bearer " + auth['data']['access_token'],
                "Content-Type": "text/plain",
                Cookie: "BrowserId=zDWCBVPKEeu2Xe3l8vjfvw",
            },
            data: {},
        };
        axios(callSF)
            .then(function (response) {
            console.log(response);
        })
            .catch(function (error) {
            console.log(error);
            res.status(400).json(error);
        });
    }).catch(function (error) {
        console.log(error);
        res.status(400).json(error);
    });
};
module.exports = getNeighborhoodSpecials;
//# sourceMappingURL=getNeighborhoodSpecials-controller.js.map