import * as express from "express";
import { UpdateProspectAdapter } from "../adapters/updateProspect-Adapter";
const updateProspect = (req: express.Request, res: express.Response) => {
  var body = req.body || {};
  UpdateProspectAdapter.updateProspect(body).then(output => {
    res.status(200).json(output);
  }).catch((error) => {
    console.log(error);
    res.status(400).json(error);
  });
}
module.exports = updateProspect;