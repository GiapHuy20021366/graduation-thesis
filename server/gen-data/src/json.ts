import * as fs from "fs";
import * as path from "path";

export const readJSON = <T>(filepath: string): T => {
  return JSON.parse(
    fs.readFileSync(path.resolve(__dirname, filepath), "utf-8")
  ) as T;
};

export const saveJSON = (filepath: string, data: any): void => {
  fs.writeFileSync(
    path.resolve(__dirname, filepath),
    JSON.stringify(data),
    "utf-8"
  );
};
