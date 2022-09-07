"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterSqliteDriver = void 0;
const knex_1 = require("@mikro-orm/knex");
const BetterSqliteConnection_1 = require("./BetterSqliteConnection");
const BetterSqlitePlatform_1 = require("./BetterSqlitePlatform");
class BetterSqliteDriver extends knex_1.AbstractSqlDriver {
    constructor(config) {
        super(config, new BetterSqlitePlatform_1.BetterSqlitePlatform(), BetterSqliteConnection_1.BetterSqliteConnection, ['knex', 'better-sqlite3']);
    }
    async nativeInsertMany(entityName, data, options = {}) {
        options.processCollections ?? (options.processCollections = true);
        const res = await super.nativeInsertMany(entityName, data, options);
        const pks = this.getPrimaryKeyFields(entityName);
        const first = res.insertId - data.length + 1;
        res.rows ?? (res.rows = []);
        data.forEach((item, idx) => res.rows[idx] = { [pks[0]]: item[pks[0]] ?? first + idx });
        res.row = res.rows[0];
        return res;
    }
}
exports.BetterSqliteDriver = BetterSqliteDriver;
