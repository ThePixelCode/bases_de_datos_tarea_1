import { Result } from "./result";

export class SerializableError {
  private constructor(
    public message: string,
    public name: string,
    public stack: string | undefined,
  ) {}

  public static fromError(error: Error): SerializableError {
    return new SerializableError(
      error.message,
      error.name,
      error.stack === undefined
        ? undefined
        : error.stack.split("\n").slice(1).join("\n"),
    );
  }

  public static fromErrorLike(
    message: string,
    name: string,
    stack?: string | undefined,
  ): SerializableError {
    return new SerializableError(message, name, stack);
  }

  public static isError(obj: any): obj is SerializableError {
    return (
      typeof obj === "object" &&
      obj !== null &&
      Object.keys(obj).find((key) => key === "message") === "message" &&
      typeof obj.message === "string" &&
      Object.keys(obj).find((key) => key === "name") === "name" &&
      typeof obj.message === "string" &&
      ((Object.keys(obj).find((key) => key === "stack") === "stack" &&
        (typeof obj.stack === "string" || typeof obj.stack === "undefined")) ||
        Object.keys(obj).find((key) => key === "stack") === undefined)
    );
  }

  public static fromResponse(
    response: Response,
  ): Promise<Result<SerializableError, Error>> {
    return Result.tryAsyncArgs(
      async ({ response }) => {
        const json = await response.json();

        if (!SerializableError.isError(json)) {
          throw new Error("Invalid JSON");
        }

        return new SerializableError(json.message, json.name, json.stack);
      },
      { response },
    );
  }

  public toJSON(includeStack: boolean): string {
    if (includeStack) {
      return JSON.stringify({
        message: this.message,
        name: this.name,
        stack: this.stack,
      });
    }
    return JSON.stringify({ message: this.message, name: this.name });
  }

  public toString(): string {
    return `${this.name}: ${this.message}${this.stack === undefined ? "" : "\n" + this.stack}`;
  }
}
