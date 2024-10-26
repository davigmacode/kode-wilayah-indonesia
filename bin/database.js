"use strict";
var __importDefault = (this && this.__importDefault) || function (mod) {
    return (mod && mod.__esModule) ? mod : { "default": mod };
};
Object.defineProperty(exports, "__esModule", { value: true });
exports.insertMany = exports.insertOne = void 0;
var better_sqlite3_1 = __importDefault(require("better-sqlite3"));
var config_1 = require("./config");
var db = new better_sqlite3_1.default(config_1.DB_FILE);
db.pragma('journal_mode = WAL');
// Create tables and indexes if they don't exist
db.exec("\n  CREATE TABLE IF NOT EXISTS wilayah (code TEXT PRIMARY KEY, name TEXT, fullname TEXT);\n  CREATE INDEX IF NOT EXISTS idx_name ON wilayah (name);\n  CREATE INDEX IF NOT EXISTS idx_fullname ON wilayah (fullname);\n");
exports.insertOne = db.prepare('INSERT INTO wilayah (code, name, fullname) VALUES (?, ?, ?)');
exports.insertMany = db.transaction(function (items) {
    for (var _i = 0, items_1 = items; _i < items_1.length; _i++) {
        var item = items_1[_i];
        exports.insertOne.run(item.code, item.name, item.fullname);
    }
});
exports.default = db;
