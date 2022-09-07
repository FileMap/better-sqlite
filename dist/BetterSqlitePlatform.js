"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterSqlitePlatform = void 0;
// @ts-ignore
const sqlstring_sqlite_1 = require("sqlstring-sqlite");
const core_1 = require("@mikro-orm/core");
const knex_1 = require("@mikro-orm/knex");
const BetterSqliteSchemaHelper_1 = require("./BetterSqliteSchemaHelper");
const BetterSqliteExceptionConverter_1 = require("./BetterSqliteExceptionConverter");
class BetterSqlitePlatform extends knex_1.AbstractSqlPlatform {
    constructor() {
        super(...arguments);
        this.schemaHelper = new BetterSqliteSchemaHelper_1.BetterSqliteSchemaHelper(this);
        this.exceptionConverter = new BetterSqliteExceptionConverter_1.BetterSqliteExceptionConverter();
    }
    usesDefaultKeyword() {
        return false;
    }
    getCurrentTimestampSQL(length) {
        return super.getCurrentTimestampSQL(0);
    }
    getDateTimeTypeDeclarationSQL(column) {
        return 'datetime';
    }
    getEnumTypeDeclarationSQL(column) {
        if (column.items?.every(item => core_1.Utils.isString(item))) {
            return 'text';
        }
        return this.getTinyIntTypeDeclarationSQL(column);
    }
    getTinyIntTypeDeclarationSQL(column) {
        return this.getIntegerTypeDeclarationSQL(column);
    }
    getSmallIntTypeDeclarationSQL(column) {
        return this.getIntegerTypeDeclarationSQL(column);
    }
    getIntegerTypeDeclarationSQL(column) {
        return 'integer';
    }
    getFloatDeclarationSQL() {
        return 'real';
    }
    getBooleanTypeDeclarationSQL() {
        return 'integer';
    }
    getVarcharTypeDeclarationSQL(column) {
        return 'text';
    }
    convertsJsonAutomatically() {
        return false;
    }
    allowsComparingTuples() {
        return false;
    }
    /**
     * This is used to narrow the value of Date properties as they will be stored as timestamps in sqlite.
     * We use this method to convert Dates to timestamps when computing the changeset, so we have the right
     * data type in the payload as well as in original entity data. Without that, we would end up with diffs
     * including all Date properties, as we would be comparing Date object with timestamp.
     */
    processDateProperty(value) {
        if (value instanceof Date) {
            return +value;
        }
        return value;
    }
    quoteVersionValue(value, prop) {
        if (prop.type.toLowerCase() === 'date') {
            return (0, sqlstring_sqlite_1.escape)(value, true, this.timezone).replace(/^'|\.\d{3}'$/g, '');
        }
        return value;
    }
    quoteValue(value) {
        /* istanbul ignore if */
        if (core_1.Utils.isPlainObject(value) || value?.[core_1.JsonProperty]) {
            return (0, sqlstring_sqlite_1.escape)(JSON.stringify(value), true, this.timezone);
        }
        if (value instanceof Date) {
            return '' + +value;
        }
        return (0, sqlstring_sqlite_1.escape)(value, true, this.timezone);
    }
    getSearchJsonPropertyKey(path, type, aliased) {
        const [a, ...b] = path;
        if (aliased) {
            return (0, core_1.expr)(alias => `json_extract(${this.quoteIdentifier(`${alias}.${a}`)}, '$.${b.join('.')}')`);
        }
        return `json_extract(${this.quoteIdentifier(a)}, '$.${b.join('.')}')`;
    }
    getIndexName(tableName, columns, type) {
        if (type === 'primary') {
            return this.getDefaultPrimaryName(tableName, columns);
        }
        return super.getIndexName(tableName, columns, type);
    }
    getDefaultPrimaryName(tableName, columns) {
        return 'primary';
    }
    supportsDownMigrations() {
        return false;
    }
}
exports.BetterSqlitePlatform = BetterSqlitePlatform;
