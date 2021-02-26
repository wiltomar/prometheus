"use strict";
exports.__esModule = true;
/* eslint-disable no-console */
var typeorm_1 = require("typeorm");
typeorm_1.createConnection().then(function () {
    console.log('🎲 - Successfully connected with database');
});
