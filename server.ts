const express = require('express')
const SwaggerParser = require('swagger-parser')
const { connector } = require('swagger-routes-express');
const swaggerUi = require('swagger-ui-express');
import * as morgan from "morgan";
import { DBconfig } from "./config/db.conf";

//Development Routes
const api = require('./api')
DBconfig.init();


const makeApp = async () => {
  const parser = new SwaggerParser();
  const apiDescription = await parser.validate('./server/api/V1api.yml');
  const connect = connector(api, apiDescription);

  const app = express()
  app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDescription));
  app.use(express.json());
  app.use(morgan("dev"));
  connect(app)
  // add any error handlers last
  return app
}
module.exports = makeApp