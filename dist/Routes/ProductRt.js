"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const ProductCtl_1 = require("../Controller/ProductCtl");
const Auth_1 = __importDefault(require("../Middelware/Auth"));
const userAuth = (req, res) => {
};
const router = express_1.default.Router();
router.get('/', ProductCtl_1.getProducts);
router.post('/', Auth_1.default, ProductCtl_1.createProduct);
router.route("/:id")
    .delete(ProductCtl_1.deleteProduct)
    .patch(ProductCtl_1.updateProduct)
    .get(ProductCtl_1.getProduct);
router.get('/search/name', ProductCtl_1.searchProduct);
exports.default = router;
