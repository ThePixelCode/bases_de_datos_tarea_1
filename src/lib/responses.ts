import { SerializableError } from "./error";

export function json(value: any, status?: number): Response {
  return new Response(JSON.stringify(value), {
    status: status ?? 200,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function error(error: Error, status: number = 400): Response {
  if (error.message === "Not found") {
    status = 404;
  }
  return new Response(SerializableError.fromError(error).toJSON(false), {
    status: status,
    headers: {
      "Content-Type": "application/json",
    },
  });
}

export function file(
  body: BodyInit,
  contentType: string,
  filename: string,
  responseInit: ResponseInit,
): Response {
  const response_init: ResponseInit = {
    status: responseInit.status ?? 200,
    headers: {
      "Content-Type": contentType,
      "Content-Disposition": `attachment; filename="${filename}"`,
      ...responseInit.headers,
    },
    ...responseInit,
  };

  return new Response(body, response_init);
}

export function csv(
  body: BodyInit,
  filename: string,
  responseInit: ResponseInit,
): Response {
  return file(body, "text/csv", `${filename}.csv`, responseInit);
}

export function jsonFile(
  body: BodyInit,
  filename: string,
  responseInit: ResponseInit,
): Response {
  return file(body, "application/json", `${filename}.json`, responseInit);
}
