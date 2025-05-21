type Err<E> = { ok: null; err: E };
type Ok<T> = { ok: T; err: null };
type Res<T, E> = Ok<T> | Err<E>;
export class Result<T, E> {
  constructor(private inner: Res<T, E>) {}

  public map<U>(callback: (ok: T) => U): Result<U, E> {
    const inner = this.inner;
    if (inner.err) {
      return new Result({ ok: null, err: inner.err }) as unknown as Result<
        U,
        E
      >;
    }
    return new Result({
      ok: callback(inner.ok as T),
      err: null,
    }) as unknown as Result<U, E>;
  }

  public is_ok(): boolean {
    if (this.inner.ok !== null) {
      return true;
    }
    return false;
  }

  public is_err(): boolean {
    if (this.inner.err !== null) {
      return true;
    }
    return false;
  }

  public return_err<U>(): Result<U, E> {
    if (this.is_ok()) {
      throw new Error("Got Ok when expected Err");
    }
    return this as unknown as Result<U, E>;
  }

  public getInner(): Res<T, E> {
    return this.inner;
  }

  public unwrap(): T {
    if (this.inner.ok === null) {
      throw new Error("tried to unwrap on Err!");
    }
    return this.inner.ok;
  }

  public unwrap_err(): E {
    if (this.inner.err === null) {
      throw new Error("tried to unwrap_err on Ok!");
    }
    return this.inner.err;
  }

  public map_err<U>(callback: (err: E) => U): Result<T, U> {
    const inner = this.inner;
    if (inner.ok) {
      return new Result({ err: null, ok: inner.ok }) as unknown as Result<T, U>;
    }
    return new Result({
      err: callback(inner.err as E),
      ok: null,
    }) as unknown as Result<T, U>;
  }

  static collect<T, E>(arr: Result<T, E>[]): Result<T[], E> {
    const arrT: T[] = [];
    for (let i = 0; i < arr.length; i++) {
      let res = arr[i];
      let inner = res.inner;
      if (inner.err) {
        // This is perfectly fine but the compiler doesn't shut up about it
        return new Result({ ok: null, err: inner.err }) as unknown as Result<
          T[],
          E
        >;
      } else {
        arrT[i] = inner.ok as T;
      }
    }
    return new Result({ ok: arrT, err: null }) as unknown as Result<T[], E>;
  }

  static ok<T, E>(ok: T): Result<T, E> {
    return new Result({ ok: ok, err: null }) as unknown as Result<T, E>;
  }

  static err<T, E>(err: E): Result<T, E> {
    return new Result({ ok: null, err: err }) as unknown as Result<T, E>;
  }
}
