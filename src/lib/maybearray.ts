type One<T> = { arr: null; one: T };
type Arr<T> = { arr: T[]; one: null };
type MayArr<T> = One<T> | Arr<T>;
export class MaybeArr<T> {
  constructor(private inner: MayArr<T>) {}
  public toArray(): T[] {
    const inner = this.inner;
    if (inner.arr) {
      return inner.arr;
    }
    return [inner.one];
  }
  public getFirst(): T {
    const inner = this.inner;
    if (inner.one) {
      return inner.one as T;
    }
    if (inner.arr?.length === 0) {
      throw new Error("This is empty");
    }
    return (inner.arr as T[])[0];
  }
  static fromArray<T>(arr: T[]): MaybeArr<T> {
    return new MaybeArr({ arr: arr, one: null }) as unknown as MaybeArr<T>;
  }
  static fromOne<T>(one: T): MaybeArr<T> {
    return new MaybeArr({ arr: null, one: one }) as unknown as MaybeArr<T>;
  }
}
