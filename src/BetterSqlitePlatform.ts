/* eslint-disable @typescript-eslint/no-unsafe-call */
// import { escape } from 'sqlstring-sqlite';
import { expr, JsonProperty, Utils } from '@mikro-orm/core';
import { AbstractSqlPlatform } from '@mikro-orm/knex';

import { BetterSqliteExceptionConverter } from './BetterSqliteExceptionConverter';
import { BetterSqliteSchemaHelper } from './BetterSqliteSchemaHelper';

import type { EntityProperty } from '@mikro-orm/core';

const { escape } = require('sqlstring-sqlite');

export class BetterSqlitePlatform extends AbstractSqlPlatform {
    protected readonly schemaHelper: BetterSqliteSchemaHelper = new BetterSqliteSchemaHelper(this);

    protected readonly exceptionConverter = new BetterSqliteExceptionConverter();

    public usesDefaultKeyword(): boolean {
        return false;
    }

    public getCurrentTimestampSQL(_length: number): string {
        return super.getCurrentTimestampSQL(0);
    }

    public getDateTimeTypeDeclarationSQL(_column: { length: number }): string {
        return 'datetime';
    }

    public getEnumTypeDeclarationSQL(column: { items?: unknown[]; fieldNames: string[]; length?: number; unsigned?:
    boolean; autoincrement?: boolean }): string {
        if (column.items?.every(item => Utils.isString(item))) {
            return 'text';
        }

        return this.getTinyIntTypeDeclarationSQL(column);
    }

    public getTinyIntTypeDeclarationSQL(column: { length?: number; unsigned?: boolean; autoincrement?: boolean }): string {
        return this.getIntegerTypeDeclarationSQL(column);
    }

    public getSmallIntTypeDeclarationSQL(column: { length?: number; unsigned?: boolean; autoincrement?: boolean }): string {
        return this.getIntegerTypeDeclarationSQL(column);
    }

    public getIntegerTypeDeclarationSQL(_column: { length?: number; unsigned?: boolean; autoincrement?: boolean }): string {
        return 'integer';
    }

    public getFloatDeclarationSQL(): string {
        return 'real';
    }

    public getBooleanTypeDeclarationSQL(): string {
        return 'integer';
    }

    public getVarcharTypeDeclarationSQL(_column: { length?: number }): string {
        return 'text';
    }

    public convertsJsonAutomatically(): boolean {
        return false;
    }

    public allowsComparingTuples() {
        return false;
    }

    /**
   * This is used to narrow the value of Date properties as they will be stored as timestamps in sqlite.
   * We use this method to convert Dates to timestamps when computing the changeset, so we have the right
   * data type in the payload as well as in original entity data. Without that, we would end up with diffs
   * including all Date properties, as we would be comparing Date object with timestamp.
   */
    public processDateProperty(value: unknown): string | number | Date {
        if (value instanceof Date) {
            return +value;
        }

        return value as number;
    }

    public quoteVersionValue(value: Date | number, prop: EntityProperty): Date | string | number {
        if (prop.type.toLowerCase() === 'date') {
            return escape(value, true, this.timezone).replace(/^'|\.\d{3}'$/g, '');
        }

        return value;
    }

    public quoteValue(value: any): string {
    /* istanbul ignore if */
        if (Utils.isPlainObject(value) || value?.[JsonProperty]) {
            return escape(JSON.stringify(value), true, this.timezone);
        }

        if (value instanceof Date) {
            return `${+value}`;
        }

        return escape(value, true, this.timezone);
    }

    public getSearchJsonPropertyKey(path: string[], _type: string, aliased: boolean): string {
        const [a, ...b] = path;

        if (aliased) {
            return expr(alias => `json_extract(${this.quoteIdentifier(`${alias}.${a}`)}, '$.${b.join('.')}')`);
        }

        return `json_extract(${this.quoteIdentifier(a)}, '$.${b.join('.')}')`;
    }

    public getIndexName(tableName: string, columns: string[], type: 'index' | 'unique' | 'foreign' | 'primary' | 'sequence'): string {
        if (type === 'primary') {
            return this.getDefaultPrimaryName(tableName, columns);
        }

        return super.getIndexName(tableName, columns, type);
    }

    public getDefaultPrimaryName(_tableName: string, _columns: string[]): string {
        return 'primary';
    }

    public supportsDownMigrations(): boolean {
        return false;
    }
}
