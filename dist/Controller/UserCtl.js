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
var __rest = (this && this.__rest) || function (s, e) {
    var t = {};
    for (var p in s) if (Object.prototype.hasOwnProperty.call(s, p) && e.indexOf(p) < 0)
        t[p] = s[p];
    if (s != null && typeof Object.getOwnPropertySymbols === "function")
        for (var i = 0, p = Object.getOwnPropertySymbols(s); i < p.length; i++) {
            if (e.indexOf(p[i]) < 0 && Object.prototype.propertyIsEnumerable.call(s, p[i]))
                t[p[i]] = s[p[i]];
        }
    return t;
};
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.updateUser = exports.deleteUser = exports.getUser = exports.getUsers = exports.signup = exports.signin = void 0;
const ConnectServer_1 = __importDefault(require("../Connection/ConnectServer"));
const jsonwebtoken_1 = __importDefault(require("jsonwebtoken"));
const bcrypt_1 = __importDefault(require("bcrypt"));
const uniqid_1 = __importDefault(require("uniqid"));
const dotenv_1 = __importDefault(require("dotenv"));
const moment_1 = __importDefault(require("moment"));
dotenv_1.default.config();
const signin = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const { phone, password } = req.body;
        if (/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone)) {
            const [userExisting] = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select * from users where phone = ? `, [phone]));
            if (!userExisting[0])
                return res.status(401).json({ message: 'không tồn tại user', success: false });
            const isPasswordCorrect = yield bcrypt_1.default.compare(password, userExisting[0].passwords);
            const _a = userExisting[0], { passwords } = _a, user = __rest(_a, ["passwords"]);
            if (isPasswordCorrect)
                return res.status(400).json({ message: 'mật khẩu hoặc số điện thoại không hợp lệ', success: false });
            const token = jsonwebtoken_1.default.sign({ phone: user }, process.env.SECRET, { expiresIn: '1h' });
            res.status(200).json({ success: true, data: Object.assign(Object.assign({}, user), { token }) });
        }
        else {
            return res.status(403).json({ message: 'số điện thoại không phù hợp', success: false });
        }
    }
    catch (error) {
        res.status(404).json({ message: error, success: false });
    }
});
exports.signin = signin;
const signup = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.id = (0, uniqid_1.default)();
        const { id, phone, passwords, comfirmPassword, nameuser } = req.body;
        if (!nameuser || !phone)
            return res.status(403).json({ message: 'các trường không được để trống', success: false });
        if (/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone)) {
            const [userExisting] = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select * from users where phone = ? `, [phone]));
            if (userExisting[0])
                return res.status(403).json({ message: 'người dùng đã tồn tại', success: false });
            if (passwords.length >= 8)
                return res.status(403).json({ message: 'mật khẩu phải lớn hơn 8 ký tự', success: false });
            if (passwords != comfirmPassword)
                return res.status(403).json({ message: 'mật khẩu hoặc số điện thoại không hợp lệ', success: false });
            const hasPassword = yield bcrypt_1.default.hash(passwords, 12);
            const result = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`insert into users (id, phone, passwords, nameUser) values(? , ?, ?, ?)`, [id, phone, hasPassword, nameuser]));
            const [userInfo] = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select * from users where phone = '${phone}' `));
            res.status(200).json({ success: true, data: userInfo[0] });
        }
        else {
            return res.status(403).json({ message: 'số điện thoại không phù hợp', success: false });
        }
    }
    catch (error) {
        console.log(error);
        return res.status(403).json({ message: 'lỗi server', success: false });
    }
});
exports.signup = signup;
const getUsers = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const users = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select * from users`));
        return res.status(200).json({ success: true, data: users === null || users === void 0 ? void 0 : users[0] });
    }
    catch (error) {
        res.status(404).json({ message: 'lỗi server', success: false });
    }
});
exports.getUsers = getUsers;
const getUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        const [user] = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select * from users where id = ?`, [req.params.id]));
        const _b = user[0], { passwords } = _b, newUser = __rest(_b, ["passwords"]);
        return res.status(200).json({ success: true, data: newUser });
    }
    catch (error) {
        res.status(404).json({ message: 'lỗi server', success: false });
        console.log(error);
    }
});
exports.getUser = getUser;
const deleteUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`delete from users where id = ?`, [req.params.id]));
        res.status(200).json({ success: true, data: null });
    }
    catch (error) {
        res.status(404).json({ message: 'lỗi server', success: false });
    }
});
exports.deleteUser = deleteUser;
const updateUser = (req, res) => __awaiter(void 0, void 0, void 0, function* () {
    try {
        req.body.updateAt = (0, moment_1.default)().format('YYYY-MM-DD HH:mm:ss');
        const { id } = req.params;
        const { nameUser, phone, passwords, updateAt } = req.body;
        if (!nameUser || !phone)
            return res.status(403).json({ message: 'các trường không được để trống', success: false });
        if (/(84|0[3|5|7|8|9])+([0-9]{8})\b/.test(phone)) {
            if (!passwords) {
                const userExisting = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`select * from users where phone = ? `, [phone]));
                if ((userExisting === null || userExisting === void 0 ? void 0 : userExisting[0].length) > 0 && (userExisting === null || userExisting === void 0 ? void 0 : userExisting[0][0].id) !== (req === null || req === void 0 ? void 0 : req.user.id))
                    return res.status(401).json({ message: 'người dùng đã tồn tại', success: false });
                const updateUser = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`update users set nameUser = ?, phone = ?, updateAt = ? where id = ?`, [nameUser, phone, updateAt, id]));
                res.status(200).json({ success: true, message: 'cập nhật user thành công' });
            }
            else {
                const hasPassword = yield bcrypt_1.default.hash(passwords, 12);
                if (passwords.length >= 8)
                    return res.status(403).json({ message: 'mật khẩu phải lớn hơn 8 ký tự', success: false });
                const updateUser = yield (ConnectServer_1.default === null || ConnectServer_1.default === void 0 ? void 0 : ConnectServer_1.default.query(`update users set nameUser = ?, phone = ?, passwords = ?, updateAt = ? where id = ?`, [nameUser, phone, hasPassword, updateAt, id]));
                res.status(200).json({ success: true, message: 'cập nhật sản phẩm thành công' });
            }
        }
    }
    catch (error) {
        res.status(404).json({ message: 'lỗi server', success: false });
    }
});
exports.updateUser = updateUser;
