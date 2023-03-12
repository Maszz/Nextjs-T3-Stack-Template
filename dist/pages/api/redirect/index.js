"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handler(req, res) {
    const { url } = req.query;
    return res.redirect(307, '/');
}
exports.default = handler;
