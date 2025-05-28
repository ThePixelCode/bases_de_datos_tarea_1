import fs from "fs/promises";
import path from "path";
import crypto from "crypto";
import { Result } from "@/lib/result";
import type { PathLike } from "fs";

export function getHash(
  buffer: Buffer<ArrayBufferLike>,
): Promise<Result<string, Error>> {
  return Result.tryAsyncArgs(
    async ({ buffer }) => {
      return crypto.createHash("sha256").update(buffer).digest("hex");
    },
    { buffer },
  );
}

export type Extension =
  | ".zip"
  | ".7z"
  | ".tar"
  | ".tar.gz"
  | ".tar.bz2"
  | ".tar.xz";
const SUPPORTED_FILE_EXTENSIONS: Extension[] = [
  ".zip",
  ".7z",
  ".tar",
  ".tar.gz",
  ".tar.bz2",
  ".tar.xz",
];

export function getFileExtension(
  file: File | string,
): Result<Extension, Error> {
  if (typeof file === "string") {
    return Result.tryArgs(
      ({ file }) => {
        const ext = SUPPORTED_FILE_EXTENSIONS.find((ext) => file.endsWith(ext));
        if (ext === undefined) {
          throw new Error("Extension not supported");
        }
        return ext;
      },
      { file },
    );
  } else {
    return Result.tryArgs(
      ({ file }) => {
        const ext = SUPPORTED_FILE_EXTENSIONS.find((ext) =>
          file.name.endsWith(ext),
        );
        if (ext === undefined) {
          throw new Error("Extension not supported");
        }
        return ext;
      },
      { file },
    );
  }
}

export function saveFile(
  folder: string,
  file: File,
): Promise<Result<string, Error>> {
  return Result.tryAsyncArgs(
    async ({ folder, file }) => {
      const extRes = getFileExtension(file);
      if (extRes.is_err()) {
        throw extRes.unwrap_err();
      }
      const ext = extRes.unwrap();
      const buffer = Buffer.from(await file.arrayBuffer());
      const hashRes = await getHash(buffer);
      if (hashRes.is_err()) {
        throw hashRes.unwrap_err();
      }
      const hash = hashRes.unwrap();
      const filePath = path.join(folder, `${hash}${ext}`);
      await fs.writeFile(filePath, buffer);
      return filePath;
    },
    { folder, file },
  );
}

export function readFile(
  filePath: PathLike,
): Promise<Result<{ data: ReadableStream<any>; length: number }, Error>> {
  return Result.tryAsyncArgs(
    async ({ filePath }) => {
      const buffer = await fs.readFile(filePath);
      const uint8Buffer = new Uint8Array(buffer);
      return {
        data: new ReadableStream({
          start(controller) {
            controller.enqueue(uint8Buffer);
            controller.close();
          },
        }),
        length: buffer.length,
      };
    },
    { filePath },
  );
}

export async function isSameFile(
  filePath: PathLike,
  buffer: Buffer<ArrayBufferLike>,
): Promise<boolean> {
  const file = await fs.readFile(filePath);
  return file.compare(buffer) === 0;
}

export function getFileName(filePath: string): string {
  return filePath.split("/").slice(-1)[0];
}

export function getFileLocation(filePath: string): string {
  return filePath.split("/").slice(0, -1).join("/");
}

type MIMETYPE =
  | "application/zip"
  | "application/x-7z-compressed"
  | "application/x-tar"
  | "application/gzip"
  | "application/x-bzip2"
  | "application/x-xz";

export function getMIMEType(ext: Extension): MIMETYPE {
  switch (ext) {
    case ".zip":
      return "application/zip";
    case ".7z":
      return "application/x-7z-compressed";
    case ".tar":
      return "application/x-tar";
    case ".tar.gz":
      return "application/gzip";
    case ".tar.bz2":
      return "application/x-bzip2";
    case ".tar.xz":
      return "application/x-xz";
  }
}
