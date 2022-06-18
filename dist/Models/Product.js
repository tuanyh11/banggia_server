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
const uniqid_1 = __importDefault(require("uniqid"));
const ob = {
    id: {
        type: 'string',
        null: false,
    }
};
class Schemas {
    constructor(name, fields) {
        fields = Object.assign(Object.assign({}, fields), { createdAt: new Date().toISOString().slice(0, 19).replace('T', ' '), updatedAt: new Date().toISOString().slice(0, 19).replace('T', ' '), id: {
                default: (0, uniqid_1.default)(),
            } });
        this.fields = fields;
        this.nameTable = name;
        fields.id ? new Error('id was default') : this.createdTable();
    }
    createdTable() {
        return __awaiter(this, void 0, void 0, function* () {
            // try {
            //     const newTable = await pool?.query(
            // )
            // } catch (error) {
            //     console.log(error)
            // }
            this.stringDif();
        });
    }
    stringDif() {
        let query = '';
        const conver = (object) => {
            if (typeof object === 'object') {
                let query = '';
                for (const key in object) {
                    query = object[key];
                }
            }
            else {
                query = object;
            }
            return query;
        };
        for (const property in this.fields) {
            query = property + conver(this.fields[property]);
            console.log(property);
        }
        console.log(query);
    }
}
exports.default = Schemas;
