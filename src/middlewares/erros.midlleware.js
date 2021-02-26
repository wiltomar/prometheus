"use strict";
exports.__esModule = true;
var manipuladorDeErro = function (error, request, response, next) {
    var status = error.statusCode || error.status || 500;
    response.status(status).send(error);
};
exports["default"] = manipuladorDeErro;
