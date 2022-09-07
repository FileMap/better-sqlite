import { AbstractSqlConnection } from '@mikro-orm/knex';
import type { Knex } from '@mikro-orm/knex';
export declare class BetterSqliteConnection extends AbstractSqlConnection {
    static readonly RUN_QUERY_RE: RegExp;
    connect(): Promise<void>;
    getDefaultClientUrl(): string;
    getClientUrl(): string;
    loadFile(path: string): Promise<void>;
    protected getKnexOptions(type: string): Knex.Config;
    protected transformRawResult<T>(res: any, method: 'all' | 'get' | 'run'): T;
    /**
   * monkey patch knex' BetterSqlite Dialect so it returns inserted id when doing raw insert query
   */
    private getPatchedDialect;
    private getCallMethod;
}
