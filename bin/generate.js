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
var __generator = (this && this.__generator) || function (thisArg, body) {
    var _ = { label: 0, sent: function() { if (t[0] & 1) throw t[1]; return t[1]; }, trys: [], ops: [] }, f, y, t, g = Object.create((typeof Iterator === "function" ? Iterator : Object).prototype);
    return g.next = verb(0), g["throw"] = verb(1), g["return"] = verb(2), typeof Symbol === "function" && (g[Symbol.iterator] = function() { return this; }), g;
    function verb(n) { return function (v) { return step([n, v]); }; }
    function step(op) {
        if (f) throw new TypeError("Generator is already executing.");
        while (g && (g = 0, op[0] && (_ = 0)), _) try {
            if (f = 1, y && (t = op[0] & 2 ? y["return"] : op[0] ? y["throw"] || ((t = y["return"]) && t.call(y), 0) : y.next) && !(t = t.call(y, op[1])).done) return t;
            if (y = 0, t) op = [op[0] & 2, t.value];
            switch (op[0]) {
                case 0: case 1: t = op; break;
                case 4: _.label++; return { value: op[1], done: false };
                case 5: _.label++; y = op[1]; op = [0]; continue;
                case 7: op = _.ops.pop(); _.trys.pop(); continue;
                default:
                    if (!(t = _.trys, t = t.length > 0 && t[t.length - 1]) && (op[0] === 6 || op[0] === 2)) { _ = 0; continue; }
                    if (op[0] === 3 && (!t || (op[1] > t[0] && op[1] < t[3]))) { _.label = op[1]; break; }
                    if (op[0] === 6 && _.label < t[1]) { _.label = t[1]; t = op; break; }
                    if (t && _.label < t[2]) { _.label = t[2]; _.ops.push(op); break; }
                    if (t[2]) _.ops.pop();
                    _.trys.pop(); continue;
            }
            op = body.call(thisArg, _);
        } catch (e) { op = [6, e]; y = 0; } finally { f = t = 0; }
        if (op[0] & 5) throw op[1]; return { value: op[0] ? op[1] : void 0, done: true };
    }
};
Object.defineProperty(exports, "__esModule", { value: true });
var path_1 = require("path");
var fs_1 = require("fs");
var fast_csv_1 = require("fast-csv");
var DATA_PATH = './data/kode-wilayah-permen-2022.csv';
var DATA_CODE = 'kode';
var DATA_NAME = 'nama';
var CODE_SEGMENT = {
    provinces: [2],
    regencies: [2, 2],
    districts: [2, 2, 2],
    villages: [2, 2, 2, 4],
};
function getCodeLength(resource) {
    var segment = CODE_SEGMENT[resource];
    var separator = segment.length > 1 ? segment.length - 1 : 0;
    return segment.reduce(function (a, b) { return a + b; }) + separator;
}
var PROVINCES_CODE_LENGTH = getCodeLength('provinces');
var REGENCIES_CODE_LENGTH = getCodeLength('regencies');
var DISTRICTS_CODE_LENGTH = getCodeLength('districts');
var VILLAGES_CODE_LENGTH = getCodeLength('villages');
function getData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var result = [];
                    var stream = (0, fs_1.createReadStream)(DATA_PATH);
                    (0, fast_csv_1.parseStream)(stream, { headers: true })
                        .on('error', function (error) { return reject(error); })
                        .on('data', function (row) {
                        var c = row[DATA_CODE];
                        var n = row[DATA_NAME];
                        result.push([c, n]);
                    })
                        .on('end', function () { return resolve(result); });
                })];
        });
    });
}
function saveData(filepath, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var dir = (0, path_1.dirname)(filepath);
                    if (!(0, fs_1.existsSync)(dir)) {
                        (0, fs_1.mkdirSync)(dir, { recursive: true });
                    }
                    (0, fs_1.writeFile)(filepath, JSON.stringify(data), function (err) {
                        if (!err)
                            resolve(filepath);
                        else
                            reject(err);
                    });
                })];
        });
    });
}
function log(message) {
    var timestamp = new Date().toISOString().substring(11, 23);
    console.log("[".concat(timestamp, "] - ").concat(message));
}
function main() {
    return __awaiter(this, void 0, void 0, function () {
        var source, provinces, regencies, districts, villages, saveRegencies, saveDistricts, saveVillages, sourcemap, saveTrace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log('Generating kode wilayah..');
                    log('Preparing data source..');
                    return [4 /*yield*/, getData()];
                case 1:
                    source = _a.sent();
                    provinces = source.filter(function (e) { return e[0].length == PROVINCES_CODE_LENGTH; });
                    regencies = source.filter(function (e) { return e[0].length == REGENCIES_CODE_LENGTH; });
                    districts = source.filter(function (e) { return e[0].length == DISTRICTS_CODE_LENGTH; });
                    villages = source.filter(function (e) { return e[0].length == VILLAGES_CODE_LENGTH; });
                    log('Writing provincies..');
                    return [4 /*yield*/, saveData('./public/provinces.json', provinces)];
                case 2:
                    _a.sent();
                    log('Writing regencies..');
                    saveRegencies = provinces.map(function (p) {
                        var data = regencies.filter(function (r) { return r[0].startsWith(p[0]); });
                        return saveData("./public/regencies/".concat(p[0], ".json"), data);
                    });
                    return [4 /*yield*/, Promise.allSettled(saveRegencies)];
                case 3:
                    _a.sent();
                    log('Writing districts..');
                    saveDistricts = regencies.map(function (r) {
                        var data = districts.filter(function (d) { return d[0].startsWith(r[0]); });
                        return saveData("./public/districts/".concat(r[0], ".json"), data);
                    });
                    return [4 /*yield*/, Promise.allSettled(saveDistricts)];
                case 4:
                    _a.sent();
                    log('Writing villages..');
                    saveVillages = districts.map(function (d) {
                        var data = villages.filter(function (v) { return v[0].startsWith(d[0]); });
                        return saveData("./public/villages/".concat(d[0], ".json"), data);
                    });
                    return [4 /*yield*/, Promise.allSettled(saveVillages)];
                case 5:
                    _a.sent();
                    log('Mapping data source..');
                    sourcemap = new Map();
                    source.forEach(function (e) { return sourcemap.set(e[0], e); });
                    log('Writing trace..');
                    saveTrace = villages.map(function (v) {
                        var c = v[0];
                        var data = {
                            province: sourcemap.get(c.substring(0, PROVINCES_CODE_LENGTH)),
                            regency: sourcemap.get(c.substring(0, REGENCIES_CODE_LENGTH)),
                            district: sourcemap.get(c.substring(0, DISTRICTS_CODE_LENGTH)),
                            village: v,
                        };
                        return saveData("./public/trace/".concat(c, ".json"), data);
                    });
                    return [4 /*yield*/, Promise.allSettled(saveTrace)];
                case 6:
                    _a.sent();
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function () { return log('Done.'); });
