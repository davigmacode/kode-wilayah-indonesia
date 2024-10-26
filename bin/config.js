"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.DB_FILE = exports.DB_NAME = exports.DB_PATH = exports.VILLAGES_CODE_LENGTH = exports.DISTRICTS_CODE_LENGTH = exports.REGENCIES_CODE_LENGTH = exports.PROVINCES_CODE_LENGTH = exports.CODE_SEGMENT = exports.CODE_SEPARATOR = exports.FIELD_NAME = exports.FIELD_CODE = exports.DATA_FILE = exports.DATA_FILE_NAME = exports.DATA_PATH = exports.STATIC_PATH = void 0;
var path_1 = __importDefault(require("path"));
exports.STATIC_PATH = path_1.default.resolve(__dirname, '../', process.env.STATIC_PATH || './public');
exports.DATA_PATH = path_1.default.resolve(__dirname, '../', process.env.SOURCE_PATH || './data');
exports.DATA_FILE_NAME = process.env.SOURCE_FILE || 'kode-wilayah.csv';
exports.DATA_FILE = path_1.default.join(exports.DATA_PATH, exports.DATA_FILE_NAME);
exports.FIELD_CODE = process.env.FIELD_CODE || 'kode';
exports.FIELD_NAME = process.env.FIELD_NAME || 'nama';
exports.CODE_SEPARATOR = process.env.CODE_SEPARATOR || '';
exports.CODE_SEGMENT = {
    provinces: [2],
    regencies: [2, 2],
    districts: [2, 2, 2],
    villages: [2, 2, 2, 4],
};
function getCodeLength(resource) {
    var segment = exports.CODE_SEGMENT[resource];
    var separator = exports.CODE_SEPARATOR.length * (segment.length > 1 ? segment.length - 1 : 0);
    return segment.reduce(function (a, b) { return a + b; }) + separator;
}
exports.PROVINCES_CODE_LENGTH = getCodeLength('provinces');
exports.REGENCIES_CODE_LENGTH = getCodeLength('regencies');
exports.DISTRICTS_CODE_LENGTH = getCodeLength('districts');
exports.VILLAGES_CODE_LENGTH = getCodeLength('villages');
// export const DB_PATH = path.resolve(__dirname, '../', process.env.DB_PATH || './app/db');
exports.DB_PATH = process.env.DB_PATH || 'app/db';
exports.DB_NAME = process.env.DB_NAME || 'regions.db';
exports.DB_FILE = path_1.default.join(process.cwd(), exports.DB_PATH, exports.DB_NAME);
