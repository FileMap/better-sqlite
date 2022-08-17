import { ExceptionConverter } from '@mikro-orm/core';
import type { Dictionary, DriverException } from '@mikro-orm/core';
export declare class BetterSqliteExceptionConverter extends ExceptionConverter {
    /**
   * @inheritDoc
   * @link http://www.sqlite.org/c3ref/c_abort.html
   * @link https://github.com/doctrine/dbal/blob/master/src/Driver/AbstractSQLiteDriver.php
   */
    convertException(exception: Error & Dictionary): DriverException;
}
