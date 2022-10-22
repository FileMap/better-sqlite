import type { Configuration, EntityDictionary, NativeInsertUpdateManyOptions, QueryResult } from '@mikro-orm/core';
import { AbstractSqlDriver } from '@mikro-orm/knex';
import { BetterSqliteConnection } from './BetterSqliteConnection';
export declare class BetterSqliteDriver extends AbstractSqlDriver<BetterSqliteConnection> {
    constructor(config: Configuration);
    nativeInsertMany<T extends object>(entityName: string, data: EntityDictionary<T>[], options?: NativeInsertUpdateManyOptions<T>): Promise<QueryResult<T>>;
}
