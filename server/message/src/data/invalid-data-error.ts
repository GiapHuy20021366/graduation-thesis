import { HttpResponseCode } from "./http-response-code";
import { InternalError, InternalErrorInfo } from "./internal-error";

export interface InvalidDataErrorInfo extends InternalErrorInfo {}

export class InvalidDataError extends InternalError<InvalidDataErrorInfo> {
    constructor(info?: InvalidDataErrorInfo) {
        super(info);
        this.code = info?.code ?? HttpResponseCode.BAD_REQUEST;
    }
}
