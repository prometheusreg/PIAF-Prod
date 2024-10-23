"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const updateProspect_Adapter_1 = require("../adapters/updateProspect-Adapter");
const updateProspect = (req, res) => {
    var body = req.body || {};
    updateProspect_Adapter_1.UpdateProspectAdapter.updateProspect(body).then(output => {
        res.status(200).json(output);
    }).catch((error) => {
        console.log(error);
        res.status(400).json(error);
    });
};
module.exports = updateProspect;
//# sourceMappingURL=UATupdateProspect-controller.js.map