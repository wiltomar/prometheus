"use strict";
exports.__esModule = true;
/* eslint-disable import/extensions */
/* eslint-disable import/no-unresolved */
require("reflect-metadata");
var express_1 = require("express");
var helmet_1 = require("helmet");
var cors_1 = require("cors");
require("./database/connect");
var ts_dotenv_1 = require("ts-dotenv");
var routes_1 = require("./routes");
var erros_midlleware_1 = require("./middlewares/erros.midlleware");
var naoencontrado_middleware_1 = require("./middlewares/naoencontrado.middleware");
var config_json_1 = require("./config/config.json");
var agendamento_controller_1 = require("@controllers/agendamento.controller");
var app = express_1["default"]();
var env = ts_dotenv_1.load({
    BASE_URL: String,
    NODE_ENV: [
        'production',
        'development',
    ],
    PORT: Number
});
var serverPort = env.PORT || 3000;
var serverName = env.BASE_URL || 'Server';
if (!serverPort) {
    process.exit(1);
}
app.use(helmet_1["default"]());
app.use(express_1["default"].json());
app.use(cors_1["default"]());
app.use(routes_1["default"]);
app.use(erros_midlleware_1["default"]);
app.use(naoencontrado_middleware_1["default"]);
if (config_json_1["default"].foodyDelivery.ativo) {
    var cron = require("node-cron");
    cron.schedule("*/7 * * * * *", agendamento_controller_1["default"].procedimentos);
}
app.listen(serverPort, serverName, function () {
    console.log("\uD83D\uDE80 - Prometheus API Server started at http://" + serverName + ":" + serverPort);
});
