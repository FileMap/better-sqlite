import { SchemaHelper } from '@mikro-orm/knex';
import type { Connection, Dictionary } from '@mikro-orm/core';
import type { AbstractSqlConnection, Check, Index } from '@mikro-orm/knex';
export declare class BetterSqliteSchemaHelper extends SchemaHelper {
    disableForeignKeysSQL(): string;
    enableForeignKeysSQL(): string;
    supportsSchemaConstraints(): boolean;
    getListTablesSQL(): string;
    getColumns(connection: AbstractSqlConnection, tableName: string, _schemaName?: string): Promise<any[]>;
    getEnumDefinitions(connection: AbstractSqlConnection, _checks: Check[], tableName: string, _schemaName: string): Promise<Dictionary<string[]>>;
    getPrimaryKeys(connection: AbstractSqlConnection, _indexes: Dictionary, tableName: string, _schemaName?: string): Promise<string[]>;
    getIndexes(connection: AbstractSqlConnection, tableName: string, _schemaName?: string): Promise<Index[]>;
    getChecks(_connection: AbstractSqlConnection, _tableName: string, _schemaName?: string): Promise<Check[]>;
    etForeignKeysSQL(tableName: string): string;
    mapForeignKeys(fks: any[], tableName: string): Dictionary;
    databaseExists(_connection: Connection, _name: string): Promise<boolean>;
    /**
   * Implicit indexes will be ignored when diffing
   */
    isImplicitIndex(name: string): boolean;
}
