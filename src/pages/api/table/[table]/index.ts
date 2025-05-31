import { Accept } from "@/lib/request";
import { csv, error, jsonFile, xml, yaml } from "@/lib/responses";
import { Result } from "@/lib/result";
import { tableToCSV, tableToJSON, tableToXML, toTableName } from "@/lib/table";
import type { APIRoute } from "astro";
import YAML from "js-yaml";

export const prerender = false;

export const GET: APIRoute = async ({ params, request }) => {
  const res = await Result.tryAsyncArgs(
    async ({ params, request }) => {
      const table = toTableName(params.table);
      if (table === undefined) {
        throw new Error("Invalid table");
      }

      const accept = Accept.fromString(request.headers.get("Accept"));
      const res = accept.getMIMETypePreference([
        "application/json",
        "text/csv",
        "application/xml",
        "application/yaml",
      ]);
      res.sort(({ quality: a }, { quality: b }) => b - a);

      switch (res[0].mimeType) {
        case "application/json":
          return jsonFile(await tableToJSON(table), table);
        case "text/csv":
          return csv(await tableToCSV(table), table);
        case "application/xml":
          return xml(await tableToXML(table), table);
        case "application/yaml":
          return yaml(
            YAML.dump(await tableToJSON(table), {
              indent: 2,
              lineWidth: -1,
              noRefs: true,
              sortKeys: true,
            }),
            table,
          );
        default:
          throw new Error("Unsupported format");
      }
    },
    { params, request },
  );
  if (res.is_err()) {
    return error(res.unwrap_err());
  }
  return res.unwrap();
};
