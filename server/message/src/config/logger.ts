const Level = {
  info: "INFO",
  warn: "WARN",
  err: "ERR"
} as const;

const getHeaderLogger = (level: string): string => {
  let header = "";
  header += "[" + (new Date()).toUTCString() + "] ";
  header += "[" + level + "]";
  header += "  ";
  return header;
}

const getParamsLogger = (...params: any[]): string => {
  let message = "";
  for (const param of params) {
    if (typeof param === "object") {
      message += "\n";
    } else {
      message += " ";
    }
    message += param.toString();
  }
  return message;
}

const info = (...params: any[]): void => {
  let message = getHeaderLogger(Level.info) + getParamsLogger(...params);
  console.log(message);
}

const warn = (...params: any[]): void => {
  let message = getHeaderLogger(Level.warn) + getParamsLogger(...params);
  console.log(message);
}

const err = (...params: any[]): void => {
  let message = getHeaderLogger(Level.err) + getParamsLogger(...params);
  console.log(message);
}

export const logger = {
  info: info,
  err: err,
  warn: warn
}