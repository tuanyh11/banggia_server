"use strict";
var __awaiter = (this && this.__awaiter) || function (thisArg, _arguments, P, generator) {
    function adopt(value) { return value instanceof P ? value : new P(function (resolve) { resolve(value); }); }
    return new (P || (P = Promise))(function (resolve, reject) {
        function fulfilled(value) { try { step(generator.next(value)); } catch (e) { reject(e); } }
        function rejected(value) { try { step(generator["throw"](value)); } catch (e) { reject(e); } }
        function step(result) { result.done ? resolve(result.value) : adopt(result.value).then(fulfilled, rejected); }
        step((generator = generator.apply(thisArg, _arguments || [])).next());
    });
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.searchProduct = exports.deleteProduct = exports.updateProduct = exports.createProduct = exports.getProduct = exports.getProducts = void 0;
const ConnectServer_1 = __importDefault(require("../Connection/ConnectServer"));
const uniqid_1 = __importDefault(require("uniqid"));
const moment_1 = __importDefault(require("moment"));
const getProducts = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const products = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select * from product`));
        return res.status(200).json({ success: true, data: products === null || products === void 0 ? void 0 : products[0] });
    }
    catch (error) {
        console.log(error);
        res.status(404).json({ message: error, success: false });
    }
});
exports.getProducts = getProducts;
const getProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [product] = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select * from product where id = ?`, [req.params.id]));
        return res.status(200).json({ success: true, data: product[0] });
    }
    catch (error) {
        res.status(404).json({ message: 'lỗi server', success: false });
        console.log(error);
    }
});
exports.getProduct = getProduct;
const createProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    var _a;
    try {
        if (Object.keys(req.body).length !== 0)
            req.body.id = (0, uniqid_1.default)();
        const { id, nameProduct, price, unit } = req.body;
        const exitProduct = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select nameProduct from product where nameProduct = ?`, [nameProduct]));
        if ((_a = exitProduct === null || exitProduct === void 0 ? void 0 : exitProduct[0]) === null || _a === void 0 ? void 0 : _a.length)
            return res.status(403).json({ message: 'tên sản phẩm đã tồn tại', success: false });
        yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`insert into product(id, price, unit, nameProduct) values(? , ?, ?, ?)`, [id, price, unit, nameProduct]));
        const [newProduct] = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select * from product where id = ?`, [id]));
        if (newProduct[0]) {
            return res.status(200).json({ success: true, data: newProduct[0] });
        }
        res.status(404).json({ message: 'lỗi server', success: false });
    }
    catch (error) {
        res.status(404).json({ message: 'lỗi server', success: false });
    }
});
exports.createProduct = createProduct;
const updateProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.updateAt = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
        const { id } = req.params;
        const { price, unit, nameProduct, updateAt } = req.body;
        yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`update product set price = ?, unit = ?, nameProduct = ?, updateAt = ? where id = ?`, [price, unit, nameProduct, updateAt, id]));
        res.status(200).json({ success: true, message: 'cập nhật sản phẩm thành công' });
    }
    catch (error) {
        res.status(404).json({ message: 'lỗi server', success: false });
        console.log(error);
    }
});
exports.updateProduct = updateProduct;
const deleteProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`delete from product where id = ?`, [req.params.id]));
        res.status(200).json({ success: true, message: 'xóa thành công' });
    }
    catch (error) {
        res.status(404).json({ message: 'lỗi server', success: false });
        console.log(error);
    }
});
exports.deleteProduct = deleteProduct;
const searchProduct = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const resp = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select * from product where nameProduct like "%${req.query.q}%"`));
        res.status(200).json(resp);
        console.log(resp === null || resp === void 0 ? void 0 : resp[0]);
    }
    catch (error) {
        console.log(error);
    }
});
exports.searchProduct = searchProduct;
