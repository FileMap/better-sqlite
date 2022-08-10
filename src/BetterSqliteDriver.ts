/* eslint-disable prefer-destructuring */
/* eslint-disable no-return-assign */
/* eslint-disable func-names */
/* eslint-disable consistent-return */
/* eslint-disable @typescript-eslint/restrict-template-expressions */
/* eslint-disable no-promise-executor-return */
/* eslint-disable no-underscore-dangle */
/* eslint-disable @typescript-eslint/no-unsafe-call */
/* eslint-disable unused-imports/no-unused-vars */
/* eslint-disable max-len */
/* eslint-disable @typescript-eslint/explicit-member-accessibility */
// @ts-ignore
import { AbstractSqlDriver } from '@mikro-orm/knex';

import { BetterSqliteConnection } from './BetterSqliteConnection';
import { BetterSqlitePlatform } from './BetterSqlitePlatform';

import type { AnyEntity, Configuration, EntityDictionary, NativeInsertUpdateManyOptions, QueryResult } from '@mikro-orm/core';

export class BetterSqliteDriver extends AbstractSqlDriver<BetterSqliteConnection> {
    constructor(config: Configuration) {
        super(config, new BetterSqlitePlatform(), BetterSqliteConnection, ['knex', 'better-sqlite3']);
    }

    async nativeInsertMany<T extends AnyEntity<T>>(entityName: string, data: EntityDictionary<T>[], options: NativeInsertUpdateManyOptions<T> = {}): Promise<QueryResult<T>> {
        options.processCollections ??= true;
        const res = await super.nativeInsertMany(entityName, data, options);
        const pks = this.getPrimaryKeyFields(entityName);
        const first = res.insertId as number - data.length + 1;
        res.rows ??= [];
        data.forEach((item, idx) => res.rows![idx] = { [pks[0]]: item[pks[0]] ?? first + idx });
        res.row = res.rows[0];

        return res;
    }
}
