"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
const mysql2_1 = __importDefault(require("mysql2"));
const dotenv_1 = __importDefault(require("dotenv"));
dotenv_1.default.config();
const { HOST, USER, DATABASE, PASSWORD } = process.env;
const pool = mysql2_1.default.createPool({
    host: '127.0.0.1',
    user: 'root',
    database: 'test',
    // connectionLimit: 10,
    // waitForConnections: true,
    // queueLimit: 0,
    password: 'tuanyh11',
    // multipleStatements: false,
    // port: 8000
});
const connection = () => {
    pool.getConnection(err => {
        if (err)
            console.log(err);
        else
            console.log('connect database successfully');
    });
};
connection();
exports.default = pool.promise();
