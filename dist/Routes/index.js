"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const ProductRt_1 = __importDefault(require("./ProductRt"));
const UserRt_1 = __importDefault(require("./UserRt"));
const Routes = (app) => {
    app.use('/api/product', ProductRt_1.default);
    app.use('/api/user', UserRt_1.default);
};
exports.default = Routes;
