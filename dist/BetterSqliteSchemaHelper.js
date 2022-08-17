"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
exports.BetterSqliteSchemaHelper = void 0;
/* eslint-disable @typescript-eslint/require-await */
/* eslint-disable no-await-in-loop */
/* eslint-disable @typescript-eslint/no-unsafe-call */
const knex_1 = require("@mikro-orm/knex");
class BetterSqliteSchemaHelper extends knex_1.SchemaHelper {
    disableForeignKeysSQL() {
        return 'pragma foreign_keys = off;';
    }
    enableForeignKeysSQL() {
        return 'pragma foreign_keys = on;';
    }
    supportsSchemaConstraints() {
        return false;
    }
    getListTablesSQL() {
        return 'select name as table_name from sqlite_master where type = \'table\' and name != \'sqlite_sequence\''
            + 'and name != \'geometry_columns\' and name != \'spatial_ref_sys\' '
            + 'union all select name as table_name from sqlite_temp_master where type = \'table\' order by name';
    }
    async getColumns(connection, tableName, _schemaName) {
        const columns = await connection.execute(`pragma table_info('${tableName}')`);
        const sql = 'select sql from sqlite_master where type = ? and name = ?';
        const tableDefinition = await connection.execute(sql, ['table', tableName], 'get');
        // eslint-disable-next-line @typescript-eslint/restrict-plus-operands
        const composite = columns.reduce((count, col) => count + (col.pk ? 1 : 0), 0) > 1;
        // there can be only one, so naive check like this should be enough
        const hasAutoincrement = tableDefinition.sql.toLowerCase().includes('autoincrement');
        return columns.map((col) => {
            const mappedType = connection.getPlatform().getMappedType(col.type);
            return {
                name: col.name,
                type: col.type,
                default: col.dflt_value,
                nullable: !col.notnull,
                primary: !!col.pk,
                mappedType,
                unsigned: false,
                autoincrement: !composite && col.pk && this.platform.isNumericColumn(mappedType) && hasAutoincrement,
            };
        });
    }
    async getEnumDefinitions(connection, _checks, tableName, _schemaName) {
        const sql = 'select sql from sqlite_master where type = ? and name = ?';
        const tableDefinition = await connection.execute(sql, ['table', tableName], 'get');
        const checkConstraints = tableDefinition.sql.match(/[`["'][^`\]"']+[`\]"'] text check \(.*?\)/gi) ?? [];
        return checkConstraints.reduce((o, item) => {
            // check constraints are defined as (note that last closing paren is missing):
            // `type` text check (`type` in ('local', 'global')
            const match = item.match(/[`["']([^`\]"']+)[`\]"'] text check \(.* \((.*)\)/i);
            /* istanbul ignore else */
            if (match) {
                // eslint-disable-next-line @typescript-eslint/no-shadow
                o[match[1]] = match[2].split(',').map((item) => item.trim().match(/^\(?'(.*)'/)[1]);
            }
            return o;
        }, {});
    }
    async getPrimaryKeys(connection, _indexes, tableName, _schemaName) {
        const sql = `pragma table_info(\`${tableName}\`)`;
        const cols = await connection.execute(sql);
        return cols.filter(col => !!col.pk).map(col => col.name);
    }
    async getIndexes(connection, tableName, _schemaName) {
        const sql = `pragma table_info(\`${tableName}\`)`;
        const cols = await connection.execute(sql);
        const indexes = await connection.execute(`pragma index_list(\`${tableName}\`)`);
        const ret = [];
        for (const col of cols.filter(c => c.pk)) {
            ret.push({
                columnNames: [col.name],
                keyName: 'primary',
                unique: true,
                primary: true,
            });
        }
        // eslint-disable-next-line @typescript-eslint/no-shadow
        for (const index of indexes.filter(index => !this.isImplicitIndex(index.name))) {
            // eslint-disable-next-line @typescript-eslint/restrict-template-expressions
            const res = await connection.execute(`pragma index_info(\`${index.name}\`)`);
            ret.push(...res.map(row => ({
                columnNames: [row.name],
                keyName: index.name,
                unique: !!index.unique,
                primary: false,
            })));
        }
        return this.mapIndexes(ret);
    }
    async getChecks(_connection, _tableName, _schemaName) {
        // Not supported at the moment.
        return [];
    }
    etForeignKeysSQL(tableName) {
        return `pragma foreign_key_list(\`${tableName}\`)`;
    }
    mapForeignKeys(fks, tableName) {
        return fks.reduce((ret, fk) => {
            ret[fk.from] = {
                constraintName: this.platform.getIndexName(tableName, [fk.from], 'foreign'),
                columnName: fk.from,
                columnNames: [fk.from],
                localTableName: tableName,
                referencedTableName: fk.table,
                referencedColumnName: fk.to,
                referencedColumnNames: [fk.to],
                updateRule: fk.on_update.toLowerCase(),
                deleteRule: fk.on_delete.toLowerCase(),
            };
            return ret;
        }, {});
    }
    async databaseExists(_connection, _name) {
        return true;
    }
    /**
   * Implicit indexes will be ignored when diffing
   */
    isImplicitIndex(name) {
        // Ignore indexes with reserved names, e.g. autoindexes
        return name.startsWith('sqlite_');
    }
}
exports.BetterSqliteSchemaHelper = BetterSqliteSchemaHelper;
