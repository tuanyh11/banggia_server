"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const express_1 = __importDefault(require("express"));
const UserCtl_1 = require("../Controller/UserCtl");
const router = express_1.default.Router();
router.post('/signin', UserCtl_1.signin);
router.post('/signup', UserCtl_1.signup);
router.get('/', UserCtl_1.getUsers);
router.get('/:id', UserCtl_1.getUser);
router.delete('/:id', UserCtl_1.deleteUser);
router.patch('/:id', UserCtl_1.updateUser);
exports.default = router;
