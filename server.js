"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
Object.defineProperty(exports, "__esModule", { value: true });
const express = require('express');
const SwaggerParser = require('swagger-parser');
const { connector } = require('swagger-routes-express');
const swaggerUi = require('swagger-ui-express');
const morgan = require("morgan");
const db_conf_1 = require("./config/db.conf");
//Development Routes
const api = require('./api');
db_conf_1.DBconfig.init();
const makeApp = () => __awaiter(void 0, void 0, void 0, function* () {
    const parser = new SwaggerParser();
    const apiDescription = yield parser.validate('./server/api/V1api.yml');
    const connect = connector(api, apiDescription);
    const app = express();
    app.use('/api-docs', swaggerUi.serve, swaggerUi.setup(apiDescription));
    app.use(express.json());
    app.use(morgan("dev"));
    connect(app);
    // add any error handlers last
    return app;
});
module.exports = makeApp;
//# sourceMappingURL=server.js.map