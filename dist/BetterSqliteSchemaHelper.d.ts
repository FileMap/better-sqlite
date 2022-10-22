import type { Connection, Dictionary } from '@mikro-orm/core';
import type { AbstractSqlConnection, Index, Check } from '@mikro-orm/knex';
import { SchemaHelper } from '@mikro-orm/knex';
export declare class BetterSqliteSchemaHelper extends SchemaHelper {
    disableForeignKeysSQL(): string;
    enableForeignKeysSQL(): string;
    supportsSchemaConstraints(): boolean;
    getListTablesSQL(): string;
    getColumns(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<any[]>;
    getEnumDefinitions(connection: AbstractSqlConnection, checks: Check[], tableName: string, schemaName: string): Promise<Dictionary<string[]>>;
    getPrimaryKeys(connection: AbstractSqlConnection, indexes: Dictionary, tableName: string, schemaName?: string): Promise<string[]>;
    getIndexes(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Index[]>;
    getChecks(connection: AbstractSqlConnection, tableName: string, schemaName?: string): Promise<Check[]>;
    getForeignKeysSQL(tableName: string): string;
    mapForeignKeys(fks: any[], tableName: string): Dictionary;
    databaseExists(connection: Connection, name: string): Promise<boolean>;
    /**
     * Implicit indexes will be ignored when diffing
     */
    isImplicitIndex(name: string): boolean;
}
