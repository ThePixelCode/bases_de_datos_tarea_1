const ERR = Symbol("Result.Err");
const OK = Symbol("Result.Ok");
export class Result<T, E> {
  private constructor(
    private ok: T | typeof OK,
    private err: E | typeof ERR,
  ) {}

  public map<U>(callback: (ok: T) => U): Result<U, E> {
    if (this.is_err()) {
      return this as Result<unknown, E> as Result<U, E>;
    }
    return Result.ok(callback(this.ok as T));
  }

  public map_err<U>(callback: (err: E) => U): Result<T, U> {
    if (this.is_ok()) {
      return this as Result<T, unknown> as Result<T, U>;
    }
    return Result.err(callback(this.err as E));
  }

  public is_ok(): boolean {
    if (this.ok !== OK) {
      return true;
    }
    return false;
  }

  public is_err(): boolean {
    if (this.err !== ERR) {
      return true;
    }
    return false;
  }

  public getInner(): { ok: T; err: null } | { ok: null; err: E } {
    if (this.is_err()) {
      return { ok: null, err: this.err as E };
    }
    return { ok: this.ok as T, err: null };
  }

  public return_err<U>(): Result<U, E> {
    if (this.is_ok()) {
      throw new Error("Got Ok when expected Err");
    }
    return this as Result<unknown, E> as Result<U, E>;
  }

  public unwrap(): T {
    if (this.is_err()) {
      throw new Error("tried to unwrap on Err!");
    }
    return this.ok as T;
  }

  public unwrap_err(): E {
    if (this.is_ok()) {
      throw new Error("tried to unwrap_err on Ok!");
    }
    return this.err as E;
  }

  public static try<T>(callback: () => T | Result<T, Error>): Result<T, Error> {
    try {
      const res = callback();
      if (res instanceof Result) {
        return res;
      }
      return Result.ok(res);
    } catch (err) {
      if (err instanceof Error) {
        return Result.err(err);
      }
      return Result.err(new Error(`Unknown error: ${err}`));
    }
  }

  public static tryArgs<T, F>(
    callback: (args: F) => T | Result<T, Error>,
    args: F,
  ): Result<T, Error> {
    try {
      const res = callback(args);
      if (res instanceof Result) {
        return res;
      }
      return Result.ok(res);
    } catch (err) {
      if (err instanceof Error) {
        return Result.err(err);
      }
      return Result.err(new Error(`Unknown error: ${err}`));
    }
  }

  public static async tryAsync<T>(
    callback: () => Promise<T | Result<T, Error>>,
  ): Promise<Result<T, Error>> {
    try {
      const res = await callback();
      if (res instanceof Result) {
        return res;
      }
      return Result.ok(res);
    } catch (err) {
      if (err instanceof Error) {
        return Result.err(err);
      }
      return Result.err(new Error(`Unknown error: ${err}`));
    }
  }

  public static async tryAsyncArgs<T, F>(
    callback: (args: F) => Promise<T | Result<T, Error>>,
    args: F,
  ): Promise<Result<T, Error>> {
    try {
      const res = await callback(args);
      if (res instanceof Result) {
        return res;
      }
      return Result.ok(res);
    } catch (err) {
      if (err instanceof Error) {
        return Result.err(err);
      }
      return Result.err(new Error(`Unknown error: ${err}`));
    }
  }

  static collect<T, E>(arr: Result<T, E>[]): Result<T[], E> {
    const arrT: T[] = [];
    for (let i = 0; i < arr.length; i++) {
      let res = arr[i];
      if (res.ok !== OK) {
        arrT[i] = res.ok;
      } else {
        return Result.err(res.err as E);
      }
    }
    return Result.ok(arrT);
  }

  static ok<T, E>(ok: T): Result<T, E> {
    return new Result(ok, ERR) as Result<T, E>;
  }

  static err<T, E>(err: E): Result<T, E> {
    return new Result(OK, err) as Result<T, E>;
  }
}
