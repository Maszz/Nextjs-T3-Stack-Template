"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
function handler(req, res) {
    const { url } = req.query;
    console.log('redirecting to', url);
    return res.redirect(307, '/' + url);
}
exports.default = handler;
