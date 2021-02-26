"use strict";
exports.__esModule = true;
var jsonwebtoken_1 = require("jsonwebtoken");
function authMiddleware(req, res, next) {
    var authorization = req.headers.authorization;
    if (!authorization) {
        return res.sendStatus(401);
    }
    var token = authorization.replace('Bearer', '').trim();
    try {
        var data = jsonwebtoken_1["default"].verify(token, process.env.SECRET_KEY);
        var id = data.id;
        req.id = id;
        return next();
    }
    catch (_a) {
        return res.sendStatus(401);
    }
}
exports["default"] = authMiddleware;
