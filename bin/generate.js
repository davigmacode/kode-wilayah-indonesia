"use strict";
var __createBinding = (this && this.__createBinding) || (Object.create ? (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    var desc = Object.getOwnPropertyDescriptor(m, k);
    if (!desc || ("get" in desc ? !m.__esModule : desc.writable || desc.configurable)) {
      desc = { enumerable: true, get: function() { return m[k]; } };
    }
    Object.defineProperty(o, k2, desc);
}) : (function(o, m, k, k2) {
    if (k2 === undefined) k2 = k;
    o[k2] = m[k];
}));
var __setModuleDefault = (this && this.__setModuleDefault) || (Object.create ? (function(o, v) {
    Object.defineProperty(o, "default", { enumerable: true, value: v });
}) : function(o, v) {
    o["default"] = v;
});
var __importStar = (this && this.__importStar) || function (mod) {
    if (mod && mod.__esModule) return mod;
    var result = {};
    if (mod != null) for (var k in mod) if (k !== "default" && Object.prototype.hasOwnProperty.call(mod, k)) __createBinding(result, mod, k);
    __setModuleDefault(result, mod);
    return result;
};
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
var config_1 = require("./config");
var database_1 = __importStar(require("./database"));
function getData() {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var result = [];
                    var stream = (0, fs_1.createReadStream)(config_1.DATA_FILE);
                    (0, fast_csv_1.parseStream)(stream, { headers: true })
                        .on('error', function (error) { return reject(error); })
                        .on('data', function (row) {
                        var c = row[config_1.FIELD_CODE];
                        var n = row[config_1.FIELD_NAME];
                        result.push([c, n]);
                    })
                        .on('end', function () { return resolve(result); });
                })];
        });
    });
}
function saveData(filename, data) {
    return __awaiter(this, void 0, void 0, function () {
        return __generator(this, function (_a) {
            return [2 /*return*/, new Promise(function (resolve, reject) {
                    var filepath = (0, path_1.join)(process.cwd(), config_1.STATIC_PATH, filename);
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
        var source, provinces, regencies, districts, villages, saveRegencies, saveDistricts, saveVillages, sourceMap, dbEntries, saveRegenciesTrace, saveDistricsTrace, saveVillagesTrace;
        return __generator(this, function (_a) {
            switch (_a.label) {
                case 0:
                    log('Generating kode wilayah..');
                    log('Preparing data source..');
                    return [4 /*yield*/, getData()];
                case 1:
                    source = _a.sent();
                    provinces = source.filter(function (e) { return e[0].length == config_1.PROVINCES_CODE_LENGTH; });
                    regencies = source.filter(function (e) { return e[0].length == config_1.REGENCIES_CODE_LENGTH; });
                    districts = source.filter(function (e) { return e[0].length == config_1.DISTRICTS_CODE_LENGTH; });
                    villages = source.filter(function (e) { return e[0].length == config_1.VILLAGES_CODE_LENGTH; });
                    log('Generating static provincies..');
                    return [4 /*yield*/, saveData('/provinces.json', provinces)];
                case 2:
                    _a.sent();
                    log('Generating static regencies..');
                    saveRegencies = provinces.map(function (p) {
                        var data = regencies.filter(function (r) { return r[0].startsWith(p[0]); });
                        return saveData("/regencies/".concat(p[0], ".json"), data);
                    });
                    return [4 /*yield*/, Promise.allSettled(saveRegencies)];
                case 3:
                    _a.sent();
                    log('Generating static districts..');
                    saveDistricts = regencies.map(function (r) {
                        var data = districts.filter(function (d) { return d[0].startsWith(r[0]); });
                        return saveData("/districts/".concat(r[0], ".json"), data);
                    });
                    return [4 /*yield*/, Promise.allSettled(saveDistricts)];
                case 4:
                    _a.sent();
                    log('Generating static villages..');
                    saveVillages = districts.map(function (d) {
                        var data = villages.filter(function (v) { return v[0].startsWith(d[0]); });
                        return saveData("/villages/".concat(d[0], ".json"), data);
                    });
                    return [4 /*yield*/, Promise.allSettled(saveVillages)];
                case 5:
                    _a.sent();
                    log('Mapping data source..');
                    sourceMap = new Map();
                    source.forEach(function (e) { return sourceMap.set(e[0], e); });
                    dbEntries = [];
                    provinces.forEach(function (e) {
                        dbEntries.push({ code: e[0], name: e[1], fullname: e[1] });
                    });
                    log('Generating static regencies trace..');
                    saveRegenciesTrace = regencies.map(function (e) {
                        var _a, _b;
                        var c = e[0];
                        var data = {
                            province: sourceMap.get(c.substring(0, config_1.PROVINCES_CODE_LENGTH)),
                            regency: e,
                        };
                        var fullname = [
                            (_a = data.province) === null || _a === void 0 ? void 0 : _a.at(1),
                            (_b = data.regency) === null || _b === void 0 ? void 0 : _b.at(1),
                        ].join(', ');
                        dbEntries.push({ code: c, name: e[1], fullname: fullname });
                        return saveData("/trace/".concat(c, ".json"), data);
                    });
                    return [4 /*yield*/, Promise.allSettled(saveRegenciesTrace)];
                case 6:
                    _a.sent();
                    log('Generating static districts trace..');
                    saveDistricsTrace = districts.map(function (e) {
                        var _a, _b, _c;
                        var c = e[0];
                        var data = {
                            province: sourceMap.get(c.substring(0, config_1.PROVINCES_CODE_LENGTH)),
                            regency: sourceMap.get(c.substring(0, config_1.REGENCIES_CODE_LENGTH)),
                            district: e,
                        };
                        var fullname = [
                            (_a = data.province) === null || _a === void 0 ? void 0 : _a.at(1),
                            (_b = data.regency) === null || _b === void 0 ? void 0 : _b.at(1),
                            (_c = data.district) === null || _c === void 0 ? void 0 : _c.at(1),
                        ].join(', ');
                        dbEntries.push({ code: c, name: e[1], fullname: fullname });
                        return saveData("/trace/".concat(c, ".json"), data);
                    });
                    return [4 /*yield*/, Promise.allSettled(saveDistricsTrace)];
                case 7:
                    _a.sent();
                    log('Generating static villages trace..');
                    saveVillagesTrace = villages.map(function (e) {
                        var _a, _b, _c, _d;
                        var c = e[0];
                        var data = {
                            province: sourceMap.get(c.substring(0, config_1.PROVINCES_CODE_LENGTH)),
                            regency: sourceMap.get(c.substring(0, config_1.REGENCIES_CODE_LENGTH)),
                            district: sourceMap.get(c.substring(0, config_1.DISTRICTS_CODE_LENGTH)),
                            village: e,
                        };
                        var fullname = [
                            (_a = data.province) === null || _a === void 0 ? void 0 : _a.at(1),
                            (_b = data.regency) === null || _b === void 0 ? void 0 : _b.at(1),
                            (_c = data.district) === null || _c === void 0 ? void 0 : _c.at(1),
                            (_d = data.village) === null || _d === void 0 ? void 0 : _d.at(1),
                        ].join(', ');
                        dbEntries.push({ code: c, name: e[1], fullname: fullname });
                        return saveData("/trace/".concat(c, ".json"), data);
                    });
                    return [4 /*yield*/, Promise.allSettled(saveVillagesTrace)];
                case 8:
                    _a.sent();
                    log('Writing into database..');
                    (0, database_1.resetEntries)();
                    (0, database_1.insertMany)(dbEntries);
                    database_1.default.close();
                    return [2 /*return*/];
            }
        });
    });
}
main().then(function () { return log('Done.'); });
