export class Accept {
  private constructor(private mimetypes: Record<string, number>) {}

  public getMIMETypePreference<T extends readonly string[]>(
    mimetypes: T,
  ): { [K in keyof T]: { mimeType: string; quality: number } } {
    return mimetypes.map((s) => {
      return {
        mimeType: s,
        quality: this.mimetypes[s] ?? 0,
      };
    }) as {
      [K in keyof T]: { mimeType: string; quality: number };
    };
  }

  public static fromString(header: string | null): Accept {
    if (header === null) {
      throw new Error("Invalid Header");
    }
    const list: Record<string, number> = Object.fromEntries(
      header
        .split(",")
        .map((mime) => {
          const [mimetype, q] = mime.split(";") as [string, string | undefined];
          return {
            mimetype,
            q: q === undefined ? 1.0 : Number(q.replace("q=", "")),
          };
        })
        .map(({ mimetype, q }) => [mimetype, q]),
    );
    return new Accept(list);
  }
}
