"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const authentication = (req, res, next) => {
    var _a, _b, _c;
    const token = (_b = (_a = req.headers) === null || _a === void 0 ? void 0 : _a.authorization) === null || _b === void 0 ? void 0 : _b.split(" ")[1];
    try {
        if (token) {
            const user = jsonwebtoken_1.default.verify(token, (_c = process === null || process === void 0 ? void 0 : process.env) === null || _c === void 0 ? void 0 : _c.SECRET);
            req.user = user;
            next();
        }
        else {
            res.status(403).json({ message: 'lỗi xác thực', success: false });
        }
    }
    catch (error) {
        res.status(403).json({ message: error === null || error === void 0 ? void 0 : error.message, success: false });
    }
};
exports.default = authentication;
