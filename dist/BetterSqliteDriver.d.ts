import { AbstractSqlDriver } from '@mikro-orm/knex';
import { BetterSqliteConnection } from './BetterSqliteConnection';
import type { AnyEntity, Configuration, EntityDictionary, NativeInsertUpdateManyOptions, QueryResult } from '@mikro-orm/core';
export declare class BetterSqliteDriver extends AbstractSqlDriver<BetterSqliteConnection> {
    constructor(config: Configuration);
    nativeInsertMany<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>[], options?: NativeInsertUpdateManyOptions<T>): Promise<QueryResult<T>>;
}
