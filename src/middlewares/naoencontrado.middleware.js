"use strict";
exports.__esModule = true;
var manipuladorDeErroNaoEncontrado = function (request, response, next) {
    var messagem = 'Recurso não encontrado!';
    response.status(404).json({ message: messagem });
};
exports["default"] = manipuladorDeErroNaoEncontrado;
